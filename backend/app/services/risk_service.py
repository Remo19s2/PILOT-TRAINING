from datetime import datetime, timezone

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models import Quotation, Rfq, RfqSupplier, Supplier


class RiskService:
    def assess_supplier(self, db: Session, supplier_id: UUID, rfq_id: UUID | None = None) -> dict:
        supplier = db.get(Supplier, supplier_id)
        if not supplier:
            raise ValueError("Supplier not found")
        quotations = list(db.scalars(select(Quotation).where(Quotation.supplier_id == supplier_id)))
        delivery_risk = 0
        quality_risk = 0
        capacity_risk = 0
        inventory_exposure = 0
        drivers = []
        if supplier.status != "ACTIVE":
            quality_risk = 100
            drivers.append("Supplier is not active")
        if not quotations:
            delivery_risk = 50
            capacity_risk = 50
            drivers.append("No historical quotation evidence is available")
        else:
            delivery_risk = 0
            capacity_risk = 0
        rfq = db.get(Rfq, rfq_id) if rfq_id else None
        if rfq:
            current = [q for q in quotations if q.rfq_id == rfq_id and q.status != "SUPERSEDED"]
            if current:
                quote = current[-1]
                if quote.available_quantity < quote.quantity:
                    capacity_risk = max(capacity_risk, 75)
                    drivers.append("Quoted available quantity is below requested quantity")
                if quote.delivery_at > rfq.required_delivery_date:
                    delivery_risk = max(delivery_risk, 80)
                    drivers.append("Quoted delivery is after the required delivery date")
            assignment = db.scalar(select(RfqSupplier).where(RfqSupplier.rfq_id == rfq_id, RfqSupplier.supplier_id == supplier_id))
            if assignment and assignment.response_status in {"LATE", "NO_RESPONSE"}:
                delivery_risk = max(delivery_risk, 70)
                drivers.append(f"Response state is {assignment.response_status}")
            if not current:
                inventory_exposure = 50
                drivers.append("No current quotation is available for this RFQ")
        overall = round((delivery_risk + quality_risk + capacity_risk + inventory_exposure) / 4, 2)
        return {
            "supplier_id": supplier_id,
            "source": "database_evidence",
            "overall_risk": overall,
            "delivery_risk": delivery_risk,
            "inventory_exposure": inventory_exposure,
            "capacity_risk": capacity_risk,
            "quality_risk": quality_risk,
            "risk_drivers": drivers,
            "potential_impact": "Production or delivery impact requires review" if overall >= 50 else "No material risk signal in available evidence",
            "escalation_required": overall >= 70,
            "missing_information": [] if quotations else ["historical supplier performance"],
            "assessed_at": datetime.now(timezone.utc).isoformat(),
        }

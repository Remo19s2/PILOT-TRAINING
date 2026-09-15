from datetime import datetime, timezone
from decimal import Decimal
from uuid import UUID, uuid4

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models import DecisionRecommendation, Quotation, Rfq, Supplier, User
from .risk_service import RiskService


class DecisionService:
    def evaluate(self, db: Session, rfq: Rfq, requested_by: User, execution_id: UUID | None = None) -> DecisionRecommendation:
        quotations = list(db.scalars(select(Quotation).where(Quotation.rfq_id == rfq.id, Quotation.status != "SUPERSEDED").order_by(Quotation.submitted_at.desc())))
        latest = {}
        for quotation in quotations:
            latest.setdefault(quotation.supplier_id, quotation)
        candidates = []
        rejected = []
        risk_service = RiskService()
        for supplier_id, quotation in latest.items():
            supplier = db.get(Supplier, supplier_id)
            risk = risk_service.assess_supplier(db, supplier_id, rfq.id)
            reasons = []
            if not supplier or supplier.status != "ACTIVE": reasons.append("supplier is not active")
            if quotation.available_quantity < quotation.quantity: reasons.append("available capacity is below required quantity")
            if quotation.delivery_at > rfq.required_delivery_date: reasons.append("delivery is after required date")
            if reasons:
                rejected.append({"supplier_id": supplier_id, "reasons": reasons})
                continue
            price_score = Decimal("100") if not candidates else Decimal("0")
            delivery_at = quotation.delivery_at.replace(tzinfo=timezone.utc) if quotation.delivery_at.tzinfo is None else quotation.delivery_at
            candidates.append({"supplier_id": supplier_id, "quotation_id": quotation.id, "unit_price": float(quotation.unit_price), "quantity": quotation.quantity, "delivery_at": delivery_at.isoformat(), "risk": risk, "price_score": price_score})
        if candidates:
            min_price = min(item["unit_price"] for item in candidates)
            for item in candidates:
                item["price_score"] = round((min_price / item["unit_price"]) * 60, 2)
                item["delivery_score"] = round(max(0, 40 - max(0, (datetime.fromisoformat(item["delivery_at"]) - datetime.now(timezone.utc)).days) / 10), 2)
                item["risk_penalty"] = round(item["risk"]["overall_risk"] * 0.2, 2)
                item["overall_score"] = round(item["price_score"] + item["delivery_score"] - item["risk_penalty"], 2)
            candidates.sort(key=lambda item: item["overall_score"], reverse=True)
        recommendation = candidates[0] if candidates else None
        result = {"recommended_supplier_id": recommendation["supplier_id"] if recommendation else None, "recommended_quotation_id": recommendation["quotation_id"] if recommendation else None, "recommended_quantity": recommendation["quantity"] if recommendation else None, "recommendation_score": recommendation["overall_score"] if recommendation else None, "evaluated_supplier_count": len(latest), "feasible_supplier_count": len(candidates), "rejected_suppliers": rejected, "score_breakdown": candidates, "human_approval_required": True, "autonomous_execution_allowed": False}
        explanation = "Deterministic evaluation produced the ranking from database quotations, feasibility constraints, delivery, price, and risk evidence."
        if recommendation:
            explanation += f" {recommendation['supplier_id']} was ranked first by the deterministic supplier evaluation with an overall score of {recommendation['overall_score']}."
        decision = DecisionRecommendation(id=uuid4(), rfq_id=rfq.id, execution_id=execution_id, status="PENDING_HUMAN_REVIEW", recommendation=result, deterministic_result=result, explanation=explanation)
        db.add(decision)
        db.commit()
        db.refresh(decision)
        return decision

from datetime import datetime, timezone
from uuid import UUID, uuid4

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..audit import record_audit
from ..models import Approval, PurchaseOrder, PurchaseOrderItem, Quotation, Rfq, RfqItem, User


class PurchaseOrderService:
    def create_draft(self, db: Session, user: User, rfq_id: UUID, quotation_id: UUID) -> PurchaseOrder:
        quotation = db.get(Quotation, quotation_id)
        rfq = db.get(Rfq, rfq_id)
        approval = db.scalar(select(Approval).where(Approval.rfq_id == rfq_id, Approval.quotation_id == quotation_id, Approval.status == "APPROVED"))
        if not quotation or not rfq or quotation.rfq_id != rfq_id:
            raise ValueError("RFQ or quotation not found")
        if not approval:
            raise ValueError("An approved finance decision is required before creating a PO")
        existing = db.scalar(select(PurchaseOrder).where(PurchaseOrder.quotation_id == quotation_id, PurchaseOrder.status != "CANCELLED"))
        if existing:
            return existing
        po = PurchaseOrder(id=uuid4(), supplier_id=quotation.supplier_id, rfq_id=rfq_id, quotation_id=quotation_id, created_by=user.id, status="DRAFT")
        rfq_item = db.scalar(select(RfqItem).where(RfqItem.rfq_id == rfq_id).limit(1))
        po_item = PurchaseOrderItem(id=uuid4(), purchase_order_id=po.id, description=rfq_item.description if rfq_item else "Approved quotation item", quantity=quotation.quantity, unit_price=quotation.unit_price)
        db.add(po)
        db.add(po_item)
        record_audit(db, user, "PO_CREATED", "PURCHASE_ORDER", po.id, new_values={"status": po.status, "quotation_id": quotation_id})
        db.commit()
        db.refresh(po)
        return po
    def acknowledge(self, db: Session, user: User, po_id: UUID, accepted: bool, notes: str | None) -> PurchaseOrder:
        po = db.get(PurchaseOrder, po_id)
        if not po or po.supplier_id != user.supplier_id:
            raise ValueError("Purchase order not found")
        if po.status not in {"DRAFT", "SENT"}:
            raise ValueError("Purchase order cannot be acknowledged in its current state")
        po.status = "ACTIVE" if accepted else "REJECTED"
        po.acknowledged_at = datetime.now(timezone.utc)
        po.acknowledgement_notes = notes
        record_audit(db, user, "PO_ACKNOWLEDGED", "PURCHASE_ORDER", po.id, new_values={"status": po.status, "accepted": accepted})
        db.commit()
        db.refresh(po)
        return po

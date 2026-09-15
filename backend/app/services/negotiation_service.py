import json
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..audit import record_audit
from ..models import Negotiation, NegotiationMessage, Quotation, User


class NegotiationService:
    def draft(self, db: Session, user: User, quotation_id: str, dimensions: list[str]) -> dict:
        quotation = db.get(Quotation, quotation_id)
        if not quotation:
            raise ValueError("Quotation not found")
        negotiation = db.scalar(select(Negotiation).where(Negotiation.quotation_id == quotation_id).order_by(Negotiation.created_at.desc()))
        if not negotiation:
            negotiation = Negotiation(id=f"NEG-{uuid4().hex[:10].upper()}", rfq_id=quotation.rfq_id, quotation_id=quotation.id, supplier_id=quotation.supplier_id, status="DRAFT")
            db.add(negotiation)
            db.flush()
        content = {"dimensions": dimensions, "current_terms": {"unit_price": str(quotation.unit_price), "quantity": quotation.quantity, "delivery_at": quotation.delivery_at.isoformat(), "payment_terms": quotation.payment_terms}, "approval_required": True}
        message = NegotiationMessage(id=str(uuid4()), negotiation_id=negotiation.id, sender_type="AI", message_type="DRAFT", content=json.dumps(content))
        db.add(message)
        record_audit(db, user, "NEGOTIATION_DRAFTED", "NEGOTIATION", negotiation.id, new_values=content)
        db.commit()
        return {"negotiation_id": negotiation.id, "quotation_id": quotation_id, "strategy": content, "message_id": message.id, "status": negotiation.status}

    def authorize(self, db: Session, user: User, negotiation_id: str, content: str) -> dict:
        negotiation = db.get(Negotiation, negotiation_id)
        if not negotiation:
            raise ValueError("Negotiation not found")
        message = NegotiationMessage(id=str(uuid4()), negotiation_id=negotiation.id, sender_type="PROCUREMENT_MANAGER", message_type="AUTHORIZED_OUTBOUND", content=content, authorized_by=user.id)
        negotiation.status = "AUTHORIZED_PENDING_SEND"
        db.add(message)
        record_audit(db, user, "NEGOTIATION_AUTHORIZED", "NEGOTIATION", negotiation.id, new_values={"message_id": message.id})
        db.commit()
        return {"negotiation_id": negotiation.id, "message_id": message.id, "status": negotiation.status, "sent": False}

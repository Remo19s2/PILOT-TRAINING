from uuid import uuid4

from sqlalchemy.orm import Session

from .models import AuditLog, User


def record_audit(db: Session, user: User, action: str, entity_type: str, entity_id: str, old_values=None, new_values=None, execution_id: str | None = None) -> None:
    db.add(AuditLog(id=str(uuid4()), user_id=user.id, action=action, entity_type=entity_type, entity_id=entity_id, execution_id=execution_id, old_values=old_values, new_values=new_values))

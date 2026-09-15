from uuid import UUID, uuid4

from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from .models import AuditLog, User


def record_audit(db: Session, user: User, action: str, entity_type: str, entity_id: UUID, old_values=None, new_values=None, execution_id: UUID | None = None) -> None:
    db.add(AuditLog(id=uuid4(), user_id=user.id, action=action, entity_type=entity_type, entity_id=entity_id, execution_id=execution_id, old_values=jsonable_encoder(old_values), new_values=jsonable_encoder(new_values)))

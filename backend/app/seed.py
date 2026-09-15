from datetime import datetime, timedelta, timezone
from uuid import uuid4

from sqlalchemy import select

from .db import Base, SessionLocal, engine
from .models import PlanningRequirement, Role, Supplier, User
from .security import hash_password


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        roles = {}
        for name in ("PROCUREMENT_MANAGER", "SUPPLIER", "FINANCE_APPROVER"):
            role = db.scalar(select(Role).where(Role.name == name))
            if not role:
                role = Role(id=str(uuid4()), name=name)
                db.add(role)
            roles[name] = role
        supplier = db.scalar(select(Supplier).where(Supplier.id == "SUP-001"))
        if not supplier:
            supplier = Supplier(id="SUP-001", name="TechCorp Industries", category="Electronics", location="Taiwan")
            db.add(supplier)
        users = [
            ("procurement", "procurement123", "Procurement Manager", "procurement@mycelia.local", "PROCUREMENT_MANAGER", None),
            ("supplier", "supplier123", "TechCorp Industries", "supplier@mycelia.local", "SUPPLIER", "SUP-001"),
            ("finance", "finance123", "Finance Approver", "finance@mycelia.local", "FINANCE_APPROVER", None),
        ]
        for username, password, display_name, email, role_name, supplier_id in users:
            if not db.scalar(select(User).where(User.username == username)):
                db.add(User(id=f"USR-{uuid4().hex[:10].upper()}", username=username, password_hash=hash_password(password), display_name=display_name, email=email, role_id=roles[role_name].id, supplier_id=supplier_id))
        if not db.scalar(select(PlanningRequirement).where(PlanningRequirement.id == "REQ-001")):
            db.add(PlanningRequirement(id="REQ-001", component_name="Electronic Control Unit (ECU)", required_quantity=10000, current_inventory=3000, priority="CRITICAL", required_delivery_date=datetime.now(timezone.utc) + timedelta(days=30), status="NEW"))
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed()

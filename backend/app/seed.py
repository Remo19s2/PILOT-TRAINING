from datetime import datetime, timedelta, timezone
from uuid import UUID, uuid4

from sqlalchemy import select

from .db import Base, SessionLocal, engine
from .config import get_settings
from .models import PlanningRequirement, Role, Supplier, User, UserSupplier
from .security import hash_password

PLANNING_REQUIREMENT_ID = UUID("00000000-0000-4000-8000-000000000001")


def seed_production_accounts(db) -> None:
    role_names = ["PROCUREMENT_MANAGER", "SUPPLIER", "FINANCE_APPROVER"]
    roles = {}
    for role_name in role_names:
        role = db.scalar(select(Role).where(Role.name == role_name))
        if not role:
            role = Role(id=uuid4(), name=role_name)
            db.add(role)
        roles[role_name] = role

    supplier = db.scalar(select(Supplier).where(Supplier.code == "SUP-001"))
    if not supplier:
        supplier = Supplier(id=uuid4(), code="SUP-001", name="TechCorp Industries", status="ACTIVE")
        db.add(supplier)

    users = [
        ("procurement", "procurement123", "Procurement Manager", "procurement@mycelia.local", "PROCUREMENT_MANAGER", None),
        ("supplier", "supplier123", "TechCorp Industries", "supplier@mycelia.local", "SUPPLIER", "SUP-001"),
        ("finance", "finance123", "Finance Approver", "finance@mycelia.local", "FINANCE_APPROVER", None),
    ]

    for username, password, display_name, email, role_name, supplier_code in users:
        user = db.scalar(select(User).where(User.username == username))
        if not user:
            user = User(
                id=uuid4(),
                username=username,
                password_hash=hash_password(password),
                full_name=display_name,
                email=email,
                role_id=roles[role_name].id,
                is_active=True,
            )
            db.add(user)
            db.flush()

        if supplier_code and not db.scalar(
            select(UserSupplier).where(UserSupplier.user_id == user.user_id, UserSupplier.supplier_id == supplier.supplier_id)
        ):
            db.add(UserSupplier(user_id=user.user_id, supplier_id=supplier.supplier_id))

        if user.role_id != roles[role_name].id:
            user.role_id = roles[role_name].id


def seed() -> None:
    settings = get_settings()
    if not settings.is_production:
        Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_production_accounts(db)
        if not settings.is_production and not db.scalar(select(PlanningRequirement).where(PlanningRequirement.id == PLANNING_REQUIREMENT_ID)):
            db.add(PlanningRequirement(id=PLANNING_REQUIREMENT_ID, component_name="Electronic Control Unit (ECU)", required_quantity=10000, current_inventory=3000, priority="CRITICAL", required_delivery_date=datetime.now(timezone.utc) + timedelta(days=30), status="NEW"))
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed()

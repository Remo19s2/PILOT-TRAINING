from datetime import datetime, timedelta, timezone
from uuid import UUID

from fastapi.testclient import TestClient
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db import Base, get_db
from app.config import Settings
from app.main import app
from app.models import Role, Supplier, User, UserSupplier
from app.security import hash_password

engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
TestingSession = sessionmaker(bind=engine, expire_on_commit=False)
Base.metadata.create_all(engine)


def override_db():
    db = TestingSession()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_db
client = TestClient(app)

PROCUREMENT_ROLE_ID = UUID("11111111-1111-4111-8111-111111111111")
SUPPLIER_ROLE_ID = UUID("11111111-1111-4111-8111-111111111112")
FINANCE_ROLE_ID = UUID("11111111-1111-4111-8111-111111111113")
SUPPLIER_ID = UUID("22222222-2222-4222-8222-222222222222")
OTHER_SUPPLIER_ID = UUID("22222222-2222-4222-8222-222222222224")
PROCUREMENT_USER_ID = UUID("33333333-3333-4333-8333-333333333331")
SUPPLIER_USER_ID = UUID("33333333-3333-4333-8333-333333333332")
FINANCE_USER_ID = UUID("33333333-3333-4333-8333-333333333333")


def setup_module():
    db = TestingSession()
    procurement_role = Role(id=PROCUREMENT_ROLE_ID, name="PROCUREMENT_MANAGER")
    supplier_role = Role(id=SUPPLIER_ROLE_ID, name="SUPPLIER")
    finance_role = Role(id=FINANCE_ROLE_ID, name="FINANCE_APPROVER")
    db.add_all([procurement_role, supplier_role, finance_role, Supplier(id=SUPPLIER_ID, code="SUP-TEST", name="Test Supplier"), Supplier(id=OTHER_SUPPLIER_ID, code="SUP-OTHER", name="Other Supplier"), User(id=PROCUREMENT_USER_ID, username="pm", password_hash=hash_password("secret"), display_name="PM", email="pm@test.local", role_id=procurement_role.id), User(id=SUPPLIER_USER_ID, username="supplier-test", password_hash=hash_password("secret"), display_name="Supplier", email="supplier@test.local", role_id=supplier_role.id), User(id=FINANCE_USER_ID, username="finance-test", password_hash=hash_password("secret"), display_name="Finance", email="finance@test.local", role_id=finance_role.id)])
    db.add(UserSupplier(user_id=SUPPLIER_USER_ID, supplier_id=SUPPLIER_ID))
    db.commit()
    db.close()


def token(username):
    response = client.post("/api/auth/login", json={"username": username, "password": "secret"})
    assert response.status_code == 200
    return response.json()["access_token"]


def test_rfq_stays_open_until_evaluation_threshold():
    auth = {"Authorization": f"Bearer {token('pm')}"}
    now = datetime.now(timezone.utc)
    response = client.post("/api/rfqs", headers=auth, json={"quotation_deadline": (now + timedelta(days=2)).isoformat(), "required_delivery_date": (now + timedelta(days=10)).isoformat(), "evaluation_policy": "All valid offers reviewed after deadline", "expected_supplier_count": 1, "minimum_valid_quotation_count": 1, "supplier_ids": [str(SUPPLIER_ID)], "items": [{"description": "ECU", "quantity": 10}]})
    assert response.status_code == 201
    rfq_id = response.json()["id"]
    assert client.post(f"/api/rfqs/{rfq_id}/send", headers=auth, json={"supplier_ids": [str(SUPPLIER_ID)]}).status_code == 200
    supplier_auth = {"Authorization": f"Bearer {token('supplier-test')}"}
    quotation = client.post("/api/quotations", headers=supplier_auth, json={"rfq_id": rfq_id, "supplier_id": str(SUPPLIER_ID), "unit_price": 10, "total_price": 100, "quantity": 10, "available_quantity": 10, "delivery_at": (now + timedelta(days=8)).isoformat()})
    assert quotation.status_code == 201
    selected = client.post(f"/api/rfqs/{rfq_id}/select", headers=auth, json={"quotation_id": quotation.json()["id"]})
    assert selected.status_code == 200


def test_supplier_cannot_read_another_supplier_record():
    supplier_auth = {"Authorization": f"Bearer {token('supplier-test')}"}
    assert client.get(f"/api/suppliers/{OTHER_SUPPLIER_ID}", headers=supplier_auth).status_code == 403


def test_event_creates_waiting_execution_without_sns_configuration():
    auth = {"Authorization": f"Bearer {token('pm')}"}
    response = client.post("/api/workflows/events", headers=auth, json={"event_type": "SUPPLIER_DELAY", "priority": "HIGH", "source": {"supplier_id": str(SUPPLIER_ID)}, "context": {"reported_by": "test"}})
    assert response.status_code == 202
    assert response.json()["status"] == "WAITING_FOR_SNS"


def test_supplier_cannot_approve():
    supplier_auth = {"Authorization": f"Bearer {token('supplier-test')}"}
    assert client.post(f"/api/approvals/{UUID('44444444-4444-4444-8444-444444444444')}/approve", headers=supplier_auth).status_code == 403


def test_risk_endpoint_returns_structured_evidence():
    auth = {"Authorization": f"Bearer {token('pm')}"}
    response = client.get(f"/api/suppliers/{SUPPLIER_ID}/risk", headers=auth)
    assert response.status_code == 200
    assert response.json()["source"] == "database_evidence"
    assert "risk_drivers" in response.json()


def test_health_is_lightweight():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_production_settings_reject_development_defaults():
    try:
        Settings(app_env="production", database_url="postgresql+psycopg://user:password@db.example.com/prod", jwt_secret_key="short", cors_origins="https://prism.example.com")
    except ValueError as error:
        assert "JWT_SECRET_KEY" in str(error)
    else:
        raise AssertionError("Production settings accepted an insecure JWT secret")


def test_production_settings_require_external_database_url():
    try:
        Settings(app_env="production", jwt_secret_key="x" * 32, cors_origins="https://prism.example.com")
    except ValueError as error:
        assert "DATABASE_URL" in str(error)
    else:
        raise AssertionError("Production settings accepted a missing DATABASE_URL")


def test_supplier_membership_is_derived_from_user_suppliers_and_role_name_mapping():
    db = TestingSession()
    role = db.scalar(select(Role).where(Role.name == "SUPPLIER"))
    if role is None:
        role = Role(role_id=SUPPLIER_ROLE_ID, role_name="SUPPLIER")
        db.add(role)
    supplier = Supplier(supplier_id=UUID("22222222-2222-4222-8222-222222222223"), supplier_code="SUP-001", supplier_name="ACME Components")
    user = User(user_id=UUID("33333333-3333-4333-8333-333333333334"), role_id=role.role_id, full_name="Supplier User", email="supplier-demo@example.com", password_hash=hash_password("secret"), username="supplier-demo", is_active=True)
    db.add_all([supplier, user])
    db.add(UserSupplier(user_id=user.user_id, supplier_id=supplier.supplier_id))
    db.commit()

    db_user = db.get(User, user.user_id)
    assert db_user.role.role_name == "SUPPLIER"
    assert db_user.supplier_id == supplier.supplier_id
    assert db_user.username == "supplier-demo"
    db.close()

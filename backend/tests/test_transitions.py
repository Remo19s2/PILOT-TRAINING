from datetime import datetime, timedelta, timezone

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db import Base, get_db
from app.config import Settings
from app.main import app
from app.models import Role, Supplier, User
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


def setup_module():
    db = TestingSession()
    procurement_role = Role(id="role-pm", name="PROCUREMENT_MANAGER")
    supplier_role = Role(id="role-supplier", name="SUPPLIER")
    finance_role = Role(id="role-finance", name="FINANCE_APPROVER")
    db.add_all([procurement_role, supplier_role, finance_role, Supplier(id="SUP-TEST", name="Test Supplier"), User(id="user-pm", username="pm", password_hash=hash_password("secret"), display_name="PM", email="pm@test.local", role_id=procurement_role.id), User(id="user-supplier", username="supplier-test", password_hash=hash_password("secret"), display_name="Supplier", email="supplier@test.local", role_id=supplier_role.id, supplier_id="SUP-TEST"), User(id="user-finance", username="finance-test", password_hash=hash_password("secret"), display_name="Finance", email="finance@test.local", role_id=finance_role.id)])
    db.commit()
    db.close()


def token(username):
    response = client.post("/api/auth/login", json={"username": username, "password": "secret"})
    assert response.status_code == 200
    return response.json()["access_token"]


def test_rfq_stays_open_until_evaluation_threshold():
    auth = {"Authorization": f"Bearer {token('pm')}"}
    now = datetime.now(timezone.utc)
    response = client.post("/api/rfqs", headers=auth, json={"quotation_deadline": (now + timedelta(days=2)).isoformat(), "required_delivery_date": (now + timedelta(days=10)).isoformat(), "evaluation_policy": "All valid offers reviewed after deadline", "expected_supplier_count": 1, "minimum_valid_quotation_count": 1, "supplier_ids": ["SUP-TEST"], "items": [{"description": "ECU", "quantity": 10}]})
    assert response.status_code == 201
    rfq_id = response.json()["id"]
    assert client.post(f"/api/rfqs/{rfq_id}/send", headers=auth, json={"supplier_ids": ["SUP-TEST"]}).status_code == 200
    supplier_auth = {"Authorization": f"Bearer {token('supplier-test')}"}
    quotation = client.post("/api/quotations", headers=supplier_auth, json={"rfq_id": rfq_id, "supplier_id": "SUP-TEST", "unit_price": 10, "total_price": 100, "quantity": 10, "available_quantity": 10, "delivery_at": (now + timedelta(days=8)).isoformat()})
    assert quotation.status_code == 201
    selected = client.post(f"/api/rfqs/{rfq_id}/select", headers=auth, json={"quotation_id": quotation.json()["id"]})
    assert selected.status_code == 200


def test_supplier_cannot_read_another_supplier_record():
    supplier_auth = {"Authorization": f"Bearer {token('supplier-test')}"}
    assert client.get("/api/suppliers/unknown", headers=supplier_auth).status_code == 403


def test_event_creates_waiting_execution_without_sns_configuration():
    auth = {"Authorization": f"Bearer {token('pm')}"}
    response = client.post("/api/workflows/events", headers=auth, json={"event_type": "SUPPLIER_DELAY", "priority": "HIGH", "source": {"supplier_id": "SUP-TEST"}, "context": {"reported_by": "test"}})
    assert response.status_code == 202
    assert response.json()["status"] == "WAITING_FOR_SNS"


def test_supplier_cannot_approve():
    supplier_auth = {"Authorization": f"Bearer {token('supplier-test')}"}
    assert client.post("/api/approvals/APR-UNKNOWN/approve", headers=supplier_auth).status_code == 403


def test_risk_endpoint_returns_structured_evidence():
    auth = {"Authorization": f"Bearer {token('pm')}"}
    response = client.get("/api/suppliers/SUP-TEST/risk", headers=auth)
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

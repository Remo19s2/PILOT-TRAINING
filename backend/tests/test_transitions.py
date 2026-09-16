from datetime import datetime, timedelta, timezone
import hashlib
import hmac
from uuid import UUID, uuid4

from fastapi.testclient import TestClient
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db import Base, get_db
from app.config import Settings
from app import main as main_module
from app.main import app
from app.models import AuditLog, Role, Supplier, User, UserSupplier, WorkflowExecution
from app.security import hash_password
from app.services.sns.exceptions import SnsResponseError
from app.services.workflow_execution_service import WorkflowExecutionService

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

    db = TestingSession()
    try:
        execution_id = UUID(response.json()["id"])
        execution = db.get(WorkflowExecution, execution_id)
        audit = db.query(AuditLog).filter_by(execution_id=execution_id, action="WORKFLOW_REQUESTED").one()
        assert execution is not None
        assert audit.entity_id == execution.id
        assert audit.execution_id == execution.id
        assert execution.status == "WAITING_FOR_SNS"
    finally:
        db.close()


def test_sns_webhook_accepts_correct_hmac_signature(monkeypatch):
    sns_execution_id = "sns-webhook-hmac"
    db = TestingSession()
    db.add(WorkflowExecution(id=uuid4(), workflow_type="PROCUREMENT", event_type="SUPPLIER_DELAY", status="WAITING_FOR_SNS", sns_execution_id=sns_execution_id, input_payload={}))
    db.commit()
    db.close()

    settings = Settings(sns_webhook_secret="webhook-secret", sns_webhook_auth_mode="hmac")
    monkeypatch.setattr(main_module, "settings", settings)
    body = (f'{{"sns_execution_id":"{sns_execution_id}","status":"COMPLETED","output_payload":{{"source":"sns"}}}}').encode()
    signature = hmac.new(b"webhook-secret", body, hashlib.sha256).hexdigest()

    response = client.post("/api/sns/webhook", content=body, headers={"X-SNS-Signature": signature})

    assert response.status_code == 200
    assert response.json()["status"] == "COMPLETED"


def test_sns_webhook_rejects_incorrect_hmac_signature(monkeypatch):
    settings = Settings(sns_webhook_secret="webhook-secret", sns_webhook_auth_mode="hmac")
    monkeypatch.setattr(main_module, "settings", settings)

    response = client.post("/api/sns/webhook", content=b'{"execution_id":"missing"}', headers={"X-SNS-Signature": "invalid"})

    assert response.status_code == 401


def test_sns_webhook_accepts_correct_shared_secret(monkeypatch):
    execution_id = "sns-webhook-shared-secret"
    db = TestingSession()
    db.add(WorkflowExecution(id=uuid4(), workflow_type="PROCUREMENT", event_type="SUPPLIER_DELAY", status="WAITING_FOR_SNS", sns_execution_id=execution_id, input_payload={}))
    db.commit()
    db.close()

    settings = Settings(sns_webhook_secret="webhook-secret", sns_webhook_auth_mode="shared_secret", sns_webhook_signature_header="X-SNS-Webhook-Secret")
    monkeypatch.setattr(main_module, "settings", settings)
    body = (f'{{"execution_id":"{execution_id}"}}').encode()

    response = client.post("/api/sns/webhook", content=body, headers={"X-SNS-Webhook-Secret": "webhook-secret"})

    assert response.status_code == 200


def test_sns_webhook_rejects_incorrect_shared_secret(monkeypatch):
    settings = Settings(sns_webhook_secret="webhook-secret", sns_webhook_auth_mode="shared_secret", sns_webhook_signature_header="X-SNS-Webhook-Secret")
    monkeypatch.setattr(main_module, "settings", settings)

    response = client.post("/api/sns/webhook", content=b'{"execution_id":"missing"}', headers={"X-SNS-Webhook-Secret": "invalid"})

    assert response.status_code == 401


def test_sns_webhook_rejects_missing_header(monkeypatch):
    settings = Settings(sns_webhook_secret="webhook-secret", sns_webhook_auth_mode="shared_secret", sns_webhook_signature_header="X-SNS-Webhook-Secret")
    monkeypatch.setattr(main_module, "settings", settings)

    response = client.post("/api/sns/webhook", content=b'{"execution_id":"missing"}')

    assert response.status_code == 401


def test_sns_webhook_callback_correlates_by_prism_execution_id(monkeypatch):
    prism_execution_id = uuid4()
    db = TestingSession()
    db.add(WorkflowExecution(id=prism_execution_id, workflow_type="PROCUREMENT", event_type="SUPPLIER_DELAY", status="WAITING_FOR_SNS", input_payload={}))
    db.commit()
    db.close()

    settings = Settings(sns_webhook_secret="webhook-secret", sns_webhook_auth_mode="shared_secret", sns_webhook_signature_header="X-SNS-Webhook-Secret")
    monkeypatch.setattr(main_module, "settings", settings)
    body = (f'{{"prism_execution_id":"{prism_execution_id}","status":"COMPLETED","output_payload":{{"test":true}}}}').encode()

    response = client.post("/api/sns/webhook", content=body, headers={"X-SNS-Webhook-Secret": "webhook-secret"})

    assert response.status_code == 200
    assert response.json()["status"] == "COMPLETED"
    db = TestingSession()
    try:
        assert db.get(WorkflowExecution, prism_execution_id).output_payload["output_payload"] == {"test": True}
    finally:
        db.close()


def test_sns_webhook_callback_rejects_unknown_correlation_id(monkeypatch):
    settings = Settings(sns_webhook_secret="webhook-secret", sns_webhook_auth_mode="shared_secret", sns_webhook_signature_header="X-SNS-Webhook-Secret")
    monkeypatch.setattr(main_module, "settings", settings)
    body = b'{"prism_execution_id":"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"}'

    response = client.post("/api/sns/webhook", content=body, headers={"X-SNS-Webhook-Secret": "webhook-secret"})

    assert response.status_code == 404
    assert response.json()["detail"] == "Unknown SNS execution"


def test_sns_webhook_callback_rejects_missing_correlation_id(monkeypatch):
    settings = Settings(sns_webhook_secret="webhook-secret", sns_webhook_auth_mode="shared_secret", sns_webhook_signature_header="X-SNS-Webhook-Secret")
    monkeypatch.setattr(main_module, "settings", settings)

    response = client.post("/api/sns/webhook", content=b'{"status":"COMPLETED"}', headers={"X-SNS-Webhook-Secret": "webhook-secret"})

    assert response.status_code == 422


def test_sns_ack_without_execution_id_keeps_prism_correlation_id_and_waits_for_sns():
    db = TestingSession()
    try:
        user = db.get(User, PROCUREMENT_USER_ID)
        prism_execution_id = uuid4()
        execution = WorkflowExecution(
            id=prism_execution_id,
            workflow_type="PROCUREMENT",
            event_type="SUPPLIER_DELAY",
            status="QUEUED",
            requested_by=user.id,
            input_payload={"event_id": "event-1"},
        )
        db.add(execution)
        db.commit()

        service = WorkflowExecutionService(Settings(sns_master_workflow_id="master-workflow"))
        service.sns.start = lambda workflow_id, payload, execution_id: {
            "execution_id": None,
            "status": None,
            "raw": {},
        }
        result = service.dispatch(db, user, execution)

        assert result.id == prism_execution_id
        assert result.status == "WAITING_FOR_SNS"
        assert result.sns_execution_id is None
        assert result.input_payload == {"event_id": "event-1"}
    finally:
        db.close()


def test_sns_execution_id_is_stored_when_returned():
    db = TestingSession()
    try:
        user = db.get(User, PROCUREMENT_USER_ID)
        execution = WorkflowExecution(id=uuid4(), workflow_type="PROCUREMENT", event_type="SUPPLIER_DELAY", status="QUEUED", requested_by=user.id, input_payload={})
        db.add(execution)
        db.commit()

        service = WorkflowExecutionService(Settings(sns_master_workflow_id="master-workflow"))
        service.sns.start = lambda workflow_id, payload, execution_id: {
            "execution_id": "sns-execution-1",
            "status": "started",
            "raw": {"execution_id": "sns-execution-1"},
        }
        result = service.dispatch(db, user, execution)

        assert result.status == "WAITING_FOR_SNS"
        assert result.sns_execution_id == "sns-execution-1"
    finally:
        db.close()


def test_sns_dispatch_error_marks_execution_failed():
    db = TestingSession()
    try:
        user = db.get(User, PROCUREMENT_USER_ID)
        execution = WorkflowExecution(
            id=uuid4(),
            workflow_type="PROCUREMENT",
            event_type="SUPPLIER_DELAY",
            status="QUEUED",
            requested_by=user.id,
            input_payload={},
        )
        db.add(execution)
        db.commit()

        service = WorkflowExecutionService(Settings(sns_master_workflow_id="master-workflow"))
        service.sns.start = lambda workflow_id, payload, execution_id: (_ for _ in ()).throw(SnsResponseError("server error"))
        result = service.dispatch(db, user, execution)

        assert result.status == "FAILED"
        assert result.error_message == "server error"
    finally:
        db.close()


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

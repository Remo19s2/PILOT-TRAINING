from datetime import datetime, timezone
import logging
import time
from uuid import uuid4

from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from .audit import record_audit
from .config import get_settings
from .db import Base, engine
from .dependencies import DbSession, current_user, require_roles
from .models import Approval, DecisionRecommendation, Negotiation, NegotiationMessage, PlanningRequirement, PurchaseOrder, Quotation, Rfq, RfqItem, RfqSupplier, Role, Supplier, User, WorkflowExecution
from .schemas import ApprovalReject, DecisionAction, LoginRequest, NegotiationAuthorization, NegotiationDraftRequest, ProcurementEventIn, PurchaseOrderAcknowledgement, PurchaseOrderCreate, PurchaseOrderOut, QuotationCreate, QuotationOut, RefreshRequest, RfqCreate, RfqOut, RfqSend, SessionOut, SupplierSelection, UserOut, WorkflowExecutionOut
from .security import create_access_token, create_refresh_token, decode_token, hash_password, verify_password
from .services.decision_service import DecisionService
from .services.negotiation_service import NegotiationService
from .services.purchase_order_service import PurchaseOrderService
from .services.risk_service import RiskService
from .services.workflow_execution_service import WorkflowExecutionService
from .services.sns.adapter import SnsAdapter

settings = get_settings()
logger = logging.getLogger("prism.api")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
app = FastAPI(title="Mycelia Procurement Intelligence API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=settings.cors_origin_list, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


@app.middleware("http")
async def log_requests(request: Request, call_next):
    started_at = time.perf_counter()
    try:
        response = await call_next(request)
    except Exception:
        logger.exception("Unhandled request failure: %s %s", request.method, request.url.path)
        raise
    duration_ms = (time.perf_counter() - started_at) * 1000
    if response.status_code >= 500:
        logger.error("Request failed: %s %s -> %s (%.1f ms)", request.method, request.url.path, response.status_code, duration_ms)
    return response


@app.on_event("startup")
def initialize_runtime() -> None:
    if settings.is_production:
        try:
            with engine.connect() as connection:
                connection.execute(text("SELECT 1"))
            logger.info("Production database connectivity verified")
        except Exception as error:
            logger.exception("Production database connectivity check failed")
            raise RuntimeError("DATABASE_URL is unavailable or unreachable") from error
    elif settings.auto_create_schema:
        logger.warning("AUTO_CREATE_SCHEMA is enabled; use migrations instead for production")
        Base.metadata.create_all(bind=engine)


def user_out(user: User) -> UserOut:
    return UserOut(id=user.id, username=user.username, display_name=user.display_name, email=user.email, role=user.role.name, supplier_id=user.supplier_id)


def supplier_scope(user: User, supplier_id: str) -> None:
    if user.role.name == "SUPPLIER" and user.supplier_id != supplier_id:
        raise HTTPException(status_code=403, detail="Suppliers may only access their own records")


def utc_datetime(value: datetime) -> datetime:
    return value.replace(tzinfo=timezone.utc) if value.tzinfo is None else value


def execution_out(execution: WorkflowExecution) -> WorkflowExecutionOut:
    return WorkflowExecutionOut(id=execution.id, workflow_type=execution.workflow_type, event_type=execution.event_type, parent_execution_id=execution.parent_execution_id, status=execution.status, rfq_id=execution.rfq_id, supplier_id=execution.supplier_id, sns_workflow_id=execution.sns_workflow_id, sns_execution_id=execution.sns_execution_id, input_payload=execution.input_payload or {}, output_payload=execution.output_payload, error_message=execution.error_message, started_at=execution.started_at, completed_at=execution.completed_at, created_at=execution.created_at)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/workflows/events", response_model=WorkflowExecutionOut, status_code=status.HTTP_202_ACCEPTED)
def create_workflow_event(payload: ProcurementEventIn, db: DbSession, user: User = Depends(current_user)) -> WorkflowExecutionOut:
    service = WorkflowExecutionService(settings)
    source = payload.source.model_dump()
    source["user_id"] = source.get("user_id") or user.id
    execution = service.create_master_execution(db, user, payload.event_type, payload.priority, source, payload.context)
    return execution_out(service.dispatch(db, user, execution))


@app.post("/api/monitoring/events", response_model=WorkflowExecutionOut, status_code=status.HTTP_202_ACCEPTED)
def create_monitoring_event(payload: ProcurementEventIn, db: DbSession, user: User = Depends(current_user)) -> WorkflowExecutionOut:
    if payload.event_type not in {"SUPPLIER_DELAY", "SUPPLIER_QUALITY_ISSUE", "SUPPLIER_SHORTAGE", "SUPPLIER_CAPACITY_RISK", "SUPPLIER_PRICE_CHANGE", "PRODUCTION_DISRUPTION", "OTHER"}:
        raise HTTPException(status_code=422, detail="Event type is not valid for monitoring")
    return create_workflow_event(payload, db, user)


@app.get("/api/workflows/executions/{execution_id}", response_model=WorkflowExecutionOut)
def get_workflow_execution(execution_id: str, db: DbSession, user: User = Depends(current_user)) -> WorkflowExecutionOut:
    execution = db.get(WorkflowExecution, execution_id)
    if not execution:
        raise HTTPException(status_code=404, detail="Workflow execution not found")
    if user.role.name == "SUPPLIER" and execution.supplier_id != user.supplier_id:
        raise HTTPException(status_code=403, detail="Execution is not available to this supplier")
    return execution_out(execution)


@app.post("/api/sns/webhook", response_model=WorkflowExecutionOut)
async def sns_webhook(request: Request, db: DbSession) -> WorkflowExecutionOut:
    body = await request.body()
    if not SnsAdapter(settings).verify_webhook(body, request.headers.get(settings.sns_webhook_signature_header)):
        logger.warning("Rejected SNS webhook signature")
        raise HTTPException(status_code=401, detail="Invalid SNS webhook signature")
    try:
        payload = await request.json()
    except ValueError as error:
        raise HTTPException(status_code=400, detail="Malformed webhook JSON") from error
    execution_id = payload.get("execution_id")
    if not execution_id:
        raise HTTPException(status_code=422, detail="Webhook execution_id is required")
    execution = db.scalar(select(WorkflowExecution).where(WorkflowExecution.sns_execution_id == str(execution_id)).with_for_update())
    if not execution:
        raise HTTPException(status_code=404, detail="Unknown SNS execution")
    if execution.status in {"COMPLETED", "FAILED"}:
        return execution_out(execution)
    return execution_out(WorkflowExecutionService(settings).apply_callback(db, execution, payload))


@app.post("/api/auth/login", response_model=SessionOut)
def login(payload: LoginRequest, db: DbSession) -> SessionOut:
    user = db.scalar(select(User).where(User.username == payload.username))
    if not user or not user.is_active or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return SessionOut(access_token=create_access_token(user.id), refresh_token=create_refresh_token(user.id), user=user_out(user))


@app.get("/api/auth/me", response_model=UserOut)
def me(user: User = Depends(current_user)) -> UserOut:
    return user_out(user)


@app.post("/api/auth/refresh", response_model=SessionOut)
def refresh(payload: RefreshRequest, db: DbSession) -> SessionOut:
    try:
        user_id = decode_token(payload.refresh_token, "refresh")
    except ValueError as error:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token") from error
    user = db.get(User, user_id)
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="Inactive user")
    return SessionOut(access_token=create_access_token(user.id), refresh_token=create_refresh_token(user.id), user=user_out(user))


@app.get("/api/suppliers", response_model=None)
def suppliers(db: DbSession, user: User = Depends(current_user)) -> list[Supplier]:
    if user.role.name == "SUPPLIER":
        return [db.get(Supplier, user.supplier_id)] if user.supplier_id else []
    return list(db.scalars(select(Supplier).order_by(Supplier.name)))


@app.get("/api/suppliers/{supplier_id}", response_model=None)
def supplier(supplier_id: str, db: DbSession, user: User = Depends(current_user)) -> Supplier:
    supplier_scope(user, supplier_id)
    result = db.get(Supplier, supplier_id)
    if not result:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return result


@app.get("/api/suppliers/{supplier_id}/risk")
def supplier_risk(supplier_id: str, db: DbSession, user: User = Depends(current_user)) -> dict:
    supplier_scope(user, supplier_id)
    if not db.get(Supplier, supplier_id):
        raise HTTPException(status_code=404, detail="Supplier not found")
    return RiskService().assess_supplier(db, supplier_id)


@app.get("/api/planning/requirements", response_model=None)
def requirements(db: DbSession, user: User = Depends(require_roles("PROCUREMENT_MANAGER"))) -> list[PlanningRequirement]:
    return list(db.scalars(select(PlanningRequirement).order_by(PlanningRequirement.priority, PlanningRequirement.id)))


@app.get("/api/planning/requirements/{requirement_id}", response_model=None)
def requirement(requirement_id: str, db: DbSession, user: User = Depends(require_roles("PROCUREMENT_MANAGER"))) -> PlanningRequirement:
    result = db.get(PlanningRequirement, requirement_id)
    if not result:
        raise HTTPException(status_code=404, detail="Planning requirement not found")
    return result


@app.post("/api/rfqs", response_model=RfqOut, status_code=status.HTTP_201_CREATED)
def create_rfq(payload: RfqCreate, db: DbSession, user: User = Depends(require_roles("PROCUREMENT_MANAGER"))) -> Rfq:
    if payload.minimum_valid_quotation_count > payload.expected_supplier_count:
        raise HTTPException(status_code=422, detail="Minimum valid quotations cannot exceed expected suppliers")
    suppliers = list(db.scalars(select(Supplier).where(Supplier.id.in_(payload.supplier_ids))))
    if len(suppliers) != len(set(payload.supplier_ids)):
        raise HTTPException(status_code=422, detail="One or more suppliers do not exist")
    now = datetime.now(timezone.utc)
    rfq = Rfq(id=f"RFQ-{uuid4().hex[:10].upper()}", requirement_id=payload.requirement_id, created_by=user.id, status="DRAFT", quotation_deadline=payload.quotation_deadline, required_delivery_date=payload.required_delivery_date, evaluation_policy=payload.evaluation_policy, expected_supplier_count=payload.expected_supplier_count, minimum_valid_quotation_count=payload.minimum_valid_quotation_count, created_at=now)
    rfq.items = [RfqItem(id=str(uuid4()), description=item.description, quantity=item.quantity, component_id=item.component_id) for item in payload.items]
    rfq.suppliers = [RfqSupplier(id=str(uuid4()), supplier_id=supplier_id, response_status="PENDING") for supplier_id in set(payload.supplier_ids)]
    db.add(rfq)
    record_audit(db, user, "RFQ_CREATED", "RFQ", rfq.id, new_values={"status": rfq.status, "supplier_ids": payload.supplier_ids})
    db.commit()
    db.refresh(rfq)
    return rfq


@app.get("/api/rfqs", response_model=list[RfqOut])
def list_rfqs(db: DbSession, user: User = Depends(current_user)) -> list[dict]:
    query = select(Rfq).order_by(Rfq.created_at.desc())
    if user.role.name == "SUPPLIER":
        query = query.join(RfqSupplier).where(RfqSupplier.supplier_id == user.supplier_id)
    return [{**RfqOut.model_validate(rfq).model_dump(), "component": rfq.items[0].description if rfq.items else None, "quantity": rfq.items[0].quantity if rfq.items else None} for rfq in db.scalars(query).unique()]


@app.get("/api/rfqs/{rfq_id}")
def get_rfq(rfq_id: str, db: DbSession, user: User = Depends(current_user)) -> dict:
    rfq = db.get(Rfq, rfq_id)
    if not rfq:
        raise HTTPException(status_code=404, detail="RFQ not found")
    if user.role.name == "SUPPLIER" and not any(item.supplier_id == user.supplier_id for item in rfq.suppliers):
        raise HTTPException(status_code=403, detail="RFQ is not available to this supplier")
    quotations = list(db.scalars(select(Quotation).where(Quotation.rfq_id == rfq_id, Quotation.status != "SUPERSEDED")))
    return {"rfq": RfqOut.model_validate(rfq), "items": rfq.items, "suppliers": rfq.suppliers, "quotations": [QuotationOut.model_validate(q) for q in quotations], "quotations_received": len({q.supplier_id for q in quotations})}


@app.post("/api/rfqs/{rfq_id}/send", response_model=RfqOut)
def send_rfq(rfq_id: str, payload: RfqSend, db: DbSession, user: User = Depends(require_roles("PROCUREMENT_MANAGER"))) -> Rfq:
    rfq = db.scalar(select(Rfq).where(Rfq.id == rfq_id).with_for_update())
    if not rfq:
        raise HTTPException(status_code=404, detail="RFQ not found")
    if rfq.status not in {"DRAFT", "OPEN"}:
        raise HTTPException(status_code=409, detail=f"RFQ cannot be sent from {rfq.status}")
    requested = set(payload.supplier_ids)
    invited = {item.supplier_id for item in rfq.suppliers}
    if not requested or not requested.issubset(invited):
        raise HTTPException(status_code=422, detail="All recipients must be assigned to the RFQ")
    now = datetime.now(timezone.utc)
    for item in rfq.suppliers:
        if item.supplier_id in requested:
            item.sent_at = now
            item.response_status = "PENDING"
    rfq.status = "OPEN"
    rfq.release_date = now
    record_audit(db, user, "RFQ_SENT", "RFQ", rfq.id, new_values={"status": rfq.status, "supplier_ids": list(requested)})
    db.commit()
    db.refresh(rfq)
    return rfq


@app.get("/api/rfqs/{rfq_id}/responses")
def rfq_responses(rfq_id: str, db: DbSession, user: User = Depends(current_user)) -> dict:
    rfq = db.get(Rfq, rfq_id)
    if not rfq:
        raise HTTPException(status_code=404, detail="RFQ not found")
    if user.role.name == "SUPPLIER" and not any(item.supplier_id == user.supplier_id for item in rfq.suppliers):
        raise HTTPException(status_code=403, detail="RFQ is not available to this supplier")
    now = datetime.now(timezone.utc)
    for item in rfq.suppliers:
        if item.response_status == "PENDING" and now > utc_datetime(rfq.quotation_deadline):
            item.response_status = "LATE"
    db.commit()
    return {"rfq_id": rfq_id, "received": sum(item.response_status == "RESPONDED" for item in rfq.suppliers), "expected": len(rfq.suppliers), "responses": rfq.suppliers}


@app.post("/api/quotations", response_model=QuotationOut, status_code=status.HTTP_201_CREATED)
def submit_quotation(payload: QuotationCreate, db: DbSession, user: User = Depends(require_roles("SUPPLIER"))) -> Quotation:
    supplier_scope(user, payload.supplier_id)
    rfq = db.get(Rfq, payload.rfq_id)
    assignment = db.scalar(select(RfqSupplier).where(RfqSupplier.rfq_id == payload.rfq_id, RfqSupplier.supplier_id == payload.supplier_id).with_for_update()) if rfq else None
    if not rfq or not assignment:
        raise HTTPException(status_code=404, detail="RFQ supplier assignment not found")
    if rfq.status != "OPEN":
        raise HTTPException(status_code=409, detail="RFQ is not open for quotations")
    if datetime.now(timezone.utc) > utc_datetime(rfq.quotation_deadline):
        raise HTTPException(status_code=409, detail="Quotation deadline has passed")
    latest = db.scalar(select(Quotation).where(Quotation.rfq_id == payload.rfq_id, Quotation.supplier_id == payload.supplier_id).order_by(Quotation.version.desc()).limit(1))
    if latest and latest.status != "SUPERSEDED":
        raise HTTPException(status_code=409, detail="A quotation already exists; use the revision endpoint")
    quotation = Quotation(id=f"QUOT-{uuid4().hex[:10].upper()}", version=1, status="SUBMITTED", **payload.model_dump())
    db.add(quotation)
    assignment.response_status = "RESPONDED"
    assignment.responded_at = datetime.now(timezone.utc)
    record_audit(db, user, "QUOTATION_SUBMITTED", "QUOTATION", quotation.id, new_values={"rfq_id": quotation.rfq_id, "supplier_id": quotation.supplier_id, "version": quotation.version})
    db.commit()
    db.refresh(quotation)
    return quotation


@app.get("/api/rfqs/{rfq_id}/quotations", response_model=list[QuotationOut])
def rfq_quotations(rfq_id: str, db: DbSession, user: User = Depends(current_user)) -> list[Quotation]:
    if not db.get(Rfq, rfq_id):
        raise HTTPException(status_code=404, detail="RFQ not found")
    query = select(Quotation).where(Quotation.rfq_id == rfq_id, Quotation.status != "SUPERSEDED")
    if user.role.name == "SUPPLIER": query = query.where(Quotation.supplier_id == user.supplier_id)
    return list(db.scalars(query).order_by(Quotation.submitted_at.desc()))


@app.get("/api/quotations/{quotation_id}", response_model=QuotationOut)
def get_quotation(quotation_id: str, db: DbSession, user: User = Depends(current_user)) -> Quotation:
    quotation = db.get(Quotation, quotation_id)
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
    supplier_scope(user, quotation.supplier_id)
    return quotation


@app.post("/api/quotations/{quotation_id}/revise", response_model=QuotationOut)
def revise_quotation(quotation_id: str, payload: QuotationCreate, db: DbSession, user: User = Depends(require_roles("SUPPLIER"))) -> Quotation:
    previous = db.scalar(select(Quotation).where(Quotation.id == quotation_id).with_for_update())
    if not previous or previous.supplier_id != user.supplier_id or previous.rfq_id != payload.rfq_id:
        raise HTTPException(status_code=404, detail="Quotation not found")
    if previous.status == "SUPERSEDED":
        raise HTTPException(status_code=409, detail="Only the current quotation can be revised")
    revision = Quotation(id=f"QUOT-{uuid4().hex[:10].upper()}", version=previous.version + 1, status="SUBMITTED", supersedes_id=previous.id, **payload.model_dump())
    previous.status = "SUPERSEDED"
    db.add(revision)
    record_audit(db, user, "QUOTATION_REVISED", "QUOTATION", revision.id, old_values={"quotation_id": previous.id, "version": previous.version}, new_values={"quotation_id": revision.id, "version": revision.version})
    db.commit()
    db.refresh(revision)
    return revision


@app.get("/api/approvals", response_model=None)
def approvals(db: DbSession, user: User = Depends(require_roles("PROCUREMENT_MANAGER", "FINANCE_APPROVER"))) -> list[Approval]:
    return list(db.scalars(select(Approval).order_by(Approval.id)))


@app.post("/api/rfqs/{rfq_id}/select")
def select_supplier(rfq_id: str, payload: SupplierSelection, db: DbSession, user: User = Depends(require_roles("PROCUREMENT_MANAGER"))) -> dict:
    rfq = db.scalar(select(Rfq).where(Rfq.id == rfq_id).with_for_update())
    quotation = db.scalar(select(Quotation).where(Quotation.id == payload.quotation_id, Quotation.rfq_id == rfq_id, Quotation.status != "SUPERSEDED").with_for_update())
    if not rfq or not quotation:
        raise HTTPException(status_code=404, detail="RFQ or quotation not found")
    if rfq.status != "OPEN":
        raise HTTPException(status_code=409, detail="Supplier selection is only allowed for an open RFQ")
    valid_count = db.scalar(select(Quotation.supplier_id).where(Quotation.rfq_id == rfq_id, Quotation.status != "SUPERSEDED").distinct())
    received_count = len(list(db.scalars(select(Quotation.supplier_id).where(Quotation.rfq_id == rfq_id, Quotation.status != "SUPERSEDED").distinct())))
    if received_count < rfq.minimum_valid_quotation_count:
        raise HTTPException(status_code=409, detail="RFQ evaluation condition is not satisfied")
    rfq.status = "SUPPLIER_SELECTED"
    approval = Approval(id=f"APR-{uuid4().hex[:10].upper()}", rfq_id=rfq_id, quotation_id=quotation.id, requested_by=user.id, status="PENDING")
    db.add(approval)
    record_audit(db, user, "SUPPLIER_SELECTED", "QUOTATION", quotation.id, new_values={"rfq_id": rfq_id, "approval_id": approval.id})
    record_audit(db, user, "APPROVAL_REQUESTED", "APPROVAL", approval.id, new_values={"status": approval.status})
    db.commit()
    return {"rfq_id": rfq_id, "quotation_id": quotation.id, "approval_id": approval.id, "status": rfq.status}


@app.get("/api/decisions/{rfq_id}")
def get_decision(rfq_id: str, db: DbSession, user: User = Depends(require_roles("PROCUREMENT_MANAGER", "FINANCE_APPROVER"))) -> dict:
    decision = db.scalar(select(DecisionRecommendation).where(DecisionRecommendation.rfq_id == rfq_id).order_by(DecisionRecommendation.created_at.desc()))
    if not decision:
        raise HTTPException(status_code=404, detail="No decision recommendation exists for this RFQ")
    return {"id": decision.id, "rfq_id": decision.rfq_id, "status": decision.status, "recommendation": decision.recommendation, "deterministic_result": decision.deterministic_result, "explanation": decision.explanation, "human_decision": decision.human_decision, "human_notes": decision.human_notes, "execution_id": decision.execution_id}


@app.post("/api/decisions/{rfq_id}/run", status_code=status.HTTP_202_ACCEPTED)
def run_decision(rfq_id: str, db: DbSession, user: User = Depends(require_roles("PROCUREMENT_MANAGER"))) -> dict:
    rfq = db.get(Rfq, rfq_id)
    if not rfq:
        raise HTTPException(status_code=404, detail="RFQ not found")
    responded = len(list(db.scalars(select(Quotation.supplier_id).where(Quotation.rfq_id == rfq_id, Quotation.status != "SUPERSEDED").distinct())))
    all_received = all(item.response_status in {"RESPONDED", "WITHDRAWN", "NO_RESPONSE", "LATE"} for item in rfq.suppliers)
    deadline_reached = datetime.now(timezone.utc) >= utc_datetime(rfq.quotation_deadline)
    if responded < rfq.minimum_valid_quotation_count and not (deadline_reached and all_received):
        raise HTTPException(status_code=409, detail="RFQ evaluation condition is not satisfied")
    execution = WorkflowExecutionService(settings).create_master_execution(db, user, "RFQ_ANALYSIS", "HIGH", {"user_id": user.id, "rfq_id": rfq_id}, {"stage": "DECISION_PRESCRIPTIVE"})
    decision = DecisionService().evaluate(db, rfq, user, execution.id)
    execution.status = "WAITING_FOR_HUMAN"
    db.commit()
    return {"execution_id": execution.id, "decision_id": decision.id, "status": decision.status}


@app.post("/api/decisions/{rfq_id}/action")
def decision_action(rfq_id: str, payload: DecisionAction, db: DbSession, user: User = Depends(require_roles("PROCUREMENT_MANAGER"))) -> dict:
    decision = db.scalar(select(DecisionRecommendation).where(DecisionRecommendation.rfq_id == rfq_id).order_by(DecisionRecommendation.created_at.desc()))
    if not decision:
        raise HTTPException(status_code=404, detail="Decision recommendation not found")
    if decision.human_decision:
        raise HTTPException(status_code=409, detail="Decision recommendation is already decided")
    decision.human_decision = payload.action
    decision.human_notes = payload.notes
    decision.status = {"ACCEPT": "ACCEPTED", "MODIFY": "MODIFIED", "REJECT": "REJECTED"}[payload.action]
    record_audit(db, user, f"RECOMMENDATION_{payload.action}", "DECISION", decision.id, new_values={"status": decision.status, "notes": payload.notes}, execution_id=decision.execution_id)
    db.commit()
    return {"decision_id": decision.id, "status": decision.status, "human_approval_required": True}


@app.post("/api/approvals/{approval_id}/approve", response_model=None)
def approve(approval_id: str, db: DbSession, user: User = Depends(require_roles("FINANCE_APPROVER"))) -> Approval:
    approval = db.scalar(select(Approval).where(Approval.id == approval_id).with_for_update())
    if not approval:
        raise HTTPException(status_code=404, detail="Approval not found")
    if approval.status != "PENDING":
        raise HTTPException(status_code=409, detail="Approval is already decided")
    approval.status = "APPROVED"
    approval.decided_at = datetime.now(timezone.utc)
    record_audit(db, user, "APPROVED", "APPROVAL", approval.id, new_values={"status": approval.status})
    db.commit()
    db.refresh(approval)
    return approval


@app.post("/api/approvals/{approval_id}/reject", response_model=None)
def reject(approval_id: str, payload: ApprovalReject, db: DbSession, user: User = Depends(require_roles("FINANCE_APPROVER"))) -> Approval:
    approval = db.scalar(select(Approval).where(Approval.id == approval_id).with_for_update())
    if not approval:
        raise HTTPException(status_code=404, detail="Approval not found")
    if approval.status != "PENDING":
        raise HTTPException(status_code=409, detail="Approval is already decided")
    approval.status = "REJECTED"
    approval.decision_reason = payload.reason
    approval.decided_at = datetime.now(timezone.utc)
    record_audit(db, user, "REJECTED", "APPROVAL", approval.id, new_values={"status": approval.status, "reason": payload.reason})
    db.commit()
    db.refresh(approval)
    return approval


@app.get("/api/negotiations")
def negotiations(db: DbSession, user: User = Depends(current_user)) -> list[dict]:
    query = select(Negotiation).order_by(Negotiation.created_at.desc())
    if user.role.name == "SUPPLIER":
        query = query.where(Negotiation.supplier_id == user.supplier_id)
    return [{"id": item.id, "rfq_id": item.rfq_id, "quotation_id": item.quotation_id, "supplier_id": item.supplier_id, "status": item.status, "messages": [{"id": message.id, "sender_type": message.sender_type, "message_type": message.message_type, "content": message.content, "created_at": message.created_at} for message in db.scalars(select(NegotiationMessage).where(NegotiationMessage.negotiation_id == item.id).order_by(NegotiationMessage.created_at))]} for item in db.scalars(query)]


@app.post("/api/negotiations/draft")
def draft_negotiation(payload: NegotiationDraftRequest, db: DbSession, user: User = Depends(require_roles("PROCUREMENT_MANAGER"))) -> dict:
    try:
        return NegotiationService().draft(db, user, payload.quotation_id, payload.dimensions)
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@app.post("/api/negotiations/{negotiation_id}/authorize")
def authorize_negotiation(negotiation_id: str, payload: NegotiationAuthorization, db: DbSession, user: User = Depends(require_roles("PROCUREMENT_MANAGER"))) -> dict:
    try:
        return NegotiationService().authorize(db, user, negotiation_id, payload.message)
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@app.get("/api/purchase-orders", response_model=list[PurchaseOrderOut])
def list_purchase_orders(db: DbSession, user: User = Depends(current_user)) -> list[PurchaseOrder]:
    query = select(PurchaseOrder).order_by(PurchaseOrder.created_at.desc())
    if user.role.name == "SUPPLIER":
        query = query.where(PurchaseOrder.supplier_id == user.supplier_id)
    return list(db.scalars(query))


@app.get("/api/purchase-orders/{po_id}", response_model=PurchaseOrderOut)
def get_purchase_order(po_id: str, db: DbSession, user: User = Depends(current_user)) -> PurchaseOrder:
    po = db.get(PurchaseOrder, po_id)
    if not po:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    if user.role.name == "SUPPLIER" and po.supplier_id != user.supplier_id:
        raise HTTPException(status_code=403, detail="Purchase order is not available to this supplier")
    return po


@app.post("/api/purchase-orders", response_model=PurchaseOrderOut, status_code=status.HTTP_201_CREATED)
def create_purchase_order(payload: PurchaseOrderCreate, db: DbSession, user: User = Depends(require_roles("PROCUREMENT_MANAGER"))) -> PurchaseOrder:
    try:
        return PurchaseOrderService().create_draft(db, user, payload.rfq_id, payload.quotation_id)
    except ValueError as error:
        raise HTTPException(status_code=409, detail=str(error)) from error


@app.post("/api/purchase-orders/{po_id}/send", response_model=PurchaseOrderOut)
def send_purchase_order(po_id: str, db: DbSession, user: User = Depends(require_roles("PROCUREMENT_MANAGER"))) -> PurchaseOrder:
    po = db.scalar(select(PurchaseOrder).where(PurchaseOrder.id == po_id).with_for_update())
    if not po:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    if po.status != "DRAFT":
        raise HTTPException(status_code=409, detail="Only draft purchase orders can be sent")
    po.status = "SENT"
    record_audit(db, user, "PO_SENT", "PURCHASE_ORDER", po.id, new_values={"status": po.status})
    db.commit()
    db.refresh(po)
    return po


@app.post("/api/purchase-orders/{po_id}/acknowledge", response_model=PurchaseOrderOut)
def acknowledge_purchase_order(po_id: str, payload: PurchaseOrderAcknowledgement, db: DbSession, user: User = Depends(require_roles("SUPPLIER"))) -> PurchaseOrder:
    try:
        return PurchaseOrderService().acknowledge(db, user, po_id, payload.accepted, payload.notes)
    except ValueError as error:
        raise HTTPException(status_code=409, detail=str(error)) from error

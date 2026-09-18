from datetime import datetime, timezone
import logging
from uuid import UUID, uuid4

from fastapi.encoders import jsonable_encoder
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..audit import record_audit
from ..config import Settings
from ..models import Component, PlanningRequirement, ProcurementEvent, Rfq, Supplier, User, WorkflowExecution
from .sns.adapter import SnsAdapter
from .sns.exceptions import SnsIntegrationError

logger = logging.getLogger("prism.workflow")

class WorkflowExecutionService:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.sns = SnsAdapter(settings)

    def _resolve_entities(self, db: Session, user: User, source: dict, context: dict):
        user_id = source.get("user_id") or user.id
        if user_id:
            try:
                user_uuid = UUID(str(user_id))
                user_id = user_uuid if db.get(User, user_uuid) else user.id
            except (ValueError, TypeError):
                user_id = user.id

        rfq_id = source.get("rfq_id")
        if rfq_id:
            try:
                rfq_uuid = UUID(str(rfq_id))
                rfq_id = rfq_uuid if db.get(Rfq, rfq_uuid) else None
            except (ValueError, TypeError):
                rfq_id = None

        supplier_id = source.get("supplier_id")
        if supplier_id:
            try:
                supplier_uuid = UUID(str(supplier_id))
                supplier_id = supplier_uuid if db.get(Supplier, supplier_uuid) else None
            except (ValueError, TypeError):
                supplier_id = None

        raw_component_id = source.get("component_id")
        component_id = None
        if raw_component_id:
            try:
                comp_uuid = UUID(str(raw_component_id))
                comp = db.get(Component, comp_uuid)
                if comp:
                    component_id = comp.id
            except (ValueError, TypeError):
                comp = None

            if not component_id:
                # Check if it was a PlanningRequirement ID
                plan_req = db.get(PlanningRequirement, str(raw_component_id))
                if plan_req:
                    clean_name = plan_req.component_name.split("(")[0].strip()
                    comp = db.scalar(
                        select(Component).where(
                            func.lower(Component.name) == func.lower(plan_req.component_name)
                        )
                    ) or db.scalar(
                        select(Component).where(
                            func.lower(Component.name) == func.lower(clean_name)
                        )
                    ) or db.scalar(
                        select(Component).where(
                            func.lower(plan_req.component_name).contains(func.lower(Component.name)) |
                            func.lower(Component.name).contains(func.lower(clean_name))
                        )
                    )
                    if comp:
                        component_id = comp.id

        if not component_id and context.get("component_name"):
            cname = str(context.get("component_name"))
            clean_cname = cname.split("(")[0].strip()
            comp = db.scalar(
                select(Component).where(
                    func.lower(Component.name) == func.lower(cname)
                )
            ) or db.scalar(
                select(Component).where(
                    func.lower(Component.name) == func.lower(clean_cname)
                )
            ) or db.scalar(
                select(Component).where(
                    func.lower(cname).contains(func.lower(Component.name)) |
                    func.lower(Component.name).contains(func.lower(clean_cname))
                )
            )
            if comp:
                component_id = comp.id

        return user_id, rfq_id, supplier_id, component_id

    def create_master_execution(self, db: Session, user: User, event_type: str, priority: str, source: dict, context: dict) -> WorkflowExecution:
        user_id, rfq_id, supplier_id, component_id = self._resolve_entities(db, user, source, context)
        event = ProcurementEvent(
            id=uuid4(),
            event_type=event_type,
            priority=priority,
            source_user_id=user_id,
            rfq_id=rfq_id,
            component_id=component_id,
            supplier_id=supplier_id,
            context=context,
        )
        execution = WorkflowExecution(
            id=uuid4(),
            workflow_type="PROCUREMENT",
            event_type=event_type,
            status="QUEUED",
            requested_by=user.id,
            rfq_id=rfq_id,
            component_id=component_id,
            supplier_id=supplier_id,
            input_payload=jsonable_encoder({
                "event_id": event.id,
                "event_type": event_type,
                "priority": priority,
                "source": source,
                "context": context,
            }),
        )
        db.add_all([event, execution])
        db.flush()
        record_audit(db, user, "WORKFLOW_REQUESTED", "WORKFLOW_EXECUTION", execution.id, new_values={"event_type": event_type, "status": execution.status}, execution_id=execution.id)
        db.commit()
        db.refresh(execution)
        return execution
    def dispatch(self, db: Session, user: User, execution: WorkflowExecution) -> WorkflowExecution:
        execution.status = "RUNNING"
        execution.started_at = datetime.now(timezone.utc)
        db.flush()
        if not self.settings.sns_master_workflow_id:
            execution.status = "WAITING_FOR_SNS"
            execution.error_message = "SNS_MASTER_WORKFLOW_ID is not configured"
            db.commit()
            return execution
        try:
            result = self.sns.start(self.settings.sns_master_workflow_id, execution.input_payload, str(execution.id))
            execution.sns_workflow_id = self.settings.sns_master_workflow_id
            if result.get("execution_id"):
                execution.sns_execution_id = result["execution_id"]
            execution.status = "WAITING_FOR_SNS"
            record_audit(db, user, "SNS_EXECUTION_STARTED", "WORKFLOW_EXECUTION", execution.id, new_values=result, execution_id=execution.id)
        except SnsIntegrationError as error:
            execution.status = "FAILED"
            execution.error_message = str(error)
            logger.exception("SNS execution failed for workflow %s", execution.id)
            record_audit(db, user, "SNS_EXECUTION_FAILED", "WORKFLOW_EXECUTION", execution.id, new_values={"error": str(error)}, execution_id=execution.id)
        db.commit()
        db.refresh(execution)
        return execution

    def apply_callback(self, db: Session, execution: WorkflowExecution, payload: dict) -> WorkflowExecution:
        execution.output_payload = payload
        execution.status = payload.get("status", "COMPLETED") if payload.get("status") in {"COMPLETED", "FAILED", "WAITING_FOR_HUMAN"} else "COMPLETED"
        execution.error_message = payload.get("error_message")
        execution.completed_at = datetime.now(timezone.utc) if execution.status in {"COMPLETED", "FAILED"} else None
        db.commit()
        db.refresh(execution)
        return execution

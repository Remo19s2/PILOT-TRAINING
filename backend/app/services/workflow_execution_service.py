from datetime import datetime, timezone
import logging
from uuid import uuid4

from sqlalchemy.orm import Session

from ..audit import record_audit
from ..config import Settings
from ..models import ProcurementEvent, User, WorkflowExecution
from .sns.adapter import SnsAdapter
from .sns.exceptions import SnsIntegrationError

logger = logging.getLogger("prism.workflow")

class WorkflowExecutionService:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.sns = SnsAdapter(settings)

    def create_master_execution(self, db: Session, user: User, event_type: str, priority: str, source: dict, context: dict) -> WorkflowExecution:
        event = ProcurementEvent(id=str(uuid4()), event_type=event_type, priority=priority, source_user_id=source.get("user_id") or user.id, rfq_id=source.get("rfq_id"), component_id=source.get("component_id"), supplier_id=source.get("supplier_id"), context=context)
        execution = WorkflowExecution(id=str(uuid4()), workflow_type="PROCUREMENT", event_type=event_type, status="QUEUED", requested_by=user.id, rfq_id=source.get("rfq_id"), component_id=source.get("component_id"), supplier_id=source.get("supplier_id"), input_payload={"event_id": event.id, "event_type": event_type, "priority": priority, "source": source, "context": context})
        db.add_all([event, execution])
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
            result = self.sns.start(self.settings.sns_master_workflow_id, execution.input_payload)
            execution.sns_workflow_id = self.settings.sns_master_workflow_id
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

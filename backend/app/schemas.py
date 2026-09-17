from datetime import datetime
from decimal import Decimal
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    username: str
    display_name: str
    email: str
    role: str
    supplier_id: UUID | None = None


class LoginRequest(BaseModel):
    username: str = Field(min_length=1)
    password: str = Field(min_length=1)


class RefreshRequest(BaseModel):
    refresh_token: str


class SessionOut(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserOut


class RfqItemIn(BaseModel):
    description: str = Field(min_length=1)
    quantity: int = Field(gt=0)
    component_id: UUID | None = None


class RfqCreate(BaseModel):
    requirement_id: UUID | None = None
    quotation_deadline: datetime
    required_delivery_date: datetime
    evaluation_policy: str = Field(min_length=1)
    expected_supplier_count: int = Field(gt=0)
    minimum_valid_quotation_count: int = Field(gt=0)
    items: list[RfqItemIn] = Field(min_length=1)
    supplier_ids: list[UUID] = Field(min_length=1)


class RfqSend(BaseModel):
    supplier_ids: list[UUID] = Field(min_length=1)


class SupplierSelection(BaseModel):
    quotation_id: UUID


class QuotationCreate(BaseModel):
    rfq_id: UUID
    supplier_id: UUID
    unit_price: Decimal = Field(gt=0)
    total_price: Decimal = Field(gt=0)
    quantity: int = Field(gt=0)
    available_quantity: int = Field(ge=0)
    delivery_at: datetime
    payment_terms: str | None = None
    warranty_quality: str | None = None
    additional_notes: str | None = None


class QuotationOut(QuotationCreate):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    version: int
    status: str
    submitted_at: datetime
    supersedes_id: UUID | None = None


class RfqOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    requirement_id: UUID | None
    status: str
    release_date: datetime | None
    quotation_deadline: datetime
    required_delivery_date: datetime
    evaluation_policy: str
    expected_supplier_count: int
    minimum_valid_quotation_count: int
    created_at: datetime
    component: str | None = None
    quantity: int | None = None


class ApprovalReject(BaseModel):
    reason: str = Field(min_length=1)


class NotificationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    event_type: str
    title: str
    message: str
    rfq_id: UUID | None
    quotation_id: UUID | None
    approval_id: UUID | None
    purchase_order_id: UUID | None
    is_read: bool
    created_at: datetime


class CommunicationMessageIn(BaseModel):
    content: str = Field(min_length=1, max_length=4000)


class ApprovalMessageOut(CommunicationMessageIn):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    approval_id: UUID
    sender_id: UUID
    sender_name: str | None = None
    sender_role: str | None = None
    created_at: datetime


EventType = Literal[
    "SUPPLIER_DELAY", "SUPPLIER_QUALITY_ISSUE", "SUPPLIER_SHORTAGE", "SUPPLIER_CAPACITY_RISK",
    "SUPPLIER_PRICE_CHANGE", "INVENTORY_SHORTAGE", "PRODUCTION_DISRUPTION",
    "SUPPLIER_PERFORMANCE_REVIEW", "RFQ_ANALYSIS", "NEGOTIATION_REQUEST", "PROCUREMENT_REQUEST", "OTHER",
]


class EventSource(BaseModel):
    user_id: UUID | None = None
    rfq_id: UUID | None = None
    component_id: UUID | None = None
    supplier_id: UUID | None = None


class ProcurementEventIn(BaseModel):
    event_type: EventType
    priority: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"] = "MEDIUM"
    source: EventSource = EventSource()
    context: dict = Field(default_factory=dict)


class SnsWebhookIn(BaseModel):
    model_config = ConfigDict(extra="allow")
    prism_execution_id: UUID | None = None
    sns_execution_id: str | None = None
    execution_id: str | UUID | None = None


class WorkflowExecutionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    workflow_type: str
    event_type: str
    parent_execution_id: UUID | None
    status: str
    rfq_id: UUID | None
    supplier_id: UUID | None
    sns_workflow_id: str | None
    sns_execution_id: str | None
    input_payload: dict
    output_payload: dict | None
    error_message: str | None
    started_at: datetime | None
    completed_at: datetime | None
    created_at: datetime


class DecisionAction(BaseModel):
    action: Literal["ACCEPT", "MODIFY", "REJECT"]
    notes: str | None = None


class NegotiationDraftRequest(BaseModel):
    quotation_id: UUID
    dimensions: list[str] = Field(min_length=1)


class NegotiationAuthorization(BaseModel):
    message: str = Field(min_length=1)


class PurchaseOrderCreate(BaseModel):
    rfq_id: UUID
    quotation_id: UUID


class PurchaseOrderAcknowledgement(BaseModel):
    accepted: bool
    notes: str | None = None


class PurchaseOrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    supplier_id: UUID
    rfq_id: UUID
    quotation_id: UUID
    status: str
    created_at: datetime
    acknowledged_at: datetime | None = None
    acknowledgement_notes: str | None = None

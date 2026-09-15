from datetime import datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    username: str
    display_name: str
    email: str
    role: str
    supplier_id: str | None = None


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
    component_id: str | None = None


class RfqCreate(BaseModel):
    requirement_id: str | None = None
    quotation_deadline: datetime
    required_delivery_date: datetime
    evaluation_policy: str = Field(min_length=1)
    expected_supplier_count: int = Field(gt=0)
    minimum_valid_quotation_count: int = Field(gt=0)
    items: list[RfqItemIn] = Field(min_length=1)
    supplier_ids: list[str] = Field(min_length=1)


class RfqSend(BaseModel):
    supplier_ids: list[str] = Field(min_length=1)


class SupplierSelection(BaseModel):
    quotation_id: str


class QuotationCreate(BaseModel):
    rfq_id: str
    supplier_id: str
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
    id: str
    version: int
    status: str
    submitted_at: datetime
    supersedes_id: str | None = None


class RfqOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    requirement_id: str | None
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


EventType = Literal[
    "SUPPLIER_DELAY", "SUPPLIER_QUALITY_ISSUE", "SUPPLIER_SHORTAGE", "SUPPLIER_CAPACITY_RISK",
    "SUPPLIER_PRICE_CHANGE", "INVENTORY_SHORTAGE", "PRODUCTION_DISRUPTION",
    "SUPPLIER_PERFORMANCE_REVIEW", "RFQ_ANALYSIS", "NEGOTIATION_REQUEST", "PROCUREMENT_REQUEST", "OTHER",
]


class EventSource(BaseModel):
    user_id: str | None = None
    rfq_id: str | None = None
    component_id: str | None = None
    supplier_id: str | None = None


class ProcurementEventIn(BaseModel):
    event_type: EventType
    priority: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"] = "MEDIUM"
    source: EventSource = EventSource()
    context: dict = Field(default_factory=dict)


class WorkflowExecutionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    workflow_type: str
    event_type: str
    parent_execution_id: str | None
    status: str
    rfq_id: str | None
    supplier_id: str | None
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
    quotation_id: str
    dimensions: list[str] = Field(min_length=1)


class NegotiationAuthorization(BaseModel):
    message: str = Field(min_length=1)


class PurchaseOrderCreate(BaseModel):
    rfq_id: str
    quotation_id: str


class PurchaseOrderAcknowledgement(BaseModel):
    accepted: bool
    notes: str | None = None


class PurchaseOrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    supplier_id: str
    rfq_id: str
    quotation_id: str
    status: str
    created_at: datetime
    acknowledged_at: datetime | None = None
    acknowledgement_notes: str | None = None

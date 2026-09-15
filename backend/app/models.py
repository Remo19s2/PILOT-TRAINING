from datetime import datetime
from decimal import Decimal

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, Index, Integer, Numeric, String, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .db import Base


class Role(Base):
    __tablename__ = "roles"
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    name: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)


class User(Base):
    __tablename__ = "users"
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    username: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    display_name: Mapped[str] = mapped_column(String(160), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    role_id: Mapped[str] = mapped_column(ForeignKey("roles.id"), nullable=False, index=True)
    supplier_id: Mapped[str | None] = mapped_column(ForeignKey("suppliers.id"), nullable=True, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    role: Mapped[Role] = relationship()


class Supplier(Base):
    __tablename__ = "suppliers"
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="ACTIVE", nullable=False)
    category: Mapped[str | None] = mapped_column(String(100))
    location: Mapped[str | None] = mapped_column(String(160))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class PlanningRequirement(Base):
    __tablename__ = "planning_requirements"
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    component_name: Mapped[str] = mapped_column(String(200), nullable=False)
    required_quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    current_inventory: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    required_delivery_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    priority: Mapped[str] = mapped_column(String(32), default="MEDIUM", nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="NEW", nullable=False)


class Rfq(Base):
    __tablename__ = "rfqs"
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    requirement_id: Mapped[str | None] = mapped_column(ForeignKey("planning_requirements.id"), index=True)
    created_by: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(32), default="DRAFT", nullable=False, index=True)
    release_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    quotation_deadline: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    required_delivery_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    evaluation_policy: Mapped[str] = mapped_column(Text, nullable=False)
    expected_supplier_count: Mapped[int] = mapped_column(Integer, nullable=False)
    minimum_valid_quotation_count: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    suppliers: Mapped[list["RfqSupplier"]] = relationship(cascade="all, delete-orphan")
    items: Mapped[list["RfqItem"]] = relationship(cascade="all, delete-orphan")


class RfqItem(Base):
    __tablename__ = "rfq_items"
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    rfq_id: Mapped[str] = mapped_column(ForeignKey("rfqs.id", ondelete="CASCADE"), nullable=False, index=True)
    component_id: Mapped[str | None] = mapped_column(String(36))
    description: Mapped[str] = mapped_column(Text, nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)


class RfqSupplier(Base):
    __tablename__ = "rfq_suppliers"
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    rfq_id: Mapped[str] = mapped_column(ForeignKey("rfqs.id", ondelete="CASCADE"), nullable=False, index=True)
    supplier_id: Mapped[str] = mapped_column(ForeignKey("suppliers.id"), nullable=False, index=True)
    response_status: Mapped[str] = mapped_column(String(32), default="PENDING", nullable=False)
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    viewed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    responded_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    __table_args__ = (UniqueConstraint("rfq_id", "supplier_id", name="uq_rfq_supplier"),)


class Quotation(Base):
    __tablename__ = "quotations"
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    rfq_id: Mapped[str] = mapped_column(ForeignKey("rfqs.id"), nullable=False, index=True)
    supplier_id: Mapped[str] = mapped_column(ForeignKey("suppliers.id"), nullable=False, index=True)
    version: Mapped[int] = mapped_column(Integer, nullable=False)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(14, 4), nullable=False)
    total_price: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    available_quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    delivery_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    payment_terms: Mapped[str | None] = mapped_column(String(120))
    warranty_quality: Mapped[str | None] = mapped_column(Text)
    additional_notes: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(32), default="SUBMITTED", nullable=False)
    submitted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    supersedes_id: Mapped[str | None] = mapped_column(ForeignKey("quotations.id"))
    __table_args__ = (UniqueConstraint("rfq_id", "supplier_id", "version", name="uq_quotation_version"), Index("ix_quotation_current", "rfq_id", "supplier_id", "status"))


class Negotiation(Base):
    __tablename__ = "negotiations"
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    rfq_id: Mapped[str] = mapped_column(ForeignKey("rfqs.id"), nullable=False, index=True)
    quotation_id: Mapped[str] = mapped_column(ForeignKey("quotations.id"), nullable=False)
    supplier_id: Mapped[str] = mapped_column(ForeignKey("suppliers.id"), nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="OPEN", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    supplier_id: Mapped[str] = mapped_column(ForeignKey("suppliers.id"), nullable=False)
    rfq_id: Mapped[str] = mapped_column(ForeignKey("rfqs.id"), nullable=False)
    quotation_id: Mapped[str] = mapped_column(ForeignKey("quotations.id"), nullable=False)
    created_by: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    acknowledged_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    acknowledgement_notes: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(32), default="DRAFT", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class PurchaseOrderItem(Base):
    __tablename__ = "purchase_order_items"
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    purchase_order_id: Mapped[str] = mapped_column(ForeignKey("purchase_orders.id", ondelete="CASCADE"), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(14, 4), nullable=False)


class Approval(Base):
    __tablename__ = "approvals"
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    rfq_id: Mapped[str] = mapped_column(ForeignKey("rfqs.id"), nullable=False, index=True)
    quotation_id: Mapped[str] = mapped_column(ForeignKey("quotations.id"), nullable=False)
    requested_by: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="PENDING", nullable=False, index=True)
    decision_reason: Mapped[str | None] = mapped_column(Text)
    decided_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    action: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    entity_type: Mapped[str] = mapped_column(String(64), nullable=False)
    entity_id: Mapped[str] = mapped_column(String(36), nullable=False, index=True)
    execution_id: Mapped[str | None] = mapped_column(String(36), nullable=True, index=True)
    old_values: Mapped[dict | None] = mapped_column(JSON)
    new_values: Mapped[dict | None] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class ProcurementEvent(Base):
    __tablename__ = "procurement_events"
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    event_type: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    priority: Mapped[str] = mapped_column(String(16), default="MEDIUM", nullable=False)
    source_user_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"), index=True)
    rfq_id: Mapped[str | None] = mapped_column(ForeignKey("rfqs.id"), index=True)
    component_id: Mapped[str | None] = mapped_column(String(36), index=True)
    supplier_id: Mapped[str | None] = mapped_column(ForeignKey("suppliers.id"), index=True)
    context: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class WorkflowExecution(Base):
    __tablename__ = "workflow_executions"
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    workflow_type: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    event_type: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    parent_execution_id: Mapped[str | None] = mapped_column(ForeignKey("workflow_executions.id"), index=True)
    status: Mapped[str] = mapped_column(String(32), default="QUEUED", nullable=False, index=True)
    requested_by: Mapped[str | None] = mapped_column(ForeignKey("users.id"), index=True)
    rfq_id: Mapped[str | None] = mapped_column(ForeignKey("rfqs.id"), index=True)
    component_id: Mapped[str | None] = mapped_column(String(36), index=True)
    supplier_id: Mapped[str | None] = mapped_column(ForeignKey("suppliers.id"), index=True)
    sns_workflow_id: Mapped[str | None] = mapped_column(String(255))
    sns_execution_id: Mapped[str | None] = mapped_column(String(255), unique=True)
    input_payload: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    output_payload: Mapped[dict | None] = mapped_column(JSON)
    error_message: Mapped[str | None] = mapped_column(Text)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class DecisionRecommendation(Base):
    __tablename__ = "decision_recommendations"
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    rfq_id: Mapped[str] = mapped_column(ForeignKey("rfqs.id"), nullable=False, index=True)
    execution_id: Mapped[str | None] = mapped_column(ForeignKey("workflow_executions.id"), index=True)
    status: Mapped[str] = mapped_column(String(32), default="PENDING_HUMAN_REVIEW", nullable=False)
    recommendation: Mapped[dict] = mapped_column(JSON, nullable=False)
    deterministic_result: Mapped[dict] = mapped_column(JSON, nullable=False)
    explanation: Mapped[str | None] = mapped_column(Text)
    human_decision: Mapped[str | None] = mapped_column(String(32))
    human_notes: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class NegotiationMessage(Base):
    __tablename__ = "negotiation_messages"
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    negotiation_id: Mapped[str] = mapped_column(ForeignKey("negotiations.id", ondelete="CASCADE"), nullable=False, index=True)
    sender_type: Mapped[str] = mapped_column(String(32), nullable=False)
    message_type: Mapped[str] = mapped_column(String(32), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    authorized_by: Mapped[str | None] = mapped_column(ForeignKey("users.id"))
    execution_id: Mapped[str | None] = mapped_column(ForeignKey("workflow_executions.id"), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

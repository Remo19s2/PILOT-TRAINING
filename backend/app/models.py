from datetime import datetime
from decimal import Decimal
from uuid import UUID, uuid4

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, Index, Integer, Numeric, String, Text, UniqueConstraint, Uuid, func
from sqlalchemy.dialects.postgresql import INET
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .db import Base

UUID_TYPE = Uuid(as_uuid=True)


def coerce_uuid(value: UUID | str) -> UUID:
    return value if isinstance(value, UUID) else UUID(value)


class Role(Base):
    __tablename__ = "roles"
    id: Mapped[UUID] = mapped_column("role_id", UUID_TYPE, primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column("role_name", String(64), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column("description", Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    @property
    def role_id(self):
        return self.id

    @role_id.setter
    def role_id(self, value):
        self.id = coerce_uuid(value)

    @property
    def role_name(self):
        return self.name

    @role_name.setter
    def role_name(self, value):
        self.name = value

    def __init__(self, **kwargs):
        if "role_id" in kwargs and "id" not in kwargs:
            kwargs["id"] = kwargs.pop("role_id")
        if "role_name" in kwargs and "name" not in kwargs:
            kwargs["name"] = kwargs.pop("role_name")
        if kwargs.get("id") is not None:
            kwargs["id"] = coerce_uuid(kwargs["id"])
        super().__init__(**kwargs)


class User(Base):
    __tablename__ = "users"
    id: Mapped[UUID] = mapped_column("user_id", UUID_TYPE, primary_key=True, default=uuid4)
    role_id: Mapped[UUID] = mapped_column(ForeignKey("roles.role_id"), nullable=False, index=True)
    full_name: Mapped[str] = mapped_column(String(160), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(32), nullable=True)
    username: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=True)

    role: Mapped[Role] = relationship(foreign_keys=[role_id])
    supplier_memberships: Mapped[list["UserSupplier"]] = relationship(back_populates="user", cascade="all, delete-orphan")

    @property
    def user_id(self):
        return self.id

    @user_id.setter
    def user_id(self, value):
        self.id = coerce_uuid(value)

    @property
    def display_name(self) -> str:
        return self.full_name

    @display_name.setter
    def display_name(self, value: str) -> None:
        self.full_name = value

    def __init__(self, **kwargs):
        if "user_id" in kwargs and "id" not in kwargs:
            kwargs["id"] = kwargs.pop("user_id")
        if "display_name" in kwargs and "full_name" not in kwargs:
            kwargs["full_name"] = kwargs.pop("display_name")
        if "supplier_id" in kwargs:
            legacy_supplier_id = kwargs.pop("supplier_id")
            if legacy_supplier_id is not None:
                kwargs.setdefault("supplier_memberships", [])
                kwargs["supplier_memberships"] = list(kwargs["supplier_memberships"])
                kwargs["supplier_memberships"].append(UserSupplier(supplier_id=coerce_uuid(legacy_supplier_id)))
        if kwargs.get("id") is not None:
            kwargs["id"] = coerce_uuid(kwargs["id"])
        if kwargs.get("role_id") is not None:
            kwargs["role_id"] = coerce_uuid(kwargs["role_id"])
        super().__init__(**kwargs)

    @property
    def display_name(self) -> str:
        return self.full_name

    @display_name.setter
    def display_name(self, value: str) -> None:
        self.full_name = value

    @property
    def supplier_id(self) -> UUID | None:
        return self.supplier_memberships[0].supplier_id if self.supplier_memberships else None

    @supplier_id.setter
    def supplier_id(self, value: UUID | str | None) -> None:
        if value is None:
            return
        if not self.supplier_memberships:
            self.supplier_memberships.append(UserSupplier(supplier_id=coerce_uuid(value)))
        else:
            self.supplier_memberships[0].supplier_id = coerce_uuid(value)


class UserSupplier(Base):
    __tablename__ = "user_suppliers"
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.user_id"), primary_key=True)
    supplier_id: Mapped[UUID] = mapped_column(ForeignKey("suppliers.supplier_id"), primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    def __init__(self, **kwargs):
        if kwargs.get("user_id") is not None:
            kwargs["user_id"] = coerce_uuid(kwargs["user_id"])
        if kwargs.get("supplier_id") is not None:
            kwargs["supplier_id"] = coerce_uuid(kwargs["supplier_id"])
        super().__init__(**kwargs)

    user: Mapped[User] = relationship(back_populates="supplier_memberships")
    supplier: Mapped["Supplier"] = relationship(back_populates="user_memberships")


class Supplier(Base):
    __tablename__ = "suppliers"
    id: Mapped[UUID] = mapped_column("supplier_id", UUID_TYPE, primary_key=True, default=uuid4)
    code: Mapped[str] = mapped_column("supplier_code", String(32), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column("supplier_name", String(200), nullable=False)
    contact_name: Mapped[str | None] = mapped_column(String(160))
    email: Mapped[str | None] = mapped_column(String(255))
    phone: Mapped[str | None] = mapped_column(String(32))
    address: Mapped[str | None] = mapped_column(Text)
    country: Mapped[str | None] = mapped_column(String(100))
    status: Mapped[str] = mapped_column("supplier_status", String(32), default="ACTIVE", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=True)

    user_memberships: Mapped[list[UserSupplier]] = relationship(back_populates="supplier", cascade="all, delete-orphan")

    @property
    def supplier_id(self):
        return self.id

    @supplier_id.setter
    def supplier_id(self, value):
        self.id = coerce_uuid(value)

    @property
    def supplier_code(self):
        return self.code

    @supplier_code.setter
    def supplier_code(self, value):
        self.code = value

    @property
    def supplier_name(self):
        return self.name

    @supplier_name.setter
    def supplier_name(self, value):
        self.name = value

    @property
    def supplier_status(self):
        return self.status

    @supplier_status.setter
    def supplier_status(self, value):
        self.status = value

    def __init__(self, **kwargs):
        if "supplier_id" in kwargs and "id" not in kwargs:
            kwargs["id"] = kwargs.pop("supplier_id")
        if "supplier_name" in kwargs and "name" not in kwargs:
            kwargs["name"] = kwargs.pop("supplier_name")
        if "supplier_code" in kwargs and "code" not in kwargs:
            kwargs["code"] = kwargs.pop("supplier_code")
        if "supplier_status" in kwargs and "status" not in kwargs:
            kwargs["status"] = kwargs.pop("supplier_status")
        if kwargs.get("id") is not None:
            kwargs["id"] = coerce_uuid(kwargs["id"])
        if "code" not in kwargs and "supplier_code" not in kwargs and "id" in kwargs and kwargs["id"] is not None:
            kwargs["code"] = str(kwargs["id"])
        if "code" in kwargs and kwargs["code"] is None and "id" in kwargs and kwargs["id"] is not None:
            kwargs["code"] = str(kwargs["id"])
        super().__init__(**kwargs)


class Component(Base):
    __tablename__ = "components"
    id: Mapped[UUID] = mapped_column("component_id", UUID_TYPE, primary_key=True, default=uuid4)
    code: Mapped[str] = mapped_column("component_code", String(64), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column("component_name", String(200), nullable=False)
    category_type: Mapped[str | None] = mapped_column(String(100))
    specification: Mapped[str | None] = mapped_column(Text)
    unit: Mapped[str | None] = mapped_column(String(32))
    procurement_type: Mapped[str | None] = mapped_column(String(64))
    criticality_profile: Mapped[str | None] = mapped_column(String(64))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=True)


class VehicleModel(Base):
    __tablename__ = "vehicle_models"
    id: Mapped[UUID] = mapped_column("vehicle_model_id", UUID_TYPE, primary_key=True, default=uuid4)
    model_code: Mapped[str] = mapped_column(String(64), unique=True, nullable=False, index=True)
    model_name: Mapped[str] = mapped_column(String(200), nullable=False)
    vehicle_category: Mapped[str | None] = mapped_column(String(100))
    description: Mapped[str | None] = mapped_column(Text)
    production_line: Mapped[str | None] = mapped_column(String(100))
    priority_level: Mapped[str | None] = mapped_column(String(32))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=True)


class PlanningRequirement(Base):
    __tablename__ = "planning_requirements"
    id: Mapped[UUID] = mapped_column(UUID_TYPE, primary_key=True, default=uuid4)
    component_name: Mapped[str] = mapped_column(String(200), nullable=False)
    required_quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    current_inventory: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    required_delivery_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    priority: Mapped[str] = mapped_column(String(32), default="MEDIUM", nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="NEW", nullable=False)


class BomHeader(Base):
    __tablename__ = "bom_headers"
    id: Mapped[UUID] = mapped_column(UUID_TYPE, primary_key=True, default=uuid4)
    vehicle_model_id: Mapped[UUID] = mapped_column(ForeignKey("vehicle_models.vehicle_model_id"), nullable=False, index=True)
    revision: Mapped[str] = mapped_column(String(32), nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="ACTIVE", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=True)


class BomItem(Base):
    __tablename__ = "bom_items"
    id: Mapped[UUID] = mapped_column(UUID_TYPE, primary_key=True, default=uuid4)
    bom_header_id: Mapped[UUID] = mapped_column(ForeignKey("bom_headers.id", ondelete="CASCADE"), nullable=False, index=True)
    component_id: Mapped[UUID] = mapped_column(ForeignKey("components.component_id"), nullable=False, index=True)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)


class Inventory(Base):
    __tablename__ = "inventory"
    id: Mapped[UUID] = mapped_column(UUID_TYPE, primary_key=True, default=uuid4)
    component_id: Mapped[UUID] = mapped_column(ForeignKey("components.component_id"), nullable=False, index=True)
    location: Mapped[str] = mapped_column(String(160), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class CustomerOrder(Base):
    __tablename__ = "customer_orders"
    id: Mapped[UUID] = mapped_column(UUID_TYPE, primary_key=True, default=uuid4)
    external_reference: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    status: Mapped[str] = mapped_column(String(32), nullable=False)
    due_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class CustomerOrderItem(Base):
    __tablename__ = "customer_order_items"
    id: Mapped[UUID] = mapped_column(UUID_TYPE, primary_key=True, default=uuid4)
    customer_order_id: Mapped[UUID] = mapped_column(ForeignKey("customer_orders.id", ondelete="CASCADE"), nullable=False, index=True)
    component_id: Mapped[UUID] = mapped_column(ForeignKey("components.component_id"), nullable=False, index=True)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)


class IncomingSupply(Base):
    __tablename__ = "incoming_supply"
    id: Mapped[UUID] = mapped_column(UUID_TYPE, primary_key=True, default=uuid4)
    supplier_id: Mapped[UUID] = mapped_column(ForeignKey("suppliers.supplier_id"), nullable=False, index=True)
    component_id: Mapped[UUID] = mapped_column(ForeignKey("components.component_id"), nullable=False, index=True)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    eta: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class SupplierComponent(Base):
    __tablename__ = "supplier_components"
    supplier_id: Mapped[UUID] = mapped_column(ForeignKey("suppliers.supplier_id"), primary_key=True)
    component_id: Mapped[UUID] = mapped_column(ForeignKey("components.component_id"), primary_key=True)
    capacity: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    quality_score: Mapped[Decimal | None] = mapped_column(Numeric(5, 2))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class SupplierStatusHistory(Base):
    __tablename__ = "supplier_status_history"
    id: Mapped[UUID] = mapped_column(UUID_TYPE, primary_key=True, default=uuid4)
    supplier_id: Mapped[UUID] = mapped_column(ForeignKey("suppliers.supplier_id"), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(32), nullable=False)
    reason: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id: Mapped[UUID] = mapped_column("audit_log_id", UUID_TYPE, primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.user_id"), nullable=False, index=True)
    action: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    entity_type: Mapped[str] = mapped_column(String(64), nullable=False)
    entity_id: Mapped[UUID] = mapped_column(UUID_TYPE, nullable=False, index=True)
    execution_id: Mapped[UUID | None] = mapped_column(ForeignKey("workflow_executions.id"), nullable=True, index=True)
    old_values: Mapped[dict | None] = mapped_column(JSON)
    new_values: Mapped[dict | None] = mapped_column(JSON)
    ip_address: Mapped[str | None] = mapped_column(INET().with_variant(String(64), "sqlite"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class ProcurementEvent(Base):
    __tablename__ = "procurement_events"
    id: Mapped[UUID] = mapped_column(UUID_TYPE, primary_key=True, default=uuid4)
    event_type: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    priority: Mapped[str] = mapped_column(String(16), default="MEDIUM", nullable=False)
    source_user_id: Mapped[UUID | None] = mapped_column(ForeignKey("users.user_id"), index=True)
    rfq_id: Mapped[UUID | None] = mapped_column(ForeignKey("rfqs.id"), index=True)
    component_id: Mapped[UUID | None] = mapped_column(UUID_TYPE, index=True)
    supplier_id: Mapped[UUID | None] = mapped_column(ForeignKey("suppliers.supplier_id"), index=True)
    context: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class WorkflowExecution(Base):
    __tablename__ = "workflow_executions"
    id: Mapped[UUID] = mapped_column(UUID_TYPE, primary_key=True, default=uuid4)
    parent_execution_id: Mapped[UUID | None] = mapped_column(ForeignKey("workflow_executions.id"), index=True)
    workflow_type: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    event_type: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(32), default="QUEUED", nullable=False, index=True)
    requested_by: Mapped[UUID | None] = mapped_column(ForeignKey("users.user_id"), index=True)
    rfq_id: Mapped[UUID | None] = mapped_column(ForeignKey("rfqs.id"), index=True)
    component_id: Mapped[UUID | None] = mapped_column(UUID_TYPE, index=True)
    supplier_id: Mapped[UUID | None] = mapped_column(ForeignKey("suppliers.supplier_id"), index=True)
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
    id: Mapped[UUID] = mapped_column(UUID_TYPE, primary_key=True, default=uuid4)
    rfq_id: Mapped[UUID] = mapped_column(ForeignKey("rfqs.id"), nullable=False, index=True)
    execution_id: Mapped[UUID | None] = mapped_column(ForeignKey("workflow_executions.id"), index=True)
    status: Mapped[str] = mapped_column(String(32), default="PENDING_HUMAN_REVIEW", nullable=False)
    recommendation: Mapped[dict] = mapped_column(JSON, nullable=False)
    deterministic_result: Mapped[dict] = mapped_column(JSON, nullable=False)
    explanation: Mapped[str | None] = mapped_column(Text)
    human_decision: Mapped[str | None] = mapped_column(String(32))
    human_notes: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class Negotiation(Base):
    __tablename__ = "negotiations"
    id: Mapped[UUID] = mapped_column(UUID_TYPE, primary_key=True, default=uuid4)
    rfq_id: Mapped[UUID] = mapped_column(ForeignKey("rfqs.id"), nullable=False, index=True)
    quotation_id: Mapped[UUID] = mapped_column(ForeignKey("quotations.id"), nullable=False)
    supplier_id: Mapped[UUID] = mapped_column(ForeignKey("suppliers.supplier_id"), nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="OPEN", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class NegotiationMessage(Base):
    __tablename__ = "negotiation_messages"
    id: Mapped[UUID] = mapped_column(UUID_TYPE, primary_key=True, default=uuid4)
    negotiation_id: Mapped[UUID] = mapped_column(ForeignKey("negotiations.id", ondelete="CASCADE"), nullable=False, index=True)
    sender_type: Mapped[str] = mapped_column(String(32), nullable=False)
    message_type: Mapped[str] = mapped_column(String(32), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    authorized_by: Mapped[UUID | None] = mapped_column(ForeignKey("users.user_id"))
    execution_id: Mapped[UUID | None] = mapped_column(ForeignKey("workflow_executions.id"), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class Rfq(Base):
    __tablename__ = "rfqs"
    id: Mapped[UUID] = mapped_column(UUID_TYPE, primary_key=True, default=uuid4)
    requirement_id: Mapped[UUID | None] = mapped_column(UUID_TYPE, index=True)
    created_by: Mapped[UUID] = mapped_column(ForeignKey("users.user_id"), nullable=False, index=True)
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
    id: Mapped[UUID] = mapped_column(UUID_TYPE, primary_key=True, default=uuid4)
    rfq_id: Mapped[UUID] = mapped_column(ForeignKey("rfqs.id", ondelete="CASCADE"), nullable=False, index=True)
    component_id: Mapped[UUID | None] = mapped_column(ForeignKey("components.component_id"), index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)


class RfqSupplier(Base):
    __tablename__ = "rfq_suppliers"
    id: Mapped[UUID] = mapped_column(UUID_TYPE, primary_key=True, default=uuid4)
    rfq_id: Mapped[UUID] = mapped_column(ForeignKey("rfqs.id", ondelete="CASCADE"), nullable=False, index=True)
    supplier_id: Mapped[UUID] = mapped_column(ForeignKey("suppliers.supplier_id"), nullable=False, index=True)
    response_status: Mapped[str] = mapped_column(String(32), default="PENDING", nullable=False)
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    viewed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    responded_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    __table_args__ = (UniqueConstraint("rfq_id", "supplier_id", name="uq_rfq_supplier"),)


class Quotation(Base):
    __tablename__ = "quotations"
    id: Mapped[UUID] = mapped_column(UUID_TYPE, primary_key=True, default=uuid4)
    rfq_id: Mapped[UUID] = mapped_column(ForeignKey("rfqs.id"), nullable=False, index=True)
    supplier_id: Mapped[UUID] = mapped_column(ForeignKey("suppliers.supplier_id"), nullable=False, index=True)
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
    supersedes_id: Mapped[UUID | None] = mapped_column(ForeignKey("quotations.id"))
    __table_args__ = (UniqueConstraint("rfq_id", "supplier_id", "version", name="uq_quotation_version"), Index("ix_quotation_current", "rfq_id", "supplier_id", "status"))


class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"
    id: Mapped[UUID] = mapped_column(UUID_TYPE, primary_key=True, default=uuid4)
    supplier_id: Mapped[UUID] = mapped_column(ForeignKey("suppliers.supplier_id"), nullable=False)
    rfq_id: Mapped[UUID] = mapped_column(ForeignKey("rfqs.id"), nullable=False)
    quotation_id: Mapped[UUID] = mapped_column(ForeignKey("quotations.id"), nullable=False)
    created_by: Mapped[UUID] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    acknowledged_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    acknowledgement_notes: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(32), default="DRAFT", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class PurchaseOrderItem(Base):
    __tablename__ = "purchase_order_items"
    id: Mapped[UUID] = mapped_column(UUID_TYPE, primary_key=True, default=uuid4)
    purchase_order_id: Mapped[UUID] = mapped_column(ForeignKey("purchase_orders.id", ondelete="CASCADE"), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(14, 4), nullable=False)


class Approval(Base):
    __tablename__ = "approvals"
    id: Mapped[UUID] = mapped_column(UUID_TYPE, primary_key=True, default=uuid4)
    rfq_id: Mapped[UUID] = mapped_column(ForeignKey("rfqs.id"), nullable=False, index=True)
    quotation_id: Mapped[UUID] = mapped_column(ForeignKey("quotations.id"), nullable=False)
    requested_by: Mapped[UUID] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="PENDING", nullable=False, index=True)
    decision_reason: Mapped[str | None] = mapped_column(Text)
    decided_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class ApprovalMessage(Base):
    __tablename__ = "approval_messages"
    id: Mapped[UUID] = mapped_column(UUID_TYPE, primary_key=True, default=uuid4)
    approval_id: Mapped[UUID] = mapped_column(ForeignKey("approvals.id", ondelete="CASCADE"), nullable=False, index=True)
    sender_id: Mapped[UUID] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    sender: Mapped["User"] = relationship(foreign_keys=[sender_id])


class Notification(Base):
    __tablename__ = "notifications"
    id: Mapped[UUID] = mapped_column(UUID_TYPE, primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    event_type: Mapped[str] = mapped_column(String(64), nullable=False)
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    rfq_id: Mapped[UUID | None] = mapped_column(ForeignKey("rfqs.id"), index=True)
    quotation_id: Mapped[UUID | None] = mapped_column(ForeignKey("quotations.id"), index=True)
    approval_id: Mapped[UUID | None] = mapped_column(ForeignKey("approvals.id"), index=True)
    purchase_order_id: Mapped[UUID | None] = mapped_column(ForeignKey("purchase_orders.id"), index=True)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

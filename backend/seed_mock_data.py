from datetime import datetime, timedelta, timezone
from decimal import Decimal
from uuid import UUID

from sqlalchemy import select, text

from app.models import (
	Approval,
	ApprovalMessage,
	Component,
	DecisionRecommendation,
	Negotiation,
	NegotiationMessage,
	Notification,
	PlanningRequirement,
	ProcurementEvent,
	PurchaseOrder,
	PurchaseOrderItem,
	Quotation,
	Rfq,
	RfqItem,
	RfqSupplier,
	Supplier,
	User,
	WorkflowExecution,
)
from app.seed import seed_production_accounts
from app.db import SessionLocal


IDS = {
	"ecu": UUID("10000000-0000-4000-8000-000000000001"),
	"steel": UUID("10000000-0000-4000-8000-000000000002"),
	"sensor": UUID("10000000-0000-4000-8000-000000000003"),
	"fastener": UUID("10000000-0000-4000-8000-000000000004"),
	"req_ecu": UUID("20000000-0000-4000-8000-000000000001"),
	"req_steel": UUID("20000000-0000-4000-8000-000000000002"),
	"req_sensor": UUID("20000000-0000-4000-8000-000000000003"),
	"rfq_ecu": UUID("30000000-0000-4000-8000-000000000001"),
	"rfq_steel": UUID("30000000-0000-4000-8000-000000000002"),
	"rfq_sensor": UUID("30000000-0000-4000-8000-000000000003"),
	"q_ecu_tech": UUID("40000000-0000-4000-8000-000000000001"),
	"q_ecu_auto": UUID("40000000-0000-4000-8000-000000000002"),
	"q_steel_industrial": UUID("40000000-0000-4000-8000-000000000003"),
	"q_sensor_tech": UUID("40000000-0000-4000-8000-000000000004"),
	"q_sensor_global": UUID("40000000-0000-4000-8000-000000000005"),
	"approval_ecu": UUID("50000000-0000-4000-8000-000000000001"),
	"approval_sensor": UUID("50000000-0000-4000-8000-000000000002"),
	"negotiation_sensor": UUID("60000000-0000-4000-8000-000000000001"),
	"po_ecu": UUID("70000000-0000-4000-8000-000000000001"),
	"execution_ecu": UUID("80000000-0000-4000-8000-000000000001"),
	"execution_sensor": UUID("80000000-0000-4000-8000-000000000002"),
}

SUPPLIER_DATA = [
	("SUP-001", "TechCorp Industries", "Maya Chen", "contact@techcorp.com", "Taiwan", "ACTIVE"),
	("SUP-002", "IndustrialX Manufacturing", "Wei Zhang", "info@industrialx.com", "China", "ACTIVE"),
	("SUP-003", "AutoParts Premium", "Lukas Weber", "sales@autoparts.de", "Germany", "ACTIVE"),
	("SUP-004", "GlobalSupply Co.", "Priya Shah", "orders@globalsupply.in", "India", "ACTIVE"),
]


def ensure(db, model, record_id, **values):
	record = db.get(model, record_id)
	if record is None:
		record = model(id=record_id, **values)
		db.add(record)
	return record


def seed_mock_data() -> None:
	db = SessionLocal()
	now = datetime.now(timezone.utc)
	try:
		seed_production_accounts(db)
		db.flush()
		users = {user.username: user for user in db.scalars(select(User)).all()}
		procurement = users["procurement"]
		finance = users["finance"]

		suppliers = {}
		for code, name, contact_name, email, country, status in SUPPLIER_DATA:
			supplier = db.scalar(select(Supplier).where(Supplier.code == code))
			if supplier is None:
				supplier = Supplier(code=code, name=name, contact_name=contact_name, email=email, country=country, status=status)
				db.add(supplier)
			suppliers[code] = supplier
		db.flush()

		components = {
			"ecu": ensure(db, Component, IDS["ecu"], code="ECU-100", name="Electronic Control Unit", category_type="PART", specification="32-bit automotive control module", unit="unit", procurement_type="BUY", criticality_profile="CRITICAL"),
			"steel": ensure(db, Component, IDS["steel"], code="STEEL-220", name="Cold Rolled Steel Sheets", category_type="MATERIAL", specification="1.2mm galvanized automotive grade", unit="sheet", procurement_type="BUY", criticality_profile="STANDARD"),
			"sensor": ensure(db, Component, IDS["sensor"], code="SENSOR-410", name="Parking Sensor Type B", category_type="PART", specification="Ultrasonic sensor with harness", unit="unit", procurement_type="BUY", criticality_profile="STANDARD"),
			"fastener": ensure(db, Component, IDS["fastener"], code="FAST-050", name="M8 Flange Fastener", category_type="FASTENER", specification="Zinc plated, automotive grade", unit="piece", procurement_type="BUY", criticality_profile="LOW_CRITICALITY"),
		}
		db.flush()

		requirements = [
			("req_ecu", "Electronic Control Unit", 10000, 3000, "CRITICAL", 30),
			("req_steel", "Cold Rolled Steel Sheets", 30000, 450, "CRITICAL", 45),
			("req_sensor", "Parking Sensor Type B", 5500, 1200, "HIGH", 38),
		]
		for key, name, required, inventory, priority, days in requirements:
			requirement_id = str(IDS[key])
			if not db.execute(text("SELECT 1 FROM planning_requirements WHERE id = :id"), {"id": requirement_id}).scalar():
				db.execute(text("""
					INSERT INTO planning_requirements (id, component_name, required_quantity, current_inventory, priority, status, required_delivery_date)
					VALUES (:id, :component_name, :required_quantity, :current_inventory, :priority, :status, :required_delivery_date)
				"""), {"id": requirement_id, "component_name": name, "required_quantity": required, "current_inventory": inventory, "priority": priority, "status": "NEW", "required_delivery_date": now + timedelta(days=days)})

		rfq_data = [
			("rfq_ecu", IDS["req_ecu"], "OPEN", 10000, 3, 2, "ecu", 30, 30),
			("rfq_steel", IDS["req_steel"], "QUOTATIONS_RECEIVED", 30000, 2, 1, "steel", 40, 45),
			("rfq_sensor", IDS["req_sensor"], "SUPPLIER_SELECTED", 5500, 3, 2, "sensor", 20, 38),
		]
		rfqs = {}
		for key, requirement_id, status, quantity, expected_count, minimum_count, component_key, deadline_days, delivery_days in rfq_data:
			rfq = ensure(db, Rfq, IDS[key], requirement_id=requirement_id, created_by=procurement.id, status=status, release_date=now - timedelta(days=3), quotation_deadline=now + timedelta(days=deadline_days), required_delivery_date=now + timedelta(days=delivery_days), evaluation_policy="Best value: delivery 40%, price 40%, supplier risk 20%.", expected_supplier_count=expected_count, minimum_valid_quotation_count=minimum_count)
			rfqs[key] = rfq
			if not db.scalar(select(RfqItem).where(RfqItem.rfq_id == rfq.id)):
				db.add(RfqItem(rfq_id=rfq.id, component_id=components[component_key].id, description=components[component_key].name, quantity=quantity))

		db.flush()
		invited = {
			"rfq_ecu": [("SUP-001", "RESPONDED"), ("SUP-003", "RESPONDED"), ("SUP-004", "PENDING")],
			"rfq_steel": [("SUP-002", "RESPONDED"), ("SUP-004", "RESPONDED")],
			"rfq_sensor": [("SUP-001", "RESPONDED"), ("SUP-003", "RESPONDED"), ("SUP-004", "RESPONDED")],
		}
		for rfq_key, supplier_rows in invited.items():
			for supplier_code, response_status in supplier_rows:
				if not db.scalar(select(RfqSupplier).where(RfqSupplier.rfq_id == rfqs[rfq_key].id, RfqSupplier.supplier_id == suppliers[supplier_code].id)):
					db.add(RfqSupplier(rfq_id=rfqs[rfq_key].id, supplier_id=suppliers[supplier_code].id, response_status=response_status, sent_at=now - timedelta(days=4), viewed_at=now - timedelta(days=3), responded_at=now - timedelta(days=1) if response_status == "RESPONDED" else None))

		quotations = [
			("q_ecu_tech", "rfq_ecu", "SUP-001", 98, 980000, 10000, 12000, 26),
			("q_ecu_auto", "rfq_ecu", "SUP-003", 105, 1050000, 10000, 12000, 24),
			("q_steel_industrial", "rfq_steel", "SUP-002", 62, 1860000, 30000, 35000, 42),
			("q_sensor_tech", "rfq_sensor", "SUP-001", 42, 231000, 5500, 8000, 32),
			("q_sensor_global", "rfq_sensor", "SUP-004", 39, 214500, 5500, 6000, 36),
		]
		quote_records = {}
		for key, rfq_key, supplier_code, unit_price, total_price, quantity, available, delivery_days in quotations:
			quote_records[key] = ensure(db, Quotation, IDS[key], rfq_id=rfqs[rfq_key].id, supplier_id=suppliers[supplier_code].id, version=1, unit_price=Decimal(str(unit_price)), total_price=Decimal(str(total_price)), quantity=quantity, available_quantity=available, delivery_at=now + timedelta(days=delivery_days), payment_terms="Net 30", warranty_quality="ISO 9001 certified production and full batch traceability.", additional_notes="Mock quotation for frontend workflow demonstration.", status="SUBMITTED", submitted_at=now - timedelta(days=1))
		db.flush()

		approvals = [
			("approval_ecu", "rfq_ecu", "q_ecu_tech", "PENDING", None),
			("approval_sensor", "rfq_sensor", "q_sensor_global", "APPROVED", "Approved after reviewing delivery capacity and total landed cost."),
		]
		approval_records = {}
		for key, rfq_key, quote_key, status, reason in approvals:
			approval_records[key] = ensure(db, Approval, IDS[key], rfq_id=rfqs[rfq_key].id, quotation_id=quote_records[quote_key].id, requested_by=procurement.id, status=status, decision_reason=reason, decided_at=now - timedelta(days=1) if status == "APPROVED" else None)

		ensure(db, Negotiation, IDS["negotiation_sensor"], rfq_id=rfqs["rfq_sensor"].id, quotation_id=quote_records["q_sensor_global"].id, supplier_id=suppliers["SUP-004"].id, status="OPEN")
		db.flush()
		if not db.scalar(select(NegotiationMessage).where(NegotiationMessage.negotiation_id == IDS["negotiation_sensor"])):
			db.add(NegotiationMessage(negotiation_id=IDS["negotiation_sensor"], sender_type="PROCUREMENT", message_type="DRAFT", content="Please confirm whether delivery can be brought forward by five days while holding the quoted price.", authorized_by=procurement.id))

		po = ensure(db, PurchaseOrder, IDS["po_ecu"], supplier_id=suppliers["SUP-001"].id, rfq_id=rfqs["rfq_ecu"].id, quotation_id=quote_records["q_ecu_tech"].id, created_by=procurement.id, status="SENT", acknowledged_at=now - timedelta(hours=8), acknowledgement_notes="Acknowledged; production slot reserved.")
		db.flush()
		if not db.scalar(select(PurchaseOrderItem).where(PurchaseOrderItem.purchase_order_id == po.id)):
			db.add(PurchaseOrderItem(purchase_order_id=po.id, description="Electronic Control Unit", quantity=10000, unit_price=Decimal("98.00")))

		execution = ensure(db, WorkflowExecution, IDS["execution_ecu"], workflow_type="RFQ_ANALYSIS", event_type="RFQ_ANALYSIS", status="COMPLETED", requested_by=procurement.id, rfq_id=rfqs["rfq_ecu"].id, input_payload={"source": "mock_seed"}, output_payload={"recommended_supplier": "SUP-001", "confidence": 0.91}, started_at=now - timedelta(hours=5), completed_at=now - timedelta(hours=4))
		ensure(db, WorkflowExecution, IDS["execution_sensor"], workflow_type="SUPPLIER_RISK", event_type="SUPPLIER_PERFORMANCE_REVIEW", status="RUNNING", requested_by=procurement.id, rfq_id=rfqs["rfq_sensor"].id, supplier_id=suppliers["SUP-004"].id, input_payload={"source": "mock_seed"})
		db.flush()
		if not db.scalar(select(DecisionRecommendation).where(DecisionRecommendation.rfq_id == rfqs["rfq_ecu"].id)):
			db.add(DecisionRecommendation(rfq_id=rfqs["rfq_ecu"].id, execution_id=execution.id, status="PENDING_HUMAN_REVIEW", recommendation={"recommended_supplier_id": str(suppliers["SUP-001"].id), "recommendation_score": 88.4, "human_approval_required": True}, deterministic_result={"evaluated_supplier_count": 2, "feasible_supplier_count": 2}, explanation="TechCorp offers the strongest balance of delivery, price, and supplier risk."))

		notification_data = [
			(finance.id, "APPROVAL_REQUIRED", "Approval required for ECU sourcing", "A supplier selection is waiting for finance review.", rfqs["rfq_ecu"].id, quote_records["q_ecu_tech"].id, approval_records["approval_ecu"].id),
			(procurement.id, "NEGOTIATION_REQUEST", "Supplier negotiation is active", "GlobalSupply has an open delivery negotiation for Parking Sensor Type B.", rfqs["rfq_sensor"].id, quote_records["q_sensor_global"].id, None),
			(suppliers["SUP-001"].user_memberships[0].user_id if suppliers["SUP-001"].user_memberships else users["supplier"].id, "PURCHASE_ORDER_SENT", "Purchase order acknowledged", "PO for Electronic Control Units was acknowledged by the supplier.", rfqs["rfq_ecu"].id, quote_records["q_ecu_tech"].id, None),
		]
		for user_id, event_type, title, message, rfq_id, quotation_id, approval_id in notification_data:
			existing = db.scalar(select(Notification).where(Notification.user_id == user_id, Notification.title == title))
			if existing is None:
				db.add(Notification(user_id=user_id, event_type=event_type, title=title, message=message, rfq_id=rfq_id, quotation_id=quotation_id, approval_id=approval_id, purchase_order_id=po.id if event_type == "PURCHASE_ORDER_SENT" else None, is_read=False))

		if not db.scalar(select(ApprovalMessage).where(ApprovalMessage.approval_id == approval_records["approval_ecu"].id)):
			db.add(ApprovalMessage(approval_id=approval_records["approval_ecu"].id, sender_id=procurement.id, content="Please review the cost comparison and delivery commitment before approving."))
		if not db.scalar(select(ProcurementEvent).where(ProcurementEvent.event_type == "INVENTORY_SHORTAGE", ProcurementEvent.rfq_id == rfqs["rfq_steel"].id)):
			db.add(ProcurementEvent(event_type="INVENTORY_SHORTAGE", priority="CRITICAL", source_user_id=procurement.id, rfq_id=rfqs["rfq_steel"].id, component_id=components["steel"].id, supplier_id=suppliers["SUP-002"].id, context={"shortage_quantity": 29550, "source": "mock_seed"}))

		db.commit()
		print("Mock procurement data seeded successfully.")
	finally:
		db.close()


if __name__ == "__main__":
	seed_mock_data()

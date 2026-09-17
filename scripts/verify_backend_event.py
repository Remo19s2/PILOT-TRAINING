import urllib.request
import json

# 1. Login as Procurement Manager on local backend
login_url = "http://localhost:8000/api/auth/login"
login_payload = json.dumps({"username": "procurement", "password": "procurement123"}).encode('utf-8')

req = urllib.request.Request(login_url, data=login_payload, headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req) as resp:
        session = json.loads(resp.read().decode('utf-8'))
        token = session.get("access_token")
        print("Logged in successfully to local FastAPI backend!")
        print(f"Token acquired: {token[:20]}...")

        # 2. Fire Trigger 1: NEGOTIATION_REQUEST
        event_url = "http://localhost:8000/api/workflows/events"
        event_payload = json.dumps({
            "event_type": "NEGOTIATION_REQUEST",
            "priority": "HIGH",
            "source": {
                "user_id": None,
                "rfq_id": None,
                "component_id": None,
                "supplier_id": None
            },
            "context": {
                "rfq_id": "RFQ-001",
                "quotation_id": "QT-001",
                "supplier_id": "SUP-001",
                "component_id": None,
                "quoted_price": 100,
                "quoted_quantity": 500,
                "quoted_delivery_date": "10 days",
                "negotiation_reason": "Leverage volume commitment (500 units) and prompt payment terms (Net 30) to request an optimal ₹94/unit counter-offer.",
                "proposed_counter_price": 94,
                "target_delivery_days": 10,
                "payment_terms": "Net 30",
                "ai_confidence": 94,
                "ai_strategy": "Leverage volume commitment (500 units) and prompt payment terms (Net 30) to request an optimal ₹94/unit counter-offer."
            }
        }).encode('utf-8')

        event_req = urllib.request.Request(event_url, data=event_payload, headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {token}'
        })

        with urllib.request.urlopen(event_req) as event_resp:
            execution_res = json.loads(event_resp.read().decode('utf-8'))
            print("\nTrigger 1 event ingested successfully on FastAPI backend!")
            print(f"Workflow Execution ID: {execution_res.get('id')}")
            print(f"Workflow Type: {execution_res.get('workflow_type')}")
            print(f"Event Type: {execution_res.get('event_type')}")
            print(f"Status: {execution_res.get('status')}")
            print(f"Error Message / SNS Status: {execution_res.get('error_message')}")
            print("Full Execution Object:", json.dumps(execution_res, indent=2))
except Exception as e:
    print(f"Backend call error: {e}")

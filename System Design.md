# System Design for AI-Based Procurement Negotiation Intelligence System

## 1. Functional Requirements

**Functional requirements define what the system must do.** They describe the features, inputs, processing, outputs, and actions performed by the system.

For your procurement system, the functional requirements should be:

| ID    | Functional Requirement                                                                                                                                          |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-01 | The system shall allow authorized procurement users to log in and access the procurement dashboard.                                                             |
| FR-02 | The system shall allow users to upload or enter supplier quotations containing price, quantity, delivery terms, payment terms, and other commercial conditions. |
| FR-03 | The system shall store and retrieve supplier quotation and purchase-history data.                                                                               |
| FR-04 | The system shall compare quotations from multiple suppliers for the same material or purchase requirement.                                                      |
| FR-05 | The system shall compare the current quoted price with historical purchase prices.                                                                              |
| FR-06 | The system shall analyze supplier delivery performance using historical order and delivery data.                                                                |
| FR-07 | The system shall analyze supplier quality-performance data and identify recurring quality issues.                                                               |
| FR-08 | The system shall calculate a supplier risk score based on defined risk factors such as delivery, quality, supply capacity, price, and commercial conditions.    |
| FR-09 | The system shall identify potential cost-saving opportunities from quotation and historical-price analysis.                                                     |
| FR-10 | The system shall generate AI-based negotiation recommendations, including target price, negotiation points, and supplier considerations.                        |
| FR-11 | The system shall rank or compare suppliers using configurable evaluation criteria.                                                                              |
| FR-12 | The system shall display procurement KPIs, supplier scores, trends, alerts, and recommendations on the dashboard.                                               |
| FR-13 | The system shall allow users to ask procurement-related questions through an AI assistant.                                                                      |
| FR-14 | The system shall generate alerts for significant supplier risks such as delivery delays, quality deterioration, unusual price increases, or capacity shortages. |
| FR-15 | The system shall allow users to view the reasoning or factors contributing to an AI recommendation.                                                             |
| FR-16 | The system shall maintain procurement analysis and supplier-performance records for future reference.                                                           |

### Important distinction

For example:

**“System calculates supplier risk score” → Functional Requirement**

**“Risk score must be calculated within 3 seconds” → Non-Functional Requirement**

The first describes **what** the system does; the second describes **how well** it must do it.

---

# 2. Non-Functional Requirements

**Non-functional requirements define the quality attributes, constraints, and performance expectations of the system.**

| Category        | Requirement                                                                                                                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Performance     | Normal dashboard and analysis requests should return results within an acceptable response time, such as 3–5 seconds, excluding unusually large file processing or external AI-service delays. |
| Availability    | The system should remain available during normal procurement working hours and handle temporary service failures gracefully.                                                                   |
| Security        | Only authenticated and authorized users shall be able to access procurement and supplier information.                                                                                          |
| Data Protection | Supplier quotations, pricing, purchase history, and commercial information shall be protected from unauthorized access.                                                                        |
| Scalability     | The system should support increasing numbers of suppliers, quotations, purchase records, and users without major architectural changes.                                                        |
| Reliability     | The system should provide consistent calculations and should not lose procurement data during normal operations or recoverable failures.                                                       |
| Accuracy        | Risk scores and analytical calculations shall be based on defined rules, validated data, and traceable input values.                                                                           |
| Explainability  | AI-generated negotiation and risk recommendations should identify the major factors supporting the recommendation rather than providing an unexplained conclusion.                             |
| Usability       | Procurement users should be able to compare suppliers, understand risks, and access recommendations with minimal training.                                                                     |
| Maintainability | Frontend, AI-agent workflows, business rules, and data-processing components should be modular so they can be modified independently.                                                          |
| Compatibility   | The React/Vite frontend shall communicate with the backend/AI services through defined APIs and structured data formats such as JSON.                                                          |
| Auditability    | Important procurement analyses and system-generated recommendations should be logged so that decisions can be reviewed later.                                                                  |

### Avoid vague NFRs

Do not write:

> “The system should be fast.”

Write:

> “The system should return standard dashboard and supplier-comparison results within 3–5 seconds under normal load.”

That makes the requirement **measurable and testable**.

---

# 3. Business Process Modeling — AS-IS

The **AS-IS process** represents how procurement is currently performed before introducing the AI system.

### AS-IS Flow

```text
Purchase Requirement
        ↓
Procurement Team Requests Quotations
        ↓
Receive Supplier Quotations
        ↓
Collect Historical Purchase Data
        ↓
Manually Compare Prices
        ↓
Manually Check Quantity & Delivery Terms
        ↓
Review Supplier History
        ↓
Identify Issues / Risks
        ↓
Prepare Negotiation Strategy
        ↓
Negotiate with Supplier
        ↓
Select Supplier
        ↓
Place Order
        ↓
Problems May Be Discovered During / After Delivery
```

### Problems in AS-IS

```text
Manual comparison
       ↓
Time-consuming analysis
       ↓
Important historical information may be missed
       ↓
Inconsistent supplier evaluation
       ↓
Weak negotiation preparation
       ↓
Supplier risks may be detected late
       ↓
Potential cost savings are missed
```

---

# 4. Business Process Modeling — TO-BE

The **TO-BE process** shows how the process works after implementing your AI procurement system.

```text
Purchase Requirement
        ↓
Upload / Enter Supplier Quotations
        ↓
AI Collects & Processes Procurement Data
        ↓
┌─────────────────────────────────────┐
│       AI Procurement Analysis       │
├─────────────────────────────────────┤
│ Price Analysis                      │
│ Historical Price Analysis           │
│ Supplier Comparison                 │
│ Delivery Analysis                   │
│ Quality Analysis                    │
│ Supplier Risk Analysis              │
│ Commercial Terms Analysis            │
└──────────────────┬──────────────────┘
                   ↓
        Negotiation Intelligence
                   ↓
       Target Price + Strategy
                   ↓
       Cost-Saving Opportunities
                   ↓
          Supplier Risk Alerts
                   ↓
         Procurement Decision
                   ↓
        Supplier Negotiation
                   ↓
            Supplier Selection
                   ↓
             Purchase Order
                   ↓
        Continuous Monitoring
```

### Key improvement

The biggest change is:

**AS-IS:** Problems and opportunities are mainly identified through manual analysis and sometimes after something goes wrong.

**TO-BE:** The system analyzes available historical and current data **before the purchasing decision**, giving the procurement team actionable intelligence.

---

# 5. Use Case Diagram

### Actors

**Primary Actor**

* Procurement Manager / Procurement Officer

**Supporting Actors**

* Supplier
* AI Procurement System
* Data Administrator

### Main Use Cases

```text
                    ┌─────────────────────────────┐
                    │ AI PROCUREMENT INTELLIGENCE │
                    │           SYSTEM            │
                    │                             │
Procurement Manager ──► Login                     │
                    ├──► Manage Quotations        │
                    ├──► Compare Suppliers        │
                    ├──► View Purchase History    │
                    ├──► Analyze Supplier Risk    │
                    ├──► Analyze Prices           │
                    ├──► Get Negotiation Strategy │
                    ├──► View Cost Savings        │
                    ├──► View Alerts              │
                    ├──► Ask AI Assistant         │
                    └──► Generate Reports          │
                    │                             │
Supplier ───────────► Provide Quotation           │
                    │                             │
Administrator ──────► Manage Users / Data         │
                    └─────────────────────────────┘
```

### Use Case Relationships

A stronger UML representation would be:

```text
Analyze Supplier
      │
      ├── <<include>> Compare Quotations
      ├── <<include>> Analyze Historical Prices
      ├── <<include>> Analyze Delivery Performance
      └── <<include>> Analyze Quality Performance

Generate Negotiation Strategy
      │
      ├── <<include>> Analyze Supplier
      ├── <<include>> Calculate Target Price
      └── <<include>> Identify Cost-Saving Opportunities

Analyze Supplier Risk
      │
      ├── <<include>> Delivery Risk
      ├── <<include>> Quality Risk
      ├── <<include>> Supply Risk
      ├── <<include>> Price Risk
      └── <<include>> Commercial Risk
```

---

# 6. Activity Diagram

The activity diagram should show the detailed processing from quotation input to procurement decision.

```text
                 START
                   │
                   ▼
        User Logs into System
                   │
                   ▼
        Enter Purchase Requirement
                   │
                   ▼
        Upload Supplier Quotations
                   │
                   ▼
         Validate Input Data
                   │
             ┌─────┴─────┐
             │           │
          Valid?        No
             │           │
            Yes          ▼
             │       Show Errors
             │           │
             │           └──────► Correct Data
             ▼
       Retrieve Historical Data
             │
             ▼
      Compare Supplier Prices
             │
             ▼
      Analyze Delivery History
             │
             ▼
        Analyze Quality Data
             │
             ▼
       Analyze Supply Capacity
             │
             ▼
      Analyze Commercial Terms
             │
             ▼
       Calculate Risk Score
             │
             ▼
   Identify Cost-Saving Opportunities
             │
             ▼
    Generate Negotiation Strategy
             │
             ▼
     Display AI Recommendations
             │
             ▼
     Procurement Manager Reviews
             │
         ┌───┴────┐
         │        │
      Accept    Reject/Modify
         │        │
         │        ▼
         │   Re-evaluate
         │        │
         └────────┘
             │
             ▼
       Supplier Negotiation
             │
             ▼
       Select Supplier
             │
             ▼
        Place Purchase Order
             │
             ▼
              END
```

---

# 7. User Journey Mapping

This shows what the **procurement user experiences** at each stage.

| Stage           | User Action                  | System Action                                  | User Need                       | Output                  |
| --------------- | ---------------------------- | ---------------------------------------------- | ------------------------------- | ----------------------- |
| 1. Requirement  | Creates purchase requirement | Records material, quantity and requirements    | Start procurement               | Purchase request        |
| 2. Quotations   | Uploads supplier quotations  | Validates and extracts quotation data          | Avoid manual data entry         | Structured quotations   |
| 3. Comparison   | Opens comparison screen      | Compares price, terms and supplier performance | Find best supplier              | Supplier comparison     |
| 4. Intelligence | Requests analysis            | Runs AI analysis                               | Understand purchasing situation | AI insights             |
| 5. Risk Review  | Checks supplier risk         | Calculates risk factors and overall score      | Avoid unreliable suppliers      | Risk assessment         |
| 6. Negotiation  | Reviews recommendations      | Generates target price and negotiation points  | Negotiate effectively           | Negotiation strategy    |
| 7. Decision     | Selects/shortlists supplier  | Records decision                               | Make informed purchase          | Supplier decision       |
| 8. Monitoring   | Tracks supplier              | Updates performance from new data              | Detect future issues early      | Alerts and updated risk |

### User Journey Flow

```text
Need to Purchase
       ↓
Collect Quotations
       ↓
Upload Data
       ↓
Compare Suppliers
       ↓
Understand Price History
       ↓
Check Supplier Risk
       ↓
See Potential Savings
       ↓
Receive Negotiation Strategy
       ↓
Negotiate
       ↓
Select Supplier
       ↓
Place Order
       ↓
Monitor Supplier
```

---

# 8. Overall System Flow

This is the **main flow I recommend putting in your project documentation/presentation**:

```text
                        USER
                         │
                         ▼
                React + Vite UI
                         │
                         ▼
               Purchase Requirement
                         │
                         ▼
                Supplier Quotations
                         │
                         ▼
               ┌───────────────────┐
               │   SNS Workbench   │
               │   AI Backend      │
               └─────────┬─────────┘
                         │
                         ▼
                  Data Processing
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
    Price Analysis   Supplier Risk   Terms Analysis
          │              │              │
          │        ┌─────┴─────┐        │
          │        ▼           ▼        │
          │    Delivery     Quality     │
          │      Risk         Risk      │
          │        │           │        │
          │        └─────┬─────┘        │
          │              ▼              │
          │         Supply Risk         │
          └──────────────┬──────────────┘
                         ▼
              Negotiation Intelligence
                         │
             ┌───────────┼───────────┐
             ▼           ▼           ▼
        Target Price  Risk Score  Cost Saving
             │           │           │
             └───────────┼───────────┘
                         ▼
                 AI Recommendation
                         │
                         ▼
                React Dashboard
                         │
                         ▼
              Procurement Decision
                         │
                         ▼
                 Supplier Negotiation
                         │
                         ▼
                   Final Purchase
                         │
                         ▼
              Supplier Performance Data
                         │
                         └──────────────► Future AI Analysis
```

## 9. Two Main System Workflows

### Frontend Workflow

```text
Login
 ↓
Dashboard
 ↓
Create Purchase Requirement
 ↓
Upload Quotations
 ↓
Quotation Comparison
 ↓
Supplier Analysis
 ↓
Risk Analysis
 ↓
Negotiation Intelligence
 ↓
Cost-Saving Insights
 ↓
AI Assistant
 ↓
Procurement Decision
```

### Backend / SNS Workbench Workflow

```text
API Request
 ↓
Validate & Process Input
 ↓
Retrieve Historical Procurement Data
 ↓
Price Analysis Agent
 ↓
Supplier Risk Agent
 ↓
Delivery Analysis
 ↓
Quality Analysis
 ↓
Supply Capacity Analysis
 ↓
Commercial Terms Analysis
 ↓
Negotiation Strategy Agent
 ↓
Cost-Saving Analysis
 ↓
Generate Explainable Recommendation
 ↓
JSON Response
 ↓
React Frontend
```

### Recommended project architecture

```text
┌──────────────────────────────────────────────────────┐
│                 REACT + VITE FRONTEND                │
│ Dashboard │ Quotations │ Suppliers │ Risk │ AI Chat │
└─────────────────────────┬────────────────────────────┘
                          │
                       REST API
                          │
┌─────────────────────────▼────────────────────────────┐
│                 SNS WORKBENCH BACKEND                │
│                                                      │
│ Data Processing                                      │
│       ↓                                              │
│ Price Analysis Agent                                 │
│       ↓                                              │
│ Supplier Risk Agent                                  │
│       ↓                                              │
│ Negotiation Intelligence Agent                      │
│       ↓                                              │
│ Cost-Saving Analysis                                 │
│       ↓                                              │
│ Explainable Recommendation                           │
└─────────────────────────┬────────────────────────────┘
                          │
                          ▼
                  Procurement Database
```

**Core design principle:** the system should not simply tell the procurement manager *“Supplier B is best.”* It should show **why**, using quotation price, historical price, delivery reliability, quality, capacity, commercial terms, supplier risk, and potential savings—and then convert that analysis into a **negotiation action**.

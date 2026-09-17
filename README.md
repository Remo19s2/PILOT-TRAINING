# PRISM Procurement Intelligence System

The repository contains the existing React/Vite application and a FastAPI/PostgreSQL service. The React pages remain the presentation layer; business mutations and authorization are server-owned.

## Run locally

1. Create a PostgreSQL database and apply `backend/migrations/001_initial.sql`; apply `backend/migrations/002_stage2.sql` when upgrading an existing Stage 1 database.
2. Copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL` and `JWT_SECRET_KEY`. SNS settings are optional for local deterministic workflows, but required for Workbench dispatch.
3. From `backend`, install dependencies with `python -m pip install -r requirements.txt`.
4. Seed local users with `python -m app.seed`.
5. Populate the shared Supabase demo workflow with repeatable fixtures using `python seed_mock_data.py` from `backend`.
6. Start the API with `python -m app` from `backend`.
7. In the repository root, set `VITE_API_BASE_URL=http://localhost:8000/api` in `.env.local`, then run `npm install` and `npm run dev`.

Seeded development users are `procurement / procurement123`, `supplier / supplier123`, and `finance / finance123`. Replace these credentials outside local development.

For local Uvicorn development, run from `backend` with `python -m app` or `uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload`. The launcher reads `PORT`; Render uses the explicit production command below. `AUTO_CREATE_SCHEMA=false` is the default; set it to `true` only for disposable local development. Production schema management is migration-only.

## Render deployment

The repository includes [render.yaml](render.yaml). Render can use it directly, or configure the service manually:

- Build command: `pip install -r backend/requirements.txt`
- Start command: `uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port $PORT`
- Health-check path: `/health`

Set `APP_ENV=production`, `DATABASE_URL` to the Supabase PostgreSQL connection string, a strong `JWT_SECRET_KEY` of at least 32 characters, and `CORS_ORIGINS` to the exact frontend origin(s). Do not set `CORS_ORIGINS=*` when credentials are enabled.

Before starting the service, apply the database migrations from a trusted environment:

```powershell
psql "$env:DATABASE_URL" -f backend/migrations/001_initial.sql
psql "$env:DATABASE_URL" -f backend/migrations/002_stage2.sql
```

Do not rely on FastAPI startup `create_all()` for production schema management. `seed.py` is a local development utility and is never run by Render startup.

The local frontend should continue using `VITE_API_BASE_URL=http://localhost:8000/api`. After deployment, configure it externally as `VITE_API_BASE_URL=https://<render-service>.onrender.com/api`; no Render URL is hardcoded in React.

The future SNS callback URL is `https://<render-service>.onrender.com/api/sns/webhook`. Configure the SNS variables only after the actual Workbench endpoint, workflow IDs, callback authentication, and payload contract are available. SNS was not verified as part of this deployment preparation.

## API

Interactive documentation is available at `http://localhost:8000/docs`.

Authentication: `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/refresh`.

Suppliers and planning: `GET /api/suppliers`, `GET /api/suppliers/{supplier_id}`, `GET /api/planning/requirements`, `GET /api/planning/requirements/{id}`.

RFQs: `POST /api/rfqs`, `GET /api/rfqs`, `GET /api/rfqs/{rfq_id}`, `POST /api/rfqs/{rfq_id}/send`, `GET /api/rfqs/{rfq_id}/responses`, and `POST /api/rfqs/{rfq_id}/select`.

Quotations: `POST /api/quotations`, `GET /api/rfqs/{rfq_id}/quotations`, `GET /api/quotations/{quotation_id}`, and `POST /api/quotations/{quotation_id}/revise`.

Approvals: `GET /api/approvals`, `POST /api/approvals/{approval_id}/approve`, and `POST /api/approvals/{approval_id}/reject`.

Workflow execution: `POST /api/workflows/events`, `POST /api/monitoring/events`, `GET /api/workflows/executions/{execution_id}`, and `POST /api/sns/webhook`.

Decision support: `GET /api/decisions/{rfq_id}`, `POST /api/decisions/{rfq_id}/run`, and `POST /api/decisions/{rfq_id}/action`.

Negotiation: `GET /api/negotiations`, `POST /api/negotiations/draft`, and `POST /api/negotiations/{negotiation_id}/authorize`. Drafts are not sent automatically.

Purchase orders: `GET /api/purchase-orders`, `GET /api/purchase-orders/{po_id}`, `POST /api/purchase-orders`, `POST /api/purchase-orders/{po_id}/send`, and `POST /api/purchase-orders/{po_id}/acknowledge`.

SNS-specific details are intentionally not assumed. Configure `SNS_EXECUTION_URL_TEMPLATE` to the actual Workbench execution endpoint format supplied by SNS, plus workflow IDs, webhook secret, and `SNS_WEBHOOK_SIGNATURE_HEADER`. Without it, workflow requests remain `WAITING_FOR_SNS`. The callback URL is `POST https://<fastapi-domain>/api/sns/webhook`; callbacks should include `prism_execution_id` and may include `sns_execution_id`, along with the callback status and output payload. Legacy `execution_id` is supported only when it identifies one execution unambiguously.

## Tests

Run `pytest backend/tests` from the repository root after installing backend dependencies. The tests cover RFQ evaluation gating, quotation submission, and supplier isolation.

## Architecture notes

`src/api` is the frontend service layer. `WorkflowContext` is now a cache/orchestration layer and stores only authentication/session state in localStorage. The 23-table PostgreSQL migration keeps RFQ supplier responses relational, supports immutable quotation revisions, and records consequential mutations in `audit_logs`. Stage 2 adds event, execution, decision, negotiation-message, and PO approval lineage tables.

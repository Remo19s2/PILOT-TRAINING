-- Apply after 001_initial.sql on an existing Stage 1 database.
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS execution_id uuid;
CREATE INDEX IF NOT EXISTS ix_audit_execution ON audit_logs(execution_id);

ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS quotation_id uuid REFERENCES quotations(id);
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES users(id);
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS acknowledged_at timestamptz;
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS acknowledgement_notes text;

CREATE TABLE IF NOT EXISTS procurement_events (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), event_type varchar(64) NOT NULL, priority varchar(16) NOT NULL DEFAULT 'MEDIUM', source_user_id uuid REFERENCES users(id), rfq_id uuid REFERENCES rfqs(id), component_id uuid, supplier_id uuid REFERENCES suppliers(id), context jsonb NOT NULL DEFAULT '{}'::jsonb, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS workflow_executions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), workflow_type varchar(64) NOT NULL, event_type varchar(64) NOT NULL, parent_execution_id uuid REFERENCES workflow_executions(id), status varchar(32) NOT NULL DEFAULT 'QUEUED', requested_by uuid REFERENCES users(id), rfq_id uuid REFERENCES rfqs(id), component_id uuid, supplier_id uuid REFERENCES suppliers(id), sns_workflow_id varchar(255), sns_execution_id varchar(255) UNIQUE, input_payload jsonb NOT NULL DEFAULT '{}'::jsonb, output_payload jsonb, error_message text, started_at timestamptz, completed_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS ix_execution_lineage ON workflow_executions(parent_execution_id);
CREATE TABLE IF NOT EXISTS decision_recommendations (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), rfq_id uuid NOT NULL REFERENCES rfqs(id), execution_id uuid REFERENCES workflow_executions(id), status varchar(32) NOT NULL DEFAULT 'PENDING_HUMAN_REVIEW', recommendation jsonb NOT NULL, deterministic_result jsonb NOT NULL, explanation text, human_decision varchar(32), human_notes text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS negotiation_messages (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), negotiation_id uuid NOT NULL REFERENCES negotiations(id) ON DELETE CASCADE, sender_type varchar(32) NOT NULL, message_type varchar(32) NOT NULL, content text NOT NULL, authorized_by uuid REFERENCES users(id), execution_id uuid REFERENCES workflow_executions(id), created_at timestamptz NOT NULL DEFAULT now());

CREATE INDEX IF NOT EXISTS ix_rfq_execution_status ON workflow_executions(rfq_id, status);
CREATE INDEX IF NOT EXISTS ix_event_type_created ON procurement_events(event_type, created_at);

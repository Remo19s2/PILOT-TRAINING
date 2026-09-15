BEGIN;

-- 1) Ensure the production user identity and username contract exists.
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS username varchar(100);

UPDATE users
SET username = lower(trim(username))
WHERE username IS NOT NULL AND username <> lower(trim(username));

UPDATE users
SET username = CASE
    WHEN username IS NULL OR trim(username) = '' THEN
        'user_' || substr(replace(user_id::text, '-', ''), 1, 12)
    ELSE
        username
END
WHERE username IS NULL OR trim(username) = '';

WITH backfilled AS (
    SELECT user_id,
           username,
           row_number() OVER (PARTITION BY username ORDER BY created_at, user_id) AS rn
    FROM users
    WHERE username IS NOT NULL
)
UPDATE users u
SET username = CASE
    WHEN b.rn = 1 THEN u.username
    ELSE lower(substr(u.username, 1, 88)) || '_' || substr(replace(u.user_id::text, '-', ''), 1, 8)
END
FROM backfilled b
WHERE u.user_id = b.user_id AND b.rn > 1;

-- Preserve email and password_hash. The backfill only populates username.
CREATE UNIQUE INDEX IF NOT EXISTS ux_users_username
    ON users (username);

ALTER TABLE users
    ALTER COLUMN username SET DATA TYPE varchar(100),
    ALTER COLUMN username SET NOT NULL;

-- 2) Add execution linkage to audit logs if the ORM is using it.
ALTER TABLE IF EXISTS audit_logs ADD COLUMN IF NOT EXISTS execution_id uuid;

CREATE INDEX IF NOT EXISTS ix_audit_execution ON audit_logs (execution_id);

-- 3) Ensure the missing Stage 2 transaction tables exist in UUID PK/FK format.
CREATE TABLE IF NOT EXISTS rfqs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    requirement_id uuid,
    created_by uuid NOT NULL REFERENCES users(user_id),
    status varchar(32) NOT NULL DEFAULT 'DRAFT',
    release_date timestamptz,
    quotation_deadline timestamptz NOT NULL,
    required_delivery_date timestamptz NOT NULL,
    evaluation_policy text NOT NULL,
    expected_supplier_count integer NOT NULL CHECK (expected_supplier_count > 0),
    minimum_valid_quotation_count integer NOT NULL CHECK (minimum_valid_quotation_count > 0),
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT chk_rfq_minimum_valid_count CHECK (minimum_valid_quotation_count <= expected_supplier_count)
);

CREATE TABLE IF NOT EXISTS rfq_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_id uuid NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
    component_id uuid REFERENCES components(component_id),
    description text NOT NULL,
    quantity integer NOT NULL CHECK (quantity > 0)
);

CREATE TABLE IF NOT EXISTS rfq_suppliers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_id uuid NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
    supplier_id uuid NOT NULL REFERENCES suppliers(supplier_id),
    response_status varchar(32) NOT NULL DEFAULT 'PENDING' CHECK (response_status IN ('PENDING','VIEWED','RESPONDED','LATE','NO_RESPONSE','WITHDRAWN')),
    sent_at timestamptz,
    viewed_at timestamptz,
    responded_at timestamptz,
    UNIQUE (rfq_id, supplier_id)
);

CREATE TABLE IF NOT EXISTS quotations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_id uuid NOT NULL REFERENCES rfqs(id),
    supplier_id uuid NOT NULL REFERENCES suppliers(supplier_id),
    version integer NOT NULL CHECK (version > 0),
    unit_price numeric(14,4) NOT NULL CHECK (unit_price > 0),
    total_price numeric(18,2) NOT NULL CHECK (total_price > 0),
    quantity integer NOT NULL CHECK (quantity > 0),
    available_quantity integer NOT NULL CHECK (available_quantity >= 0),
    delivery_at timestamptz NOT NULL,
    payment_terms varchar(120),
    warranty_quality text,
    additional_notes text,
    submitted_at timestamptz NOT NULL DEFAULT now(),
    status varchar(32) NOT NULL DEFAULT 'SUBMITTED',
    supersedes_id uuid REFERENCES quotations(id),
    UNIQUE (rfq_id, supplier_id, version)
);

CREATE INDEX IF NOT EXISTS ix_rfq_quotations_current ON quotations(rfq_id, supplier_id, status);

CREATE TABLE IF NOT EXISTS approvals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_id uuid NOT NULL REFERENCES rfqs(id),
    quotation_id uuid NOT NULL REFERENCES quotations(id),
    requested_by uuid NOT NULL REFERENCES users(user_id),
    status varchar(32) NOT NULL DEFAULT 'PENDING',
    decision_reason text,
    decided_at timestamptz
);

CREATE TABLE IF NOT EXISTS negotiations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_id uuid NOT NULL REFERENCES rfqs(id),
    quotation_id uuid NOT NULL REFERENCES quotations(id),
    supplier_id uuid NOT NULL REFERENCES suppliers(supplier_id),
    status varchar(32) NOT NULL DEFAULT 'OPEN',
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS purchase_orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id uuid NOT NULL REFERENCES suppliers(supplier_id),
    rfq_id uuid NOT NULL REFERENCES rfqs(id),
    quotation_id uuid NOT NULL REFERENCES quotations(id),
    created_by uuid NOT NULL REFERENCES users(user_id),
    acknowledged_at timestamptz,
    acknowledgement_notes text,
    status varchar(32) NOT NULL DEFAULT 'DRAFT',
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS purchase_order_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_order_id uuid NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    description text NOT NULL,
    quantity integer NOT NULL CHECK (quantity > 0),
    unit_price numeric(14,4) NOT NULL CHECK (unit_price > 0)
);

CREATE TABLE IF NOT EXISTS procurement_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type varchar(64) NOT NULL,
    priority varchar(16) NOT NULL DEFAULT 'MEDIUM',
    source_user_id uuid REFERENCES users(user_id),
    rfq_id uuid REFERENCES rfqs(id),
    component_id uuid REFERENCES components(component_id),
    supplier_id uuid REFERENCES suppliers(supplier_id),
    context jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS workflow_executions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_type varchar(64) NOT NULL,
    event_type varchar(64) NOT NULL,
    parent_execution_id uuid REFERENCES workflow_executions(id),
    status varchar(32) NOT NULL DEFAULT 'QUEUED',
    requested_by uuid REFERENCES users(user_id),
    rfq_id uuid REFERENCES rfqs(id),
    component_id uuid REFERENCES components(component_id),
    supplier_id uuid REFERENCES suppliers(supplier_id),
    sns_workflow_id varchar(255),
    sns_execution_id varchar(255) UNIQUE,
    input_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    output_payload jsonb,
    error_message text,
    started_at timestamptz,
    completed_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_execution_lineage ON workflow_executions(parent_execution_id);

CREATE TABLE IF NOT EXISTS decision_recommendations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_id uuid NOT NULL REFERENCES rfqs(id),
    execution_id uuid REFERENCES workflow_executions(id),
    status varchar(32) NOT NULL DEFAULT 'PENDING_HUMAN_REVIEW',
    recommendation jsonb NOT NULL,
    deterministic_result jsonb NOT NULL,
    explanation text,
    human_decision varchar(32),
    human_notes text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS negotiation_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    negotiation_id uuid NOT NULL REFERENCES negotiations(id) ON DELETE CASCADE,
    sender_type varchar(32) NOT NULL,
    message_type varchar(32) NOT NULL,
    content text NOT NULL,
    authorized_by uuid REFERENCES users(user_id),
    execution_id uuid REFERENCES workflow_executions(id),
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_rfq_execution_status ON workflow_executions(rfq_id, status);
CREATE INDEX IF NOT EXISTS ix_event_type_created ON procurement_events(event_type, created_at);

-- 4) Attach execution_id to the real audit_logs table with the correct FK if the table exists.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'audit_logs'
          AND column_name = 'execution_id'
    ) THEN
        -- no-op: the column already exists and is being managed by the earlier ALTER TABLE.
        NULL;
    ELSE
        ALTER TABLE audit_logs ADD COLUMN execution_id uuid;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conrelid = 'audit_logs'::regclass
          AND conname = 'audit_logs_execution_fk'
    ) THEN
        ALTER TABLE audit_logs
            ADD CONSTRAINT audit_logs_execution_fk
            FOREIGN KEY (execution_id) REFERENCES workflow_executions(id) ON DELETE SET NULL;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS ix_audit_logs_execution_id ON audit_logs(execution_id);

-- 5) Keep the existing reference data safe without assuming role_name is unique.
INSERT INTO roles (role_name)
SELECT role_name
FROM (VALUES
    ('PROCUREMENT_MANAGER'),
    ('SUPPLIER'),
    ('FINANCE_APPROVER')
) AS required_roles(role_name)
WHERE NOT EXISTS (
    SELECT 1
    FROM roles existing_role
    WHERE existing_role.role_name = required_roles.role_name
);

COMMIT;

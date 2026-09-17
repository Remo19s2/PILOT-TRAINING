BEGIN;

CREATE TABLE IF NOT EXISTS approval_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    approval_id uuid NOT NULL REFERENCES approvals(id) ON DELETE CASCADE,
    sender_id uuid NOT NULL REFERENCES users(user_id),
    content text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_approval_messages_thread
    ON approval_messages(approval_id, created_at);

COMMIT;
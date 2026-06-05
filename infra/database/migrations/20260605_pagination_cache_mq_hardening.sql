-- Backend pagination, notification outbox hardening and cache-friendly indexes.

-- Notification event outbox hardening:
-- 1. PROCESSING lock prevents multiple service instances from consuming the same event.
-- 2. retry_count/last_error keep failures observable and bounded.
-- 3. source_event_id on messages makes consumer retries idempotent per recipient.
ALTER TABLE kpm_notification_events ADD COLUMN IF NOT EXISTS retry_count INT NOT NULL DEFAULT 0;
ALTER TABLE kpm_notification_events ADD COLUMN IF NOT EXISTS locked_at TIMESTAMP;
ALTER TABLE kpm_notification_events ADD COLUMN IF NOT EXISTS last_error TEXT;

ALTER TABLE kpm_internal_messages ADD COLUMN IF NOT EXISTS source_event_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS uk_kpm_internal_messages_event_recipient
  ON kpm_internal_messages (source_event_id, recipient_user_id, message_type)
  WHERE source_event_id IS NOT NULL AND del_flag=0;

CREATE INDEX IF NOT EXISTS idx_kpm_notification_events_claim
  ON kpm_notification_events (status, del_flag, created_at, locked_at)
  WHERE status IN ('PENDING', 'PROCESSING');

CREATE INDEX IF NOT EXISTS idx_kpm_internal_messages_page
  ON kpm_internal_messages (recipient_user_id, del_flag, read_flag, created_at DESC, id DESC);

-- Page-list filters. These indexes are intentionally conservative: exact filters are btree,
-- keyword search remains ILIKE-compatible and can later move to pg_trgm when data volume requires it.
CREATE INDEX IF NOT EXISTS idx_kpm_customers_page ON kpm_customers (del_flag, created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_kpm_tasks_page ON kpm_tasks (del_flag, created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_kpm_tasks_customer_page ON kpm_tasks (customer_id, del_flag, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_kpm_tasks_project_page ON kpm_tasks (project_id, del_flag, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_kpm_orders_page ON kpm_orders (del_flag, order_date DESC, id DESC);

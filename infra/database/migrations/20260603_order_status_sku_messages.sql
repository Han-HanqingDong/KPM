-- Add order status, project SKU master data and internal-message retention support.
-- Safe to run multiple times in the V1 pilot database.

CREATE TABLE IF NOT EXISTS kpm_project_skus (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES kpm_projects(id) ON DELETE CASCADE,
  whole_machine_part_number TEXT NOT NULL,
  configuration_name TEXT NOT NULL,
  memory_type TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE kpm_project_skus ADD COLUMN IF NOT EXISTS creator TEXT;
ALTER TABLE kpm_project_skus ADD COLUMN IF NOT EXISTS updator TEXT;
ALTER TABLE kpm_project_skus ADD COLUMN IF NOT EXISTS create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE kpm_project_skus ADD COLUMN IF NOT EXISTS update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE kpm_project_skus ADD COLUMN IF NOT EXISTS del_flag SMALLINT NOT NULL DEFAULT 0;

ALTER TABLE kpm_orders ADD COLUMN IF NOT EXISTS sku_id TEXT REFERENCES kpm_project_skus(id);
ALTER TABLE kpm_orders ADD COLUMN IF NOT EXISTS sku_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE kpm_orders ADD COLUMN IF NOT EXISTS status TEXT;
ALTER TABLE kpm_orders ADD COLUMN IF NOT EXISTS actual_ship_date DATE;

INSERT INTO kpm_enum_items (id, enum_type, name, value, semantic, active, sort_order) VALUES
('enum-order-status-1','order_status','已创建','已创建','DEFAULT',true,10),
('enum-order-status-2','order_status','生产中','生产中','IN_PRODUCTION',true,20),
('enum-order-status-3','order_status','已发货','已发货','SHIPPED',true,30),
('enum-order-status-4','order_status','已收货','已收货','RECEIVED',true,40),
('enum-order-status-5','order_status','已完成','已完成','COMPLETED',true,50)
ON CONFLICT (enum_type, value) DO UPDATE
SET name=EXCLUDED.name,
    semantic=COALESCE(kpm_enum_items.semantic, EXCLUDED.semantic),
    active=true,
    sort_order=EXCLUDED.sort_order;

UPDATE kpm_orders
SET status = (
  SELECT value
  FROM kpm_enum_items
  WHERE enum_type='order_status'
    AND active=true
  ORDER BY CASE WHEN semantic='DEFAULT' THEN 0 ELSE 1 END, sort_order, id
  LIMIT 1
)
WHERE status IS NULL OR status = '';

ALTER TABLE kpm_orders ALTER COLUMN status SET NOT NULL;

ALTER TABLE kpm_internal_messages ADD COLUMN IF NOT EXISTS del_flag SMALLINT NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_kpm_project_skus_project ON kpm_project_skus(project_id, active, del_flag);
CREATE INDEX IF NOT EXISTS idx_kpm_orders_status ON kpm_orders(status, actual_ship_date);
CREATE INDEX IF NOT EXISTS idx_kpm_internal_messages_retention ON kpm_internal_messages(read_flag, read_at, del_flag);

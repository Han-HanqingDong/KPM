-- KPM database schema for local trial and future migrations.
-- Current scope: V1 pilot modules that need to match the approved prototype.

DROP TABLE IF EXISTS kpm_internal_messages CASCADE;
DROP TABLE IF EXISTS kpm_notification_events CASCADE;
DROP TABLE IF EXISTS kpm_order_histories CASCADE;
DROP TABLE IF EXISTS kpm_orders CASCADE;
DROP TABLE IF EXISTS kpm_task_comments CASCADE;
DROP TABLE IF EXISTS kpm_task_attachments CASCADE;
DROP TABLE IF EXISTS kpm_task_participants CASCADE;
DROP TABLE IF EXISTS kpm_task_assignees CASCADE;
DROP TABLE IF EXISTS kpm_tasks CASCADE;
DROP TABLE IF EXISTS kpm_requirements CASCADE;
DROP TABLE IF EXISTS kpm_project_customers CASCADE;
DROP TABLE IF EXISTS kpm_customer_followups CASCADE;
DROP TABLE IF EXISTS kpm_customer_materials CASCADE;
DROP TABLE IF EXISTS kpm_customer_contacts CASCADE;
DROP TABLE IF EXISTS kpm_customer_owners CASCADE;
DROP TABLE IF EXISTS kpm_customers CASCADE;
DROP TABLE IF EXISTS kpm_project_materials CASCADE;
DROP TABLE IF EXISTS kpm_stage_records CASCADE;
DROP TABLE IF EXISTS kpm_stage_materials CASCADE;
DROP TABLE IF EXISTS kpm_stage_assignees CASCADE;
DROP TABLE IF EXISTS kpm_project_stages CASCADE;
DROP TABLE IF EXISTS kpm_project_members CASCADE;
DROP TABLE IF EXISTS kpm_project_skus CASCADE;
DROP TABLE IF EXISTS kpm_projects CASCADE;
DROP TABLE IF EXISTS kpm_template_stages CASCADE;
DROP TABLE IF EXISTS kpm_process_templates CASCADE;
DROP TABLE IF EXISTS kpm_task_status_transitions CASCADE;
DROP TABLE IF EXISTS kpm_enum_items CASCADE;
DROP TABLE IF EXISTS kpm_prototype_snapshots CASCADE;
DROP TABLE IF EXISTS kpm_geocode_cache CASCADE;
DROP TABLE IF EXISTS kpm_user_permissions CASCADE;
DROP TABLE IF EXISTS kpm_role_permissions CASCADE;
DROP TABLE IF EXISTS kpm_user_roles CASCADE;
DROP TABLE IF EXISTS kpm_permissions CASCADE;
DROP TABLE IF EXISTS kpm_roles CASCADE;
DROP TABLE IF EXISTS kpm_user_departments CASCADE;
DROP TABLE IF EXISTS kpm_users CASCADE;
DROP TABLE IF EXISTS kpm_departments CASCADE;

CREATE TABLE kpm_departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT '启用',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE kpm_users (
  id TEXT PRIMARY KEY,
  account TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL DEFAULT '{noop}123456',
  status TEXT NOT NULL DEFAULT '启用',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE kpm_notification_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  aggregate_type TEXT NOT NULL,
  aggregate_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  recipient_user_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP
);

CREATE TABLE kpm_internal_messages (
  id TEXT PRIMARY KEY,
  recipient_user_id TEXT NOT NULL REFERENCES kpm_users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'system',
  read_flag BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP
);

CREATE TABLE kpm_user_departments (
  user_id TEXT NOT NULL REFERENCES kpm_users(id) ON DELETE CASCADE,
  department_id TEXT NOT NULL REFERENCES kpm_departments(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, department_id)
);

CREATE TABLE kpm_roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  role_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT '启用',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE kpm_user_roles (
  user_id TEXT NOT NULL REFERENCES kpm_users(id) ON DELETE CASCADE,
  role_id TEXT NOT NULL REFERENCES kpm_roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE kpm_permissions (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  permission_type TEXT NOT NULL,
  target TEXT NOT NULL,
  location TEXT NOT NULL
);

CREATE TABLE kpm_role_permissions (
  role_id TEXT NOT NULL REFERENCES kpm_roles(id) ON DELETE CASCADE,
  permission_id TEXT NOT NULL REFERENCES kpm_permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE kpm_user_permissions (
  user_id TEXT NOT NULL REFERENCES kpm_users(id) ON DELETE CASCADE,
  permission_id TEXT NOT NULL REFERENCES kpm_permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, permission_id)
);

CREATE TABLE kpm_enum_items (
  id TEXT PRIMARY KEY,
  enum_type TEXT NOT NULL,
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  semantic TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  UNIQUE (enum_type, value)
);

CREATE TABLE kpm_prototype_snapshots (
  id TEXT PRIMARY KEY,
  state JSONB NOT NULL,
  updated_by TEXT NOT NULL DEFAULT 'system',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE kpm_geocode_cache (
  query TEXT PRIMARY KEY,
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  display_name TEXT,
  provider TEXT NOT NULL,
  precision TEXT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE kpm_task_status_transitions (
  id TEXT PRIMARY KEY,
  from_status TEXT NOT NULL,
  to_status TEXT NOT NULL,
  UNIQUE (from_status, to_status)
);

CREATE TABLE kpm_process_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  scope TEXT NOT NULL,
  status TEXT NOT NULL,
  updated_at DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE kpm_template_stages (
  id TEXT PRIMARY KEY,
  template_id TEXT NOT NULL REFERENCES kpm_process_templates(id) ON DELETE CASCADE,
  stage_name TEXT NOT NULL,
  sort_order INT NOT NULL
);

CREATE TABLE kpm_projects (
  id TEXT PRIMARY KEY,
  external_name TEXT NOT NULL,
  internal_name TEXT NOT NULL,
  model_name TEXT NOT NULL,
  manager_user_id TEXT REFERENCES kpm_users(id),
  manager_account TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT '未开始',
  archived BOOLEAN NOT NULL DEFAULT FALSE,
  salesability TEXT NOT NULL DEFAULT '不可销售',
  unsellable_reason TEXT,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE kpm_project_skus (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES kpm_projects(id) ON DELETE CASCADE,
  whole_machine_part_number TEXT NOT NULL,
  configuration_name TEXT NOT NULL,
  memory_type TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE kpm_project_members (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES kpm_projects(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES kpm_users(id),
  user_account TEXT NOT NULL,
  role_name TEXT NOT NULL
);

CREATE TABLE kpm_project_stages (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES kpm_projects(id) ON DELETE CASCADE,
  stage_name TEXT NOT NULL,
  stage_order INT NOT NULL,
  status TEXT NOT NULL DEFAULT '未开始'
);

CREATE TABLE kpm_stage_assignees (
  id TEXT PRIMARY KEY,
  stage_id TEXT NOT NULL REFERENCES kpm_project_stages(id) ON DELETE CASCADE,
  assignee_type TEXT NOT NULL,
  assignee_name TEXT NOT NULL,
  account TEXT,
  user_id TEXT REFERENCES kpm_users(id)
);

CREATE TABLE kpm_stage_materials (
  id TEXT PRIMARY KEY,
  stage_id TEXT NOT NULL REFERENCES kpm_project_stages(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size TEXT,
  uploader TEXT,
  bucket TEXT,
  object_key TEXT,
  storage_url TEXT,
  storage_category TEXT,
  uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  published_to_project BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE kpm_stage_records (
  id TEXT PRIMARY KEY,
  stage_id TEXT NOT NULL REFERENCES kpm_project_stages(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  attachments JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE kpm_project_materials (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES kpm_projects(id) ON DELETE CASCADE,
  source_stage TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size TEXT,
  uploader TEXT,
  bucket TEXT,
  object_key TEXT,
  storage_url TEXT,
  storage_category TEXT,
  share_target TEXT NOT NULL DEFAULT '项目资料区',
  published_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE kpm_customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  short_name TEXT,
  region TEXT NOT NULL,
  address TEXT,
  level TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE kpm_customer_owners (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES kpm_customers(id) ON DELETE CASCADE,
  owner_type TEXT NOT NULL,
  owner_user_id TEXT REFERENCES kpm_users(id),
  owner_name TEXT NOT NULL
);

CREATE TABLE kpm_customer_contacts (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES kpm_customers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  phone TEXT,
  email TEXT,
  remark TEXT
);

CREATE TABLE kpm_customer_materials (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES kpm_customers(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size TEXT,
  uploader TEXT,
  bucket TEXT,
  object_key TEXT,
  storage_url TEXT,
  storage_category TEXT,
  uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE kpm_customer_followups (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES kpm_customers(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  attachments JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE kpm_project_customers (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES kpm_projects(id) ON DELETE CASCADE,
  customer_id TEXT NOT NULL REFERENCES kpm_customers(id) ON DELETE CASCADE,
  project_status TEXT NOT NULL,
  UNIQUE(project_id, customer_id)
);

CREATE TABLE kpm_requirements (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES kpm_projects(id) ON DELETE CASCADE,
  customer_id TEXT NOT NULL REFERENCES kpm_customers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  user_story TEXT,
  business_value TEXT,
  acceptance TEXT,
  priority TEXT NOT NULL,
  status TEXT NOT NULL,
  proposer TEXT,
  creator TEXT,
  created_date DATE NOT NULL DEFAULT CURRENT_DATE,
  task_id TEXT
);

CREATE TABLE kpm_tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  project_id TEXT REFERENCES kpm_projects(id) ON DELETE SET NULL,
  stage_id TEXT REFERENCES kpm_project_stages(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  creator_user_id TEXT REFERENCES kpm_users(id),
  creator TEXT NOT NULL,
  expected_completion_at DATE,
  due_date DATE,
  source TEXT,
  customer_id TEXT REFERENCES kpm_customers(id) ON DELETE SET NULL,
  blocked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE kpm_task_assignees (
  task_id TEXT NOT NULL REFERENCES kpm_tasks(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES kpm_users(id),
  assignee_name TEXT NOT NULL,
  PRIMARY KEY (task_id, assignee_name)
);

CREATE TABLE kpm_task_participants (
  task_id TEXT NOT NULL REFERENCES kpm_tasks(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES kpm_users(id),
  participant_name TEXT NOT NULL,
  PRIMARY KEY (task_id, participant_name)
);

CREATE TABLE kpm_task_attachments (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL REFERENCES kpm_tasks(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size TEXT,
  uploader TEXT,
  bucket TEXT,
  object_key TEXT,
  storage_url TEXT,
  storage_category TEXT,
  uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE kpm_task_comments (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL REFERENCES kpm_tasks(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  attachments JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE kpm_orders (
  id TEXT PRIMARY KEY,
  order_date DATE NOT NULL,
  customer_id TEXT NOT NULL REFERENCES kpm_customers(id),
  project_id TEXT NOT NULL REFERENCES kpm_projects(id),
  sku_id TEXT REFERENCES kpm_project_skus(id),
  sku_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  order_type TEXT NOT NULL,
  status TEXT NOT NULL,
  quantity INT NOT NULL,
  specification TEXT NOT NULL,
  expected_ship_date DATE,
  planned_ship_date DATE,
  actual_ship_date DATE,
  software_version TEXT,
  currency TEXT NOT NULL,
  unit_price NUMERIC(14, 2) NOT NULL DEFAULT 0,
  amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  creator_user_id TEXT REFERENCES kpm_users(id),
  creator TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE kpm_order_histories (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES kpm_orders(id) ON DELETE CASCADE,
  modifier TEXT NOT NULL,
  modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  changes TEXT NOT NULL,
  reason TEXT NOT NULL
);

CREATE INDEX idx_kpm_projects_search ON kpm_projects (external_name, internal_name, model_name);
CREATE INDEX idx_kpm_tasks_status ON kpm_tasks (status, category);
CREATE INDEX idx_kpm_orders_date ON kpm_orders (order_date);
CREATE INDEX idx_kpm_customers_region ON kpm_customers (region);
CREATE INDEX idx_kpm_notification_events_status ON kpm_notification_events (status, created_at);
CREATE INDEX idx_kpm_internal_messages_recipient ON kpm_internal_messages (recipient_user_id, read_flag, created_at);

-- Common fields required by Kozen/KPM backend coding standard.
-- Pilot compatibility note:
-- Current V1 tables still use string business identifiers as primary keys because the frontend and
-- cross-table references already depend on them. The next schema refactor should promote BIGSERIAL
-- `id` to the technical primary key and move these strings to business-code columns.
DO $$
DECLARE
  table_name text;
BEGIN
  FOR table_name IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename LIKE 'kpm_%'
  LOOP
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS creator TEXT', table_name);
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS updator TEXT', table_name);
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP', table_name);
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP', table_name);
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS del_flag SMALLINT NOT NULL DEFAULT 0', table_name);
  END LOOP;
END $$;

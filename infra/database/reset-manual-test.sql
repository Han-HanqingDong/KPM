-- Reset KPM local trial data for manual testing.
-- Keeps system permissions, enum configuration, task status transitions and process templates.
-- Clears business data and leaves only one administrator user.

BEGIN;

TRUNCATE TABLE
  kpm_order_histories,
  kpm_orders,
  kpm_task_comments,
  kpm_task_attachments,
  kpm_task_participants,
  kpm_task_assignees,
  kpm_tasks,
  kpm_requirements,
  kpm_project_customers,
  kpm_customer_followups,
  kpm_customer_materials,
  kpm_customer_contacts,
  kpm_customer_owners,
  kpm_customers,
  kpm_project_materials,
  kpm_stage_records,
  kpm_stage_materials,
  kpm_stage_assignees,
  kpm_project_stages,
  kpm_project_members,
  kpm_projects,
  kpm_prototype_snapshots,
  kpm_geocode_cache
RESTART IDENTITY CASCADE;

TRUNCATE TABLE
  kpm_user_permissions,
  kpm_user_roles,
  kpm_user_departments,
  kpm_users,
  kpm_role_permissions,
  kpm_roles,
  kpm_departments
RESTART IDENTITY CASCADE;

INSERT INTO kpm_departments (id, name, status)
VALUES ('dept-admin', '系统管理部', '启用');

INSERT INTO kpm_roles (id, name, role_type, status)
VALUES ('role-admin', '系统管理员', '全局角色', '启用');

INSERT INTO kpm_users (id, account, email, name, password_hash, status)
VALUES ('user-admin', 'admin@kozenmobile.com', 'admin@kozenmobile.com', '系统管理员', '{noop}123456', '启用');

INSERT INTO kpm_user_departments (user_id, department_id)
VALUES ('user-admin', 'dept-admin');

INSERT INTO kpm_user_roles (user_id, role_id)
VALUES ('user-admin', 'role-admin');

INSERT INTO kpm_role_permissions (role_id, permission_id)
SELECT 'role-admin', id FROM kpm_permissions;

COMMIT;

-- Performance indexes for KPM V1 pilot.
-- Focus areas: list pages, customer portal, dashboards and high-frequency relation lookups.

-- IAM / resource management
CREATE INDEX IF NOT EXISTS idx_kpm_users_active_name ON kpm_users (name) WHERE del_flag=0;
CREATE INDEX IF NOT EXISTS idx_kpm_users_active_account_email ON kpm_users (account, email) WHERE del_flag=0;
CREATE INDEX IF NOT EXISTS idx_kpm_user_departments_department ON kpm_user_departments (department_id, del_flag, user_id);
CREATE INDEX IF NOT EXISTS idx_kpm_user_roles_role ON kpm_user_roles (role_id, del_flag, user_id);
CREATE INDEX IF NOT EXISTS idx_kpm_role_permissions_permission ON kpm_role_permissions (permission_id, del_flag, role_id);
CREATE INDEX IF NOT EXISTS idx_kpm_user_permissions_permission ON kpm_user_permissions (permission_id, del_flag, user_id);
CREATE INDEX IF NOT EXISTS idx_kpm_enum_items_lookup ON kpm_enum_items (enum_type, value, active, del_flag);
CREATE INDEX IF NOT EXISTS idx_kpm_enum_items_default ON kpm_enum_items (enum_type, semantic, active, del_flag, sort_order, id);

-- Project management
CREATE INDEX IF NOT EXISTS idx_kpm_projects_list ON kpm_projects (del_flag, archived, created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_kpm_projects_manager ON kpm_projects (manager_user_id, del_flag);
CREATE INDEX IF NOT EXISTS idx_kpm_project_skus_project ON kpm_project_skus (project_id, active, del_flag, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_kpm_project_members_project ON kpm_project_members (project_id, del_flag, role_name);
CREATE INDEX IF NOT EXISTS idx_kpm_project_members_user ON kpm_project_members (user_id, del_flag, project_id);
CREATE INDEX IF NOT EXISTS idx_kpm_project_stages_project ON kpm_project_stages (project_id, del_flag, stage_order);
CREATE INDEX IF NOT EXISTS idx_kpm_template_stages_template ON kpm_template_stages (template_id, del_flag, sort_order);
CREATE INDEX IF NOT EXISTS idx_kpm_stage_assignees_stage ON kpm_stage_assignees (stage_id, del_flag, id);
CREATE INDEX IF NOT EXISTS idx_kpm_stage_assignees_user ON kpm_stage_assignees (user_id, del_flag, stage_id);
CREATE INDEX IF NOT EXISTS idx_kpm_stage_materials_stage ON kpm_stage_materials (stage_id, del_flag, uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_kpm_stage_records_stage ON kpm_stage_records (stage_id, del_flag, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_kpm_project_materials_project ON kpm_project_materials (project_id, del_flag, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_kpm_project_materials_public ON kpm_project_materials (project_id, public_visible, del_flag, public_at DESC, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_kpm_project_announcements_project_time ON kpm_project_announcements (project_id, del_flag, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_kpm_process_templates_list ON kpm_process_templates (del_flag, updated_at DESC, name);

-- Customer management
CREATE INDEX IF NOT EXISTS idx_kpm_customers_list ON kpm_customers (del_flag, name);
CREATE INDEX IF NOT EXISTS idx_kpm_customers_short_name_upper ON kpm_customers (upper(short_name)) WHERE del_flag=0;
CREATE INDEX IF NOT EXISTS idx_kpm_customer_owners_customer_type ON kpm_customer_owners (customer_id, owner_type, del_flag, owner_user_id);
CREATE INDEX IF NOT EXISTS idx_kpm_customer_owners_user ON kpm_customer_owners (owner_user_id, del_flag, customer_id);
CREATE INDEX IF NOT EXISTS idx_kpm_customer_contacts_customer ON kpm_customer_contacts (customer_id, del_flag, name);
CREATE INDEX IF NOT EXISTS idx_kpm_customer_contacts_email ON kpm_customer_contacts (lower(email)) WHERE del_flag=0 AND email IS NOT NULL AND email <> '';
CREATE INDEX IF NOT EXISTS idx_kpm_customer_materials_customer ON kpm_customer_materials (customer_id, del_flag, uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_kpm_customer_followups_customer ON kpm_customer_followups (customer_id, del_flag, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_kpm_project_customers_project ON kpm_project_customers (project_id, del_flag, customer_id);
CREATE INDEX IF NOT EXISTS idx_kpm_project_customers_customer ON kpm_project_customers (customer_id, del_flag, project_id);

-- Requirements and tasks
CREATE INDEX IF NOT EXISTS idx_kpm_requirements_project_customer ON kpm_requirements (project_id, customer_id, del_flag, created_date DESC);
CREATE INDEX IF NOT EXISTS idx_kpm_requirements_project_title ON kpm_requirements (project_id, del_flag, title);
CREATE INDEX IF NOT EXISTS idx_kpm_requirements_task ON kpm_requirements (task_id, del_flag);
CREATE INDEX IF NOT EXISTS idx_kpm_tasks_list ON kpm_tasks (del_flag, created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_kpm_tasks_status_category_time ON kpm_tasks (status, category, del_flag, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_kpm_tasks_project_time ON kpm_tasks (project_id, del_flag, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_kpm_tasks_stage_time ON kpm_tasks (stage_id, del_flag, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_kpm_tasks_customer_time ON kpm_tasks (customer_id, del_flag, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_kpm_tasks_creator_time ON kpm_tasks (creator_user_id, del_flag, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_kpm_task_assignees_task ON kpm_task_assignees (task_id, del_flag, assignee_name);
CREATE INDEX IF NOT EXISTS idx_kpm_task_assignees_user ON kpm_task_assignees (user_id, del_flag, task_id);
CREATE INDEX IF NOT EXISTS idx_kpm_task_participants_task ON kpm_task_participants (task_id, del_flag, participant_name);
CREATE INDEX IF NOT EXISTS idx_kpm_task_participants_user ON kpm_task_participants (user_id, del_flag, task_id);
CREATE INDEX IF NOT EXISTS idx_kpm_task_attachments_task ON kpm_task_attachments (task_id, del_flag, uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_kpm_task_comments_task ON kpm_task_comments (task_id, del_flag, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_kpm_task_comments_external ON kpm_task_comments (task_id, comment_type, del_flag, created_at DESC, id DESC);

-- Orders and notifications
CREATE INDEX IF NOT EXISTS idx_kpm_orders_list_date ON kpm_orders (del_flag, order_date DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_kpm_orders_customer_date ON kpm_orders (customer_id, del_flag, order_date DESC);
CREATE INDEX IF NOT EXISTS idx_kpm_orders_project_date ON kpm_orders (project_id, del_flag, order_date DESC);
CREATE INDEX IF NOT EXISTS idx_kpm_orders_type_status ON kpm_orders (order_type, status, del_flag);
CREATE INDEX IF NOT EXISTS idx_kpm_orders_expected_ship ON kpm_orders (expected_ship_date, del_flag);
CREATE INDEX IF NOT EXISTS idx_kpm_order_histories_order ON kpm_order_histories (order_id, del_flag, modified_at DESC);
CREATE INDEX IF NOT EXISTS idx_kpm_notification_events_pending ON kpm_notification_events (status, del_flag, created_at);
CREATE INDEX IF NOT EXISTS idx_kpm_internal_messages_recipient_time ON kpm_internal_messages (recipient_user_id, del_flag, read_flag, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_kpm_internal_messages_cleanup ON kpm_internal_messages (read_flag, del_flag, read_at);

-- Customer portal
CREATE INDEX IF NOT EXISTS idx_kpm_customer_portal_messages_customer ON kpm_customer_portal_messages (customer_id, del_flag, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_kpm_customer_portal_messages_task ON kpm_customer_portal_messages (task_id, del_flag, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_kpm_customer_portal_messages_announcement ON kpm_customer_portal_messages (announcement_id, del_flag, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_kpm_customer_email_outbox_status_time ON kpm_customer_email_outbox (status, del_flag, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_kpm_customer_portal_messages_contact_time ON kpm_customer_portal_messages (lower(contact_email), del_flag, created_at DESC);

-- Knowledge base management and customer portal visibility.

CREATE TABLE IF NOT EXISTS kpm_knowledge_articles (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  symptom TEXT NOT NULL,
  root_cause TEXT NOT NULL,
  solution TEXT,
  workaround TEXT,
  attachments JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT '待审核',
  author_user_id BIGINT REFERENCES kpm_users(id) ON DELETE SET NULL,
  author_name TEXT,
  published_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  creator TEXT,
  updator TEXT,
  create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  del_flag SMALLINT NOT NULL DEFAULT 0,
  CONSTRAINT chk_kpm_knowledge_solution CHECK (
    nullif(btrim(coalesce(solution, '')), '') IS NOT NULL
    OR nullif(btrim(coalesce(workaround, '')), '') IS NOT NULL
  )
);

CREATE TABLE IF NOT EXISTS kpm_knowledge_article_projects (
  id BIGINT PRIMARY KEY,
  article_id BIGINT NOT NULL REFERENCES kpm_knowledge_articles(id) ON DELETE CASCADE,
  project_id BIGINT REFERENCES kpm_projects(id) ON DELETE CASCADE,
  project_scope TEXT NOT NULL DEFAULT 'PROJECT',
  creator TEXT,
  updator TEXT,
  create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  del_flag SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS kpm_knowledge_article_customers (
  id BIGINT PRIMARY KEY,
  article_id BIGINT NOT NULL REFERENCES kpm_knowledge_articles(id) ON DELETE CASCADE,
  customer_id BIGINT REFERENCES kpm_customers(id) ON DELETE CASCADE,
  customer_scope TEXT NOT NULL DEFAULT 'CUSTOMER',
  creator TEXT,
  updator TEXT,
  create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  del_flag SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS kpm_knowledge_article_tasks (
  id BIGINT PRIMARY KEY,
  article_id BIGINT NOT NULL REFERENCES kpm_knowledge_articles(id) ON DELETE CASCADE,
  task_id BIGINT NOT NULL REFERENCES kpm_tasks(id) ON DELETE CASCADE,
  creator TEXT,
  updator TEXT,
  create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  del_flag SMALLINT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_kpm_knowledge_articles_page
  ON kpm_knowledge_articles (del_flag, status, updated_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_kpm_knowledge_projects_article
  ON kpm_knowledge_article_projects (article_id, del_flag);
CREATE INDEX IF NOT EXISTS idx_kpm_knowledge_projects_project
  ON kpm_knowledge_article_projects (project_id, del_flag);
CREATE INDEX IF NOT EXISTS idx_kpm_knowledge_customers_article
  ON kpm_knowledge_article_customers (article_id, del_flag);
CREATE INDEX IF NOT EXISTS idx_kpm_knowledge_customers_customer
  ON kpm_knowledge_article_customers (customer_id, customer_scope, del_flag);
CREATE INDEX IF NOT EXISTS idx_kpm_knowledge_tasks_article
  ON kpm_knowledge_article_tasks (article_id, del_flag);
CREATE INDEX IF NOT EXISTS idx_kpm_knowledge_tasks_task
  ON kpm_knowledge_article_tasks (task_id, del_flag);

INSERT INTO kpm_permissions (code, name, permission_type, target, location)
VALUES
  ('menu:knowledge','知识库管理','menu','知识库管理','左侧菜单'),
  ('button:knowledge:create','知识库 / 新增文章','button','新增文章','知识库管理'),
  ('button:knowledge:edit','知识库 / 编辑文章','button','编辑文章','知识库管理'),
  ('button:knowledge:delete','知识库 / 删除文章','button','删除文章','知识库管理'),
  ('button:knowledge:review','知识库 / 审核发布','button','审核发布','知识库管理')
ON CONFLICT (code) DO UPDATE
SET name=EXCLUDED.name,
    permission_type=EXCLUDED.permission_type,
    target=EXCLUDED.target,
    location=EXCLUDED.location,
    del_flag=0,
    update_time=current_timestamp;

INSERT INTO kpm_role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM kpm_roles r
JOIN kpm_permissions p ON p.code IN (
  'menu:knowledge',
  'button:knowledge:create',
  'button:knowledge:edit',
  'button:knowledge:delete',
  'button:knowledge:review'
) AND p.del_flag=0
WHERE r.del_flag=0 AND (r.name IN ('CTO','KPMT CTO') OR r.id=2001)
ON CONFLICT DO NOTHING;

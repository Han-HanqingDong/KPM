-- Project material retract/delete, announcement status/history, and comment pagination indexes.

ALTER TABLE kpm_project_announcements
  ADD COLUMN IF NOT EXISTS announcement_status TEXT NOT NULL DEFAULT '已发布',
  ADD COLUMN IF NOT EXISTS retracted_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS retracted_by TEXT;

DO $$
BEGIN
  EXECUTE format('ALTER DATABASE %I SET timezone TO %L', current_database(), 'Asia/Shanghai');
EXCEPTION WHEN insufficient_privilege THEN
  RAISE NOTICE 'Skip database timezone change because current user has insufficient privilege.';
END $$;

DO $$
BEGIN
  EXECUTE format('ALTER ROLE %I SET timezone TO %L', current_user, 'Asia/Shanghai');
EXCEPTION WHEN insufficient_privilege THEN
  RAISE NOTICE 'Skip role timezone change because current user has insufficient privilege.';
END $$;

UPDATE kpm_project_announcements
SET announcement_status='已发布'
WHERE announcement_status IS NULL OR announcement_status='';

CREATE INDEX IF NOT EXISTS idx_kpm_project_announcements_active_portal
  ON kpm_project_announcements (project_id, announcement_status, del_flag, published_at DESC);

CREATE INDEX IF NOT EXISTS idx_kpm_task_comments_page
  ON kpm_task_comments (task_id, del_flag, created_at DESC, id DESC);

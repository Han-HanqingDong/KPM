-- Customer portal and public project material support.

ALTER TABLE kpm_project_materials
  ADD COLUMN IF NOT EXISTS public_visible BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS public_at TIMESTAMP;

-- Customer portal OTP codes are stored in Redis/Valkey, not in PostgreSQL.
DROP TABLE IF EXISTS kpm_customer_portal_otps;

INSERT INTO kpm_permissions (id, code, name, permission_type, target, location)
VALUES
  (3095,'button:project-materials:upload','项目详情 / 上传项目资料','按钮权限','上传项目资料','项目详情'),
  (3096,'button:project-materials:publish-customer','项目详情 / 公开项目资料','按钮权限','公开项目资料','项目详情')
ON CONFLICT (code) DO UPDATE SET
  name=excluded.name,
  permission_type=excluded.permission_type,
  target=excluded.target,
  location=excluded.location,
  del_flag=0,
  update_time=current_timestamp;

INSERT INTO kpm_role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM kpm_roles r
JOIN kpm_permissions p ON p.code IN ('button:project-materials:upload','button:project-materials:publish-customer') AND p.del_flag=0
WHERE r.del_flag=0
  AND r.name IN ('CTO', '系统管理员')
ON CONFLICT DO NOTHING;

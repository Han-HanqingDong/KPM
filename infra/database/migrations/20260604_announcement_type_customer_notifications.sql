-- Announcement type support and customer-level portal notification sending.

ALTER TABLE kpm_project_announcements
  ADD COLUMN IF NOT EXISTS announcement_type TEXT NOT NULL DEFAULT '普通公告';

INSERT INTO kpm_enum_items (id, enum_type, name, value, semantic, active, sort_order) VALUES
  (5060,'project_announcement_type','普通公告','普通公告','DEFAULT',true,10),
  (5061,'project_announcement_type','产品 EOL 公告','产品EOL公告','EOL',true,20)
ON CONFLICT (enum_type, value) DO UPDATE SET
  name=excluded.name,
  semantic=excluded.semantic,
  active=excluded.active,
  sort_order=excluded.sort_order,
  del_flag=0,
  update_time=current_timestamp;

INSERT INTO kpm_permissions (id, code, name, permission_type, target, location)
VALUES (3098,'button:customer-detail:send-notification','客户详情 / 发送通知','按钮权限','发送通知','客户详情')
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
JOIN kpm_permissions p ON p.code='button:customer-detail:send-notification' AND p.del_flag=0
WHERE r.name IN ('CTO','销售','技术支持') AND r.del_flag=0
ON CONFLICT DO NOTHING;

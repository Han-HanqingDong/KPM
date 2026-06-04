-- Keep gateway RBAC permission catalog aligned with backend routes.

INSERT INTO kpm_permissions (id, code, name, permission_type, target, location)
VALUES (3094, 'button:project-detail:edit-members', '项目详情 / 维护成员', '按钮权限', '维护成员', '项目详情')
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
JOIN kpm_permissions p ON p.code='button:project-detail:edit-members' AND p.del_flag=0
WHERE r.del_flag=0
  AND r.name IN ('CTO', '系统管理员')
ON CONFLICT DO NOTHING;

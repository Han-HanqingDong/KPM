package com.kozen.kpm.resource.mapper;

import com.kozen.kpm.common.mapper.JdbcMapMapper;
import com.kozen.kpm.resource.dto.DepartmentRequest;
import com.kozen.kpm.resource.dto.EnumItemRequest;
import com.kozen.kpm.resource.dto.RoleRequest;
import com.kozen.kpm.resource.dto.UserRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Resource management data access mapper. Owns SQL for users, departments, roles, permissions and enums.
 */
@Repository
public class ResourceMapper extends JdbcMapMapper {
    public ResourceMapper(JdbcTemplate jdbc) {
        super(jdbc);
    }

    public List<Map<String, Object>> users() {
        return rows("select id, account, email, name, status, created_at from kpm_users order by name");
    }

    public Map<String, Object> user(String id) {
        return row("select id, account, email, name, status, created_at from kpm_users where id=?", id);
    }

    public List<String> userDepartments(String userId) {
        return column("select d.name from kpm_departments d join kpm_user_departments ud on ud.department_id=d.id where ud.user_id=? order by d.name", String.class, userId);
    }

    public List<String> userRoles(String userId) {
        return column("select r.name from kpm_roles r join kpm_user_roles ur on ur.role_id=r.id where ur.user_id=? order by r.name", String.class, userId);
    }

    public List<String> userDirectPermissions(String userId) {
        return column("select p.code from kpm_permissions p join kpm_user_permissions up on up.permission_id=p.id where up.user_id=? order by p.code", String.class, userId);
    }

    public void insertUser(String id, UserRequest request) {
        update("insert into kpm_users (id, account, email, name, password_hash, status) values (?, ?, ?, ?, '{noop}123456', ?)",
                id, request.loginAccount(), request.normalizedEmail(), request.name(), request.normalizedStatus());
    }

    public void resetUserPassword(String id, String passwordHash) {
        update("update kpm_users set password_hash=? where id=?", passwordHash, id);
    }

    public void updateUser(String id, UserRequest request) {
        update("update kpm_users set account=?, email=?, name=?, status=?, updated_at=current_timestamp, update_time=current_timestamp where id=?",
                request.loginAccount(), request.normalizedEmail(), request.name(), request.normalizedStatus(), id);
    }

    public void deleteUser(String id) {
        update("delete from kpm_users where id=?", id);
    }

    public void deleteUserDepartments(String userId) {
        update("delete from kpm_user_departments where user_id=?", userId);
    }

    public void deleteUserRoles(String userId) {
        update("delete from kpm_user_roles where user_id=?", userId);
    }

    public void deleteUserPermissions(String userId) {
        update("delete from kpm_user_permissions where user_id=?", userId);
    }

    public List<String> departmentIdsByName(Object name) {
        return column("select id from kpm_departments where name=?", String.class, name);
    }

    public List<String> roleIdsByName(Object name) {
        return column("select id from kpm_roles where name=?", String.class, name);
    }

    public void insertUserDepartment(String userId, String departmentId) {
        update("insert into kpm_user_departments (user_id, department_id) values (?, ?)", userId, departmentId);
    }

    public void insertUserRole(String userId, String roleId) {
        update("insert into kpm_user_roles (user_id, role_id) values (?, ?)", userId, roleId);
    }

    public void insertUserPermission(String userId, String permissionId) {
        update("insert into kpm_user_permissions (user_id, permission_id) values (?, ?)", userId, permissionId);
    }

    public List<Map<String, Object>> departments() {
        return rows("""
                select d.id, d.name, d.status, count(ud.user_id) as user_count
                from kpm_departments d
                left join kpm_user_departments ud on ud.department_id = d.id
                group by d.id, d.name, d.status
                order by d.name
                """);
    }

    public Map<String, Object> department(String id) {
        return row("select * from kpm_departments where id=?", id);
    }

    public void insertDepartment(String id, DepartmentRequest request) {
        update("insert into kpm_departments (id, name, status) values (?, ?, ?)", id, request.name(), request.normalizedStatus());
    }

    public void updateDepartment(String id, DepartmentRequest request) {
        update("update kpm_departments set name=?, status=?, update_time=current_timestamp where id=?", request.name(), request.normalizedStatus(), id);
    }

    public void deleteDepartment(String id) {
        update("delete from kpm_departments where id=?", id);
    }

    public List<Map<String, Object>> roles() {
        return rows("select id, name, role_type, status from kpm_roles order by name");
    }

    public Map<String, Object> role(String id) {
        return row("select * from kpm_roles where id=?", id);
    }

    public List<String> rolePermissions(String roleId) {
        return column("""
                select p.code from kpm_permissions p join kpm_role_permissions rp on rp.permission_id = p.id
                where rp.role_id = ? order by p.code
                """, String.class, roleId);
    }

    public void insertRole(String id, RoleRequest request) {
        update("insert into kpm_roles (id, name, role_type, status) values (?, ?, ?, ?)", id, request.name(), request.normalizedRoleType(), request.normalizedStatus());
    }

    public void updateRole(String id, RoleRequest request) {
        update("update kpm_roles set name=?, role_type=?, status=?, update_time=current_timestamp where id=?", request.name(), request.normalizedRoleType(), request.normalizedStatus(), id);
    }

    public void deleteRole(String id) {
        update("delete from kpm_roles where id=?", id);
    }

    public void deleteRolePermissions(String roleId) {
        update("delete from kpm_role_permissions where role_id=?", roleId);
    }

    public List<String> permissionIdsByCode(Object code) {
        return column("select id from kpm_permissions where code=?", String.class, code);
    }

    public void insertRolePermission(String roleId, String permissionId) {
        update("insert into kpm_role_permissions (role_id, permission_id) values (?, ?)", roleId, permissionId);
    }

    public List<Map<String, Object>> permissions() {
        return rows("select id, code, name, permission_type, target, location from kpm_permissions order by permission_type desc, location, name");
    }

    public List<Map<String, Object>> enumItems() {
        return rows("select id, enum_type, name, value, semantic, active, sort_order from kpm_enum_items order by enum_type, sort_order");
    }

    public List<Map<String, Object>> taskStatusTransitions() {
        return rows("select id, from_status, to_status from kpm_task_status_transitions order by id");
    }

    public Map<String, Object> taskStatusTransition(String id) {
        return row("select id, from_status, to_status from kpm_task_status_transitions where id=?", id);
    }

    public List<String> taskStatusTransitionIdsByPair(Object fromStatus, Object toStatus) {
        return column("select id from kpm_task_status_transitions where from_status=? and to_status=?", String.class, fromStatus, toStatus);
    }

    public void insertTaskStatusTransition(String id, Object fromStatus, Object toStatus) {
        update("insert into kpm_task_status_transitions (id, from_status, to_status) values (?, ?, ?)", id, fromStatus, toStatus);
    }

    public void deleteTaskStatusTransition(String id) {
        update("delete from kpm_task_status_transitions where id=?", id);
    }

    public Map<String, Object> enumItem(String id) {
        return row("select * from kpm_enum_items where id=?", id);
    }

    public void insertEnum(String id, EnumItemRequest request) {
        update("insert into kpm_enum_items (id, enum_type, name, value, semantic, active, sort_order) values (?, ?, ?, ?, ?, ?, ?)",
                id, request.enumType(), request.name(), request.normalizedValue(), request.semantic(), request.normalizedActive(), request.normalizedSortOrder());
    }

    public void updateEnum(String id, EnumItemRequest request) {
        update("update kpm_enum_items set name=?, value=?, semantic=?, active=?, sort_order=?, update_time=current_timestamp where id=?",
                request.name(), request.normalizedValue(), request.semantic(), request.normalizedActive(), request.normalizedSortOrder(), id);
    }

    public void deleteEnum(String id) {
        update("delete from kpm_enum_items where id=?", id);
    }

    public List<String> prototypeSnapshots() {
        return column("select state::text from kpm_prototype_snapshots where id='default'", String.class);
    }

    public void upsertPrototypeSnapshot(String json, String updatedBy) {
        update("""
                insert into kpm_prototype_snapshots (id, state, updated_by, updated_at)
                values ('default', cast(? as jsonb), ?, current_timestamp)
                on conflict (id) do update set state=excluded.state, updated_by=excluded.updated_by, updated_at=current_timestamp
                """, json, updatedBy);
    }
}

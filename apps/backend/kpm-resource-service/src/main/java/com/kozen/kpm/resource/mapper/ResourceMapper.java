package com.kozen.kpm.resource.mapper;

import com.kozen.kpm.resource.dto.DepartmentRequest;
import com.kozen.kpm.resource.dto.EnumItemRequest;
import com.kozen.kpm.resource.dto.RoleRequest;
import com.kozen.kpm.resource.dto.UserRequest;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;
import java.util.Map;

/** Resource management data access mapper backed by MyBatis. */
@Mapper
public interface ResourceMapper {
    @Select("select id, account, email, name, status, created_at from kpm_users where del_flag=0 order by name")
    List<Map<String, Object>> users();

    @Select("select id, account, email, name, status, created_at from kpm_users where id=#{id} and del_flag=0")
    Map<String, Object> user(@Param("id") String id);

    @Select("select d.name from kpm_departments d join kpm_user_departments ud on ud.department_id=d.id where ud.user_id=#{userId} and d.del_flag=0 order by d.name")
    List<String> userDepartments(@Param("userId") String userId);

    @Select("select r.name from kpm_roles r join kpm_user_roles ur on ur.role_id=r.id where ur.user_id=#{userId} and r.del_flag=0 order by r.name")
    List<String> userRoles(@Param("userId") String userId);

    @Select("select p.code from kpm_permissions p join kpm_user_permissions up on up.permission_id=p.id where up.user_id=#{userId} order by p.code")
    List<String> userDirectPermissions(@Param("userId") String userId);

    default void insertUser(String id, UserRequest request) {
        insertUserRow(id, request.loginAccount(), request.normalizedEmail(), request.name(), request.normalizedStatus());
    }

    @Insert("insert into kpm_users (id, account, email, name, password_hash, status) values (#{id}, #{account}, #{email}, #{name}, '{noop}123456', #{status})")
    void insertUserRow(@Param("id") String id, @Param("account") String account, @Param("email") String email, @Param("name") String name, @Param("status") String status);

    @Update("update kpm_users set password_hash=#{passwordHash}, update_time=current_timestamp where id=#{id} and del_flag=0")
    void resetUserPassword(@Param("id") String id, @Param("passwordHash") String passwordHash);

    default void updateUser(String id, UserRequest request) {
        updateUserRow(id, request.loginAccount(), request.normalizedEmail(), request.name(), request.normalizedStatus());
    }

    @Update("update kpm_users set account=#{account}, email=#{email}, name=#{name}, status=#{status}, update_time=current_timestamp where id=#{id} and del_flag=0")
    void updateUserRow(@Param("id") String id, @Param("account") String account, @Param("email") String email, @Param("name") String name, @Param("status") String status);

    @Update("update kpm_users set del_flag=1, status='停用', update_time=current_timestamp where id=#{id}")
    void deleteUser(@Param("id") String id);

    @Delete("delete from kpm_user_departments where user_id=#{userId}")
    void deleteUserDepartments(@Param("userId") String userId);

    @Delete("delete from kpm_user_roles where user_id=#{userId}")
    void deleteUserRoles(@Param("userId") String userId);

    @Delete("delete from kpm_user_permissions where user_id=#{userId}")
    void deleteUserPermissions(@Param("userId") String userId);

    @Select("select id from kpm_departments where name=#{name} and del_flag=0")
    List<String> departmentIdsByName(@Param("name") Object name);

    @Select("select id from kpm_roles where name=#{name} and del_flag=0")
    List<String> roleIdsByName(@Param("name") Object name);

    @Insert("insert into kpm_user_departments (user_id, department_id) values (#{userId}, #{departmentId})")
    void insertUserDepartment(@Param("userId") String userId, @Param("departmentId") String departmentId);

    @Insert("insert into kpm_user_roles (user_id, role_id) values (#{userId}, #{roleId})")
    void insertUserRole(@Param("userId") String userId, @Param("roleId") String roleId);

    @Insert("insert into kpm_user_permissions (user_id, permission_id) values (#{userId}, #{permissionId})")
    void insertUserPermission(@Param("userId") String userId, @Param("permissionId") String permissionId);

    @Select("""
            select d.id, d.name, d.status, count(u.id) as user_count
            from kpm_departments d
            left join kpm_user_departments ud on ud.department_id = d.id
            left join kpm_users u on u.id = ud.user_id and u.del_flag=0
            where d.del_flag=0
            group by d.id, d.name, d.status
            order by d.name
            """)
    List<Map<String, Object>> departments();

    @Select("select * from kpm_departments where id=#{id} and del_flag=0")
    Map<String, Object> department(@Param("id") String id);

    default void insertDepartment(String id, DepartmentRequest request) {
        insertDepartmentRow(id, request.name(), request.normalizedStatus());
    }

    @Insert("insert into kpm_departments (id, name, status) values (#{id}, #{name}, #{status})")
    void insertDepartmentRow(@Param("id") String id, @Param("name") String name, @Param("status") String status);

    default void updateDepartment(String id, DepartmentRequest request) {
        updateDepartmentRow(id, request.name(), request.normalizedStatus());
    }

    @Update("update kpm_departments set name=#{name}, status=#{status}, update_time=current_timestamp where id=#{id} and del_flag=0")
    void updateDepartmentRow(@Param("id") String id, @Param("name") String name, @Param("status") String status);

    @Update("update kpm_departments set del_flag=1, status='停用', update_time=current_timestamp where id=#{id}")
    void deleteDepartment(@Param("id") String id);

    @Select("select id, name, role_type, status from kpm_roles where del_flag=0 order by name")
    List<Map<String, Object>> roles();

    @Select("select * from kpm_roles where id=#{id} and del_flag=0")
    Map<String, Object> role(@Param("id") String id);

    @Select("""
            select p.code from kpm_permissions p join kpm_role_permissions rp on rp.permission_id = p.id
            where rp.role_id = #{roleId} order by p.code
            """)
    List<String> rolePermissions(@Param("roleId") String roleId);

    default void insertRole(String id, RoleRequest request) {
        insertRoleRow(id, request.name(), request.normalizedRoleType(), request.normalizedStatus());
    }

    @Insert("insert into kpm_roles (id, name, role_type, status) values (#{id}, #{name}, #{roleType}, #{status})")
    void insertRoleRow(@Param("id") String id, @Param("name") String name, @Param("roleType") String roleType, @Param("status") String status);

    default void updateRole(String id, RoleRequest request) {
        updateRoleRow(id, request.name(), request.normalizedRoleType(), request.normalizedStatus());
    }

    @Update("update kpm_roles set name=#{name}, role_type=#{roleType}, status=#{status}, update_time=current_timestamp where id=#{id} and del_flag=0")
    void updateRoleRow(@Param("id") String id, @Param("name") String name, @Param("roleType") String roleType, @Param("status") String status);

    @Update("update kpm_roles set del_flag=1, status='停用', update_time=current_timestamp where id=#{id}")
    void deleteRole(@Param("id") String id);

    @Delete("delete from kpm_role_permissions where role_id=#{roleId}")
    void deleteRolePermissions(@Param("roleId") String roleId);

    @Select("select id from kpm_permissions where code=#{code} and del_flag=0")
    List<String> permissionIdsByCode(@Param("code") Object code);

    @Insert("insert into kpm_role_permissions (role_id, permission_id) values (#{roleId}, #{permissionId})")
    void insertRolePermission(@Param("roleId") String roleId, @Param("permissionId") String permissionId);

    @Select("select id, code, name, permission_type, target, location from kpm_permissions where del_flag=0 order by permission_type desc, location, name")
    List<Map<String, Object>> permissions();

    @Select("select id, enum_type, name, value, semantic, active, sort_order from kpm_enum_items where del_flag=0 order by enum_type, sort_order")
    List<Map<String, Object>> enumItems();

    @Select("select id, from_status, to_status from kpm_task_status_transitions where del_flag=0 order by id")
    List<Map<String, Object>> taskStatusTransitions();

    @Select("select id, from_status, to_status from kpm_task_status_transitions where id=#{id} and del_flag=0")
    Map<String, Object> taskStatusTransition(@Param("id") String id);

    @Select("select id from kpm_task_status_transitions where from_status=#{fromStatus} and to_status=#{toStatus} and del_flag=0")
    List<String> taskStatusTransitionIdsByPair(@Param("fromStatus") Object fromStatus, @Param("toStatus") Object toStatus);

    @Insert("insert into kpm_task_status_transitions (id, from_status, to_status) values (#{id}, #{fromStatus}, #{toStatus})")
    void insertTaskStatusTransition(@Param("id") String id, @Param("fromStatus") Object fromStatus, @Param("toStatus") Object toStatus);

    @Update("update kpm_task_status_transitions set del_flag=1, update_time=current_timestamp where id=#{id}")
    void deleteTaskStatusTransition(@Param("id") String id);

    @Select("select * from kpm_enum_items where id=#{id} and del_flag=0")
    Map<String, Object> enumItem(@Param("id") String id);

    default void insertEnum(String id, EnumItemRequest request) {
        insertEnumRow(id, request.enumType(), request.name(), request.normalizedValue(), request.semantic(), request.normalizedActive(), request.normalizedSortOrder());
    }

    @Insert("insert into kpm_enum_items (id, enum_type, name, value, semantic, active, sort_order) values (#{id}, #{enumType}, #{name}, #{value}, #{semantic}, #{active}, #{sortOrder})")
    void insertEnumRow(@Param("id") String id, @Param("enumType") String enumType, @Param("name") String name, @Param("value") String value, @Param("semantic") String semantic, @Param("active") Boolean active, @Param("sortOrder") Integer sortOrder);

    default void updateEnum(String id, EnumItemRequest request) {
        updateEnumRow(id, request.name(), request.normalizedValue(), request.semantic(), request.normalizedActive(), request.normalizedSortOrder());
    }

    @Update("update kpm_enum_items set name=#{name}, value=#{value}, semantic=#{semantic}, active=#{active}, sort_order=#{sortOrder}, update_time=current_timestamp where id=#{id} and del_flag=0")
    void updateEnumRow(@Param("id") String id, @Param("name") String name, @Param("value") String value, @Param("semantic") String semantic, @Param("active") Boolean active, @Param("sortOrder") Integer sortOrder);

    @Update("update kpm_enum_items set del_flag=1, active=false, update_time=current_timestamp where id=#{id}")
    void deleteEnum(@Param("id") String id);

    @Select("select state::text from kpm_prototype_snapshots where id='default'")
    List<String> prototypeSnapshots();

    @Insert("""
            insert into kpm_prototype_snapshots (id, state, updated_by, updated_at)
            values ('default', cast(#{json} as jsonb), #{updatedBy}, current_timestamp)
            on conflict (id) do update set state=excluded.state, updated_by=excluded.updated_by, updated_at=current_timestamp
            """)
    void upsertPrototypeSnapshot(@Param("json") String json, @Param("updatedBy") String updatedBy);
}

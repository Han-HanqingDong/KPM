package com.kozen.kpm.resource.mapper;

import com.kozen.kpm.resource.dto.DepartmentRequest;
import com.kozen.kpm.resource.dto.EnumItemRequest;
import com.kozen.kpm.resource.dto.RoleRequest;
import com.kozen.kpm.resource.dto.UserRequest;
import com.kozen.kpm.resource.entity.DepartmentEntity;
import com.kozen.kpm.resource.entity.EnumItemEntity;
import com.kozen.kpm.resource.entity.PermissionEntity;
import com.kozen.kpm.resource.entity.RoleEntity;
import com.kozen.kpm.resource.entity.TaskStatusTransitionEntity;
import com.kozen.kpm.resource.entity.UserResourceEntity;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

/** Resource management data access mapper backed by MyBatis. */
@Mapper
public interface ResourceMapper {
    @Select("select id, account, email, name, status, created_at as createdAt from kpm_users where del_flag=0 order by name")
    List<UserResourceEntity> users();

    @Select("select id, account, email, name, status, created_at as createdAt from kpm_users where id=#{id} and del_flag=0")
    UserResourceEntity user(@Param("id") String id);

    @Select("""
            select d.name
            from kpm_departments d
            join kpm_user_departments ud on ud.department_id=d.id and ud.del_flag=0
            where ud.user_id=#{userId}
              and d.del_flag=0
            order by d.name
            """)
    List<String> userDepartments(@Param("userId") String userId);

    @Select("""
            select r.name
            from kpm_roles r
            join kpm_user_roles ur on ur.role_id=r.id and ur.del_flag=0
            where ur.user_id=#{userId}
              and r.del_flag=0
            order by r.name
            """)
    List<String> userRoles(@Param("userId") String userId);

    @Select("""
            select p.code
            from kpm_permissions p
            join kpm_user_permissions up on up.permission_id=p.id and up.del_flag=0
            where up.user_id=#{userId}
              and p.del_flag=0
            order by p.code
            """)
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

    @Update("update kpm_users set del_flag=1, status='停用', update_time=current_timestamp where id=#{id} and del_flag=0")
    void deleteUser(@Param("id") String id);

    @Update("update kpm_user_departments set del_flag=1, update_time=current_timestamp where user_id=#{userId} and del_flag=0")
    void deleteUserDepartments(@Param("userId") String userId);

    @Update("update kpm_user_roles set del_flag=1, update_time=current_timestamp where user_id=#{userId} and del_flag=0")
    void deleteUserRoles(@Param("userId") String userId);

    @Update("update kpm_user_permissions set del_flag=1, update_time=current_timestamp where user_id=#{userId} and del_flag=0")
    void deleteUserPermissions(@Param("userId") String userId);

    @Select("select id from kpm_departments where name=#{name} and del_flag=0")
    List<String> departmentIdsByName(@Param("name") Object name);

    @Select("select id from kpm_roles where name=#{name} and del_flag=0")
    List<String> roleIdsByName(@Param("name") Object name);

    @Insert("""
            insert into kpm_user_departments (user_id, department_id)
            values (#{userId}, #{departmentId})
            on conflict (user_id, department_id) do update
            set del_flag=0, update_time=current_timestamp
            """)
    void insertUserDepartment(@Param("userId") String userId, @Param("departmentId") String departmentId);

    @Insert("""
            insert into kpm_user_roles (user_id, role_id)
            values (#{userId}, #{roleId})
            on conflict (user_id, role_id) do update
            set del_flag=0, update_time=current_timestamp
            """)
    void insertUserRole(@Param("userId") String userId, @Param("roleId") String roleId);

    @Insert("""
            insert into kpm_user_permissions (user_id, permission_id)
            values (#{userId}, #{permissionId})
            on conflict (user_id, permission_id) do update
            set del_flag=0, update_time=current_timestamp
            """)
    void insertUserPermission(@Param("userId") String userId, @Param("permissionId") String permissionId);

    @Select("""
            select d.id, d.name, d.status, count(u.id) as userCount
            from kpm_departments d
            left join kpm_user_departments ud on ud.department_id = d.id and ud.del_flag=0
            left join kpm_users u on u.id = ud.user_id and u.del_flag=0
            where d.del_flag=0
            group by d.id, d.name, d.status
            order by d.name
            """)
    List<DepartmentEntity> departments();

    @Select("select id, name, status, 0 as userCount from kpm_departments where id=#{id} and del_flag=0")
    DepartmentEntity department(@Param("id") String id);

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

    @Update("update kpm_departments set del_flag=1, status='停用', update_time=current_timestamp where id=#{id} and del_flag=0")
    void deleteDepartment(@Param("id") String id);

    @Select("select id, name, role_type as roleType, status from kpm_roles where del_flag=0 order by name")
    List<RoleEntity> roles();

    @Select("select id, name, role_type as roleType, status from kpm_roles where id=#{id} and del_flag=0")
    RoleEntity role(@Param("id") String id);

    @Select("""
            select p.code
            from kpm_permissions p
            join kpm_role_permissions rp on rp.permission_id = p.id and rp.del_flag=0
            where rp.role_id = #{roleId}
              and p.del_flag=0
            order by p.code
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

    @Update("update kpm_roles set del_flag=1, status='停用', update_time=current_timestamp where id=#{id} and del_flag=0")
    void deleteRole(@Param("id") String id);

    @Update("update kpm_role_permissions set del_flag=1, update_time=current_timestamp where role_id=#{roleId} and del_flag=0")
    void deleteRolePermissions(@Param("roleId") String roleId);

    @Select("select id from kpm_permissions where code=#{code} and del_flag=0")
    List<String> permissionIdsByCode(@Param("code") Object code);

    @Insert("""
            insert into kpm_role_permissions (role_id, permission_id)
            values (#{roleId}, #{permissionId})
            on conflict (role_id, permission_id) do update
            set del_flag=0, update_time=current_timestamp
            """)
    void insertRolePermission(@Param("roleId") String roleId, @Param("permissionId") String permissionId);

    @Select("""
            select id, code, name, permission_type as permissionType, target, location
            from kpm_permissions
            where del_flag=0
            order by permission_type desc, location, name
            """)
    List<PermissionEntity> permissions();

    @Select("""
            select id,
                   enum_type as enumType,
                   name,
                   value,
                   label_zh as labelZh,
                   label_en as labelEn,
                   short_label_zh as shortLabelZh,
                   short_label_en as shortLabelEn,
                   semantic,
                   active,
                   sort_order as sortOrder
            from kpm_enum_items
            where del_flag=0
            order by enum_type, sort_order
            """)
    List<EnumItemEntity> enumItems();

    @Select("select id, from_status as fromStatus, to_status as toStatus from kpm_task_status_transitions where del_flag=0 order by id")
    List<TaskStatusTransitionEntity> taskStatusTransitions();

    @Select("select id, from_status as fromStatus, to_status as toStatus from kpm_task_status_transitions where id=#{id} and del_flag=0")
    TaskStatusTransitionEntity taskStatusTransition(@Param("id") String id);

    @Select("select id from kpm_task_status_transitions where from_status=#{fromStatus} and to_status=#{toStatus} and del_flag=0")
    List<String> taskStatusTransitionIdsByPair(@Param("fromStatus") Object fromStatus, @Param("toStatus") Object toStatus);

    @Insert("insert into kpm_task_status_transitions (id, from_status, to_status) values (#{id}, #{fromStatus}, #{toStatus})")
    void insertTaskStatusTransition(@Param("id") String id, @Param("fromStatus") Object fromStatus, @Param("toStatus") Object toStatus);

    @Update("update kpm_task_status_transitions set del_flag=1, update_time=current_timestamp where id=#{id} and del_flag=0")
    void deleteTaskStatusTransition(@Param("id") String id);

    @Select("""
            select id,
                   enum_type as enumType,
                   name,
                   value,
                   label_zh as labelZh,
                   label_en as labelEn,
                   short_label_zh as shortLabelZh,
                   short_label_en as shortLabelEn,
                   semantic,
                   active,
                   sort_order as sortOrder
            from kpm_enum_items
            where id=#{id} and del_flag=0
            """)
    EnumItemEntity enumItem(@Param("id") String id);

    default void insertEnum(String id, EnumItemRequest request) {
        insertEnumRow(id, request.enumType(), request.name(), request.normalizedValue(), request.normalizedLabelZh(), request.normalizedLabelEn(), request.normalizedShortLabelZh(), request.normalizedShortLabelEn(), request.semantic(), request.normalizedActive(), request.normalizedSortOrder());
    }

    @Insert("""
            insert into kpm_enum_items
            (id, enum_type, name, value, label_zh, label_en, short_label_zh, short_label_en, semantic, active, sort_order)
            values
            (#{id}, #{enumType}, #{name}, #{value}, #{labelZh}, #{labelEn}, #{shortLabelZh}, #{shortLabelEn}, #{semantic}, #{active}, #{sortOrder})
            """)
    void insertEnumRow(@Param("id") String id, @Param("enumType") String enumType, @Param("name") String name, @Param("value") String value, @Param("labelZh") String labelZh, @Param("labelEn") String labelEn, @Param("shortLabelZh") String shortLabelZh, @Param("shortLabelEn") String shortLabelEn, @Param("semantic") String semantic, @Param("active") Boolean active, @Param("sortOrder") Integer sortOrder);

    default void updateEnum(String id, EnumItemRequest request) {
        updateEnumRow(id, request.name(), request.normalizedValue(), request.normalizedLabelZh(), request.normalizedLabelEn(), request.normalizedShortLabelZh(), request.normalizedShortLabelEn(), request.semantic(), request.normalizedActive(), request.normalizedSortOrder());
    }

    @Update("""
            update kpm_enum_items
            set name=#{name},
                value=#{value},
                label_zh=#{labelZh},
                label_en=#{labelEn},
                short_label_zh=#{shortLabelZh},
                short_label_en=#{shortLabelEn},
                semantic=#{semantic},
                active=#{active},
                sort_order=#{sortOrder},
                update_time=current_timestamp
            where id=#{id} and del_flag=0
            """)
    void updateEnumRow(@Param("id") String id, @Param("name") String name, @Param("value") String value, @Param("labelZh") String labelZh, @Param("labelEn") String labelEn, @Param("shortLabelZh") String shortLabelZh, @Param("shortLabelEn") String shortLabelEn, @Param("semantic") String semantic, @Param("active") Boolean active, @Param("sortOrder") Integer sortOrder);

    @Update("update kpm_enum_items set del_flag=1, active=false, update_time=current_timestamp where id=#{id} and del_flag=0")
    void deleteEnum(@Param("id") String id);

}

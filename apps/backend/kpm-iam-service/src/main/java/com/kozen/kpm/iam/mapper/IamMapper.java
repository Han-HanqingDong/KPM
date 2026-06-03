package com.kozen.kpm.iam.mapper;

import com.kozen.kpm.iam.entity.UserAccountEntity;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

/** IAM data access mapper backed by MyBatis. */
@Mapper
public interface IamMapper {
    @Select("""
            select id, account, email, name, password_hash, status
            from kpm_users
            where (account = #{account} or email = #{account})
              and del_flag = 0
            """)
    List<UserAccountEntity> findUserForLogin(@Param("account") String account);

    @Select("""
            select id, account, email, name, status
            from kpm_users
            where (account = #{account} or email = #{account})
              and del_flag = 0
            """)
    List<UserAccountEntity> findUser(@Param("account") String account);

    @Update("update kpm_users set password_hash = #{passwordHash}, update_time = current_timestamp where id = #{userId} and del_flag = 0")
    void updatePassword(@Param("userId") String userId, @Param("passwordHash") String passwordHash);

    @Select("""
            select d.name from kpm_departments d
            join kpm_user_departments ud on ud.department_id = d.id
            where ud.user_id = #{userId}
              and d.del_flag = 0
              and ud.del_flag = 0
            order by d.name
            """)
    List<String> departments(@Param("userId") String userId);

    @Select("""
            select r.name from kpm_roles r
            join kpm_user_roles ur on ur.role_id = r.id
            where ur.user_id = #{userId}
              and r.del_flag = 0
              and ur.del_flag = 0
            order by r.name
            """)
    List<String> roles(@Param("userId") String userId);

    @Select("""
            select distinct p.code from kpm_permissions p
            left join kpm_user_permissions up on up.permission_id = p.id and up.user_id = #{userId}
            left join kpm_role_permissions rp on rp.permission_id = p.id
            left join kpm_user_roles ur on ur.role_id = rp.role_id and ur.user_id = #{userId}
            where p.del_flag = 0
              and (up.del_flag = 0 or up.del_flag is null)
              and (rp.del_flag = 0 or rp.del_flag is null)
              and (ur.del_flag = 0 or ur.del_flag is null)
              and (up.user_id is not null or ur.user_id is not null)
            order by p.code
            """)
    List<String> permissions(@Param("userId") String userId);
}

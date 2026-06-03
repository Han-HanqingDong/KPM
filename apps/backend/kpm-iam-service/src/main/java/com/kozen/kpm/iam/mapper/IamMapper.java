package com.kozen.kpm.iam.mapper;

import com.kozen.kpm.common.mapper.JdbcMapMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/** IAM data access mapper. */
@Repository
public class IamMapper extends JdbcMapMapper {
    public IamMapper(JdbcTemplate jdbc) { super(jdbc); }

    public List<Map<String, Object>> findUserForLogin(String account) {
        return rows("select id, account, email, name, password_hash, status from kpm_users where account = ? or email = ?", account, account);
    }

    public List<Map<String, Object>> findUser(String account) {
        return rows("select id, account, email, name, status from kpm_users where account = ? or email = ?", account, account);
    }

    public void updatePassword(String userId, String passwordHash) {
        update("update kpm_users set password_hash = ? where id = ?", passwordHash, userId);
    }

    public List<String> departments(String userId) {
        return column("""
                select d.name from kpm_departments d
                join kpm_user_departments ud on ud.department_id = d.id
                where ud.user_id = ? order by d.name
                """, String.class, userId);
    }

    public List<String> roles(String userId) {
        return column("""
                select r.name from kpm_roles r
                join kpm_user_roles ur on ur.role_id = r.id
                where ur.user_id = ? order by r.name
                """, String.class, userId);
    }

    public List<String> permissions(String userId) {
        return column("""
                select distinct p.code from kpm_permissions p
                left join kpm_user_permissions up on up.permission_id = p.id and up.user_id = ?
                left join kpm_role_permissions rp on rp.permission_id = p.id
                left join kpm_user_roles ur on ur.role_id = rp.role_id and ur.user_id = ?
                where up.user_id is not null or ur.user_id is not null
                order by p.code
                """, String.class, userId, userId);
    }
}

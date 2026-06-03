package com.kozen.kpm.notification.mapper;

import com.kozen.kpm.common.mapper.JdbcMapMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class NotificationMapper extends JdbcMapMapper {
    public NotificationMapper(JdbcTemplate jdbc) { super(jdbc); }

    public List<Map<String, Object>> pendingEvents(int limit) {
        return rows("""
                select * from kpm_notification_events
                where status='PENDING'
                order by created_at
                limit ?
                """, limit);
    }

    public void insertMessage(String id, String recipientUserId, Object title, Object content, Object messageType) {
        update("""
                insert into kpm_internal_messages (id, recipient_user_id, title, content, message_type)
                values (?, ?, ?, ?, ?)
                on conflict (id) do nothing
                """, id, recipientUserId, title, content, messageType);
    }

    public void markEventProcessed(String id) {
        update("update kpm_notification_events set status='PROCESSED', processed_at=current_timestamp where id=?", id);
    }

    public List<Map<String, Object>> messages(String userId, boolean unreadOnly) {
        return rows("""
                select id, title, content, message_type, read_flag, created_at, read_at
                from kpm_internal_messages
                where recipient_user_id=? and (? = false or read_flag=false)
                order by created_at desc
                limit 50
                """, userId, unreadOnly);
    }

    public Integer unreadCount(String userId) {
        return jdbc.queryForObject("select count(*) from kpm_internal_messages where recipient_user_id=? and read_flag=false", Integer.class, userId);
    }

    public int markRead(String id, String userId) {
        return update("update kpm_internal_messages set read_flag=true, read_at=current_timestamp where id=? and recipient_user_id=?", id, userId);
    }

    public int markAllRead(String userId) {
        return update("update kpm_internal_messages set read_flag=true, read_at=current_timestamp where recipient_user_id=? and read_flag=false", userId);
    }

    public List<Map<String, Object>> userByAccount(String account) {
        return rows("select id, account, email, name from kpm_users where account=?", account);
    }

    public Map<String, Object> userById(String userId) {
        return row("select id, account, email, name from kpm_users where id=?", userId);
    }
}

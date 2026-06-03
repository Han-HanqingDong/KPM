package com.kozen.kpm.notification.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;
import java.util.Map;

/** Notification data access mapper backed by MyBatis. */
@Mapper
public interface NotificationMapper {
    @Select("""
            select * from kpm_notification_events
            where status='PENDING'
            order by created_at
            limit #{limit}
            """)
    List<Map<String, Object>> pendingEvents(@Param("limit") int limit);

    @Insert("""
            insert into kpm_internal_messages (id, recipient_user_id, title, content, message_type)
            values (#{id}, #{recipientUserId}, #{title}, #{content}, #{messageType})
            on conflict (id) do nothing
            """)
    void insertMessage(@Param("id") String id, @Param("recipientUserId") String recipientUserId, @Param("title") Object title, @Param("content") Object content, @Param("messageType") Object messageType);

    @Update("update kpm_notification_events set status='PROCESSED', processed_at=current_timestamp where id=#{id}")
    void markEventProcessed(@Param("id") String id);

    @Select("""
            select id, title, content, message_type, read_flag, created_at, read_at
            from kpm_internal_messages
            where recipient_user_id=#{userId} and del_flag=0 and (#{unreadOnly} = false or read_flag=false)
            order by created_at desc
            limit 50
            """)
    List<Map<String, Object>> messages(@Param("userId") String userId, @Param("unreadOnly") boolean unreadOnly);

    @Select("select count(*) from kpm_internal_messages where recipient_user_id=#{userId} and del_flag=0 and read_flag=false")
    Integer unreadCount(@Param("userId") String userId);

    @Update("update kpm_internal_messages set read_flag=true, read_at=current_timestamp where id=#{id} and recipient_user_id=#{userId}")
    int markRead(@Param("id") String id, @Param("userId") String userId);

    @Update("update kpm_internal_messages set read_flag=true, read_at=current_timestamp where recipient_user_id=#{userId} and read_flag=false")
    int markAllRead(@Param("userId") String userId);

    @Update("""
            update kpm_internal_messages
            set del_flag=1, update_time=current_timestamp
            where del_flag=0 and read_flag=true and read_at < current_timestamp - interval '15 days'
            """)
    int cleanupExpiredReadMessages();

    @Select("select id, account, email, name from kpm_users where account=#{account} or email=#{account}")
    List<Map<String, Object>> userByAccount(@Param("account") String account);

    @Select("select id, account, email, name from kpm_users where id=#{userId}")
    Map<String, Object> userById(@Param("userId") String userId);
}

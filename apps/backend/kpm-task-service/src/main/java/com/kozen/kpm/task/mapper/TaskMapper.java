package com.kozen.kpm.task.mapper;

import com.kozen.kpm.common.util.JsonUtil;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;
import java.util.Map;

/** Task data access mapper backed by MyBatis. */
@Mapper
public interface TaskMapper {
    @Select("select id, account, email, name from kpm_users where account=#{value} or email=#{value} or name=#{value}")
    List<Map<String, Object>> usersByAccountOrName(@Param("value") Object value);

    @Select("""
            select semantic from kpm_enum_items
            where enum_type=#{enumType} and value=#{value} and active=true
            limit 1
            """)
    String enumSemantic(@Param("enumType") String enumType, @Param("value") String value);

    @Select("""
            select value from kpm_enum_items
            where enum_type=#{enumType} and semantic=#{semantic} and active=true
            order by sort_order, id
            limit 1
            """)
    String enumValueBySemantic(@Param("enumType") String enumType, @Param("semantic") String semantic);

    @Select("""
            select t.*, p.external_name as project_name, s.stage_name, c.name as customer_name
            from kpm_tasks t
            left join kpm_projects p on p.id = t.project_id
            left join kpm_project_stages s on s.id = t.stage_id
            left join kpm_customers c on c.id = t.customer_id
            where t.del_flag=0
              and (#{like} = '' or t.title ilike #{like} or t.description ilike #{like})
              and (#{status} = '' or t.status = #{status})
              and (#{category} = '' or t.category = #{category})
            order by t.updated_at desc, t.created_at desc
            """)
    List<Map<String, Object>> list(@Param("like") String like, @Param("status") String status, @Param("category") String category);

    @Select("""
            select t.*, p.external_name as project_name, s.stage_name, c.name as customer_name
            from kpm_tasks t
            left join kpm_projects p on p.id = t.project_id
            left join kpm_project_stages s on s.id = t.stage_id
            left join kpm_customers c on c.id = t.customer_id
            where t.id = #{id} and t.del_flag=0
            """)
    Map<String, Object> load(@Param("id") String id);

    @Insert("""
            insert into kpm_tasks (id, title, description, project_id, stage_id, category, status, priority, creator_user_id, creator, expected_completion_at, due_date, source, customer_id, blocked)
            values (#{id}, #{body.title}, #{body.description}, #{projectId}, #{stageId}, #{body.category}, #{body.status}, #{body.priority}, #{creatorUserId}, #{creatorName}, cast(#{body.expectedCompletionAt} as date), cast(#{body.dueDate} as date), #{body.source}, #{customerId}, #{body.blocked})
            """)
    void insert(@Param("id") String id, @Param("body") Map<String, Object> body, @Param("projectId") String projectId, @Param("stageId") String stageId, @Param("customerId") String customerId, @Param("creatorUserId") String creatorUserId, @Param("creatorName") String creatorName);

    @Update("""
            update kpm_tasks set title=#{body.title}, description=#{body.description}, project_id=#{projectId}, stage_id=#{stageId}, category=#{body.category}, status=#{body.status}, priority=#{body.priority}, expected_completion_at=cast(#{body.expectedCompletionAt} as date), due_date=cast(#{body.dueDate} as date), customer_id=#{customerId}, blocked=#{body.blocked}, updated_at=current_timestamp
            where id=#{id} and del_flag=0
            """)
    void updateTask(@Param("id") String id, @Param("body") Map<String, Object> body, @Param("projectId") String projectId, @Param("stageId") String stageId, @Param("customerId") String customerId);

    @Update("update kpm_tasks set del_flag=1, updated_at=current_timestamp, update_time=current_timestamp where id=#{id}")
    void deleteById(@Param("id") String id);

    @Select("""
            select coalesce(u.name, ta.assignee_name)
            from kpm_task_assignees ta
            left join kpm_users u on u.id = ta.user_id or (ta.user_id is null and u.name = ta.assignee_name)
            where ta.task_id=#{id} and ta.del_flag=0 order by coalesce(u.name, ta.assignee_name)
            """)
    List<String> assignees(@Param("id") String id);

    @Select("""
            select coalesce(u.name, tp.participant_name)
            from kpm_task_participants tp
            left join kpm_users u on u.id = tp.user_id or (tp.user_id is null and u.name = tp.participant_name)
            where tp.task_id=#{id} and tp.del_flag=0 order by coalesce(u.name, tp.participant_name)
            """)
    List<String> participants(@Param("id") String id);

    @Select("select * from kpm_task_attachments where task_id=#{id} and del_flag=0 order by uploaded_at desc")
    List<Map<String, Object>> attachments(@Param("id") String id);

    @Select("select * from kpm_task_comments where task_id=#{id} and del_flag=0 order by created_at desc")
    List<Map<String, Object>> comments(@Param("id") String id);

    @Delete("delete from kpm_task_assignees where task_id=#{id}")
    void deleteAssignees(@Param("id") String id);

    @Insert("insert into kpm_task_assignees (task_id, user_id, assignee_name) values (#{id}, #{userId}, #{name})")
    void insertAssignee(@Param("id") String id, @Param("userId") String userId, @Param("name") Object name);

    @Delete("delete from kpm_task_participants where task_id=#{id}")
    void deleteParticipants(@Param("id") String id);

    @Insert("insert into kpm_task_participants (task_id, user_id, participant_name) values (#{id}, #{userId}, #{name})")
    void insertParticipant(@Param("id") String id, @Param("userId") String userId, @Param("name") Object name);

    @Update("update kpm_requirements set status=#{requirementStatus} where task_id=#{taskId}")
    void syncRequirement(@Param("taskId") String taskId, @Param("requirementStatus") String requirementStatus);

    @Select("select coalesce(max(cast(regexp_replace(id, '[^0-9]', '', 'g') as int)), 100) from kpm_tasks where id like 'KPM-%' and del_flag=0")
    Integer maxTaskNumber();

    default void insertComment(String commentId, String taskId, Object author, Object content, Object attachments) {
        insertCommentRow(commentId, taskId, author, content, JsonUtil.toJson(attachments == null ? List.of() : attachments));
    }

    @Insert("insert into kpm_task_comments (id, task_id, author, content, attachments) values (#{commentId}, #{taskId}, #{author}, #{content}, cast(#{attachmentsJson} as jsonb))")
    void insertCommentRow(@Param("commentId") String commentId, @Param("taskId") String taskId, @Param("author") Object author, @Param("content") Object content, @Param("attachmentsJson") String attachmentsJson);

    @Insert("""
            insert into kpm_notification_events (id, event_type, aggregate_type, aggregate_id, title, content, recipient_user_ids, status)
            values (#{id}, #{eventType}, 'task', #{aggregateId}, #{title}, #{content}, cast(#{recipientUserIdsJson} as jsonb), 'PENDING')
            """)
    void insertNotificationEvent(@Param("id") String id, @Param("eventType") String eventType, @Param("aggregateId") String aggregateId, @Param("title") String title, @Param("content") String content, @Param("recipientUserIdsJson") String recipientUserIdsJson);

    @Insert("""
            insert into kpm_task_attachments
            (id, task_id, file_name, file_type, file_size, uploader, bucket, object_key, storage_url, storage_category)
            values (#{attachmentId}, #{taskId}, #{body.fileName}, #{body.fileType}, #{body.fileSize}, #{body.uploader}, #{body.bucket}, #{body.objectKey}, #{body.storageUrl}, #{body.category})
            """)
    void insertAttachment(@Param("attachmentId") String attachmentId, @Param("taskId") String taskId, @Param("body") Map<String, Object> body);
}

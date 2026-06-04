package com.kozen.kpm.task.mapper;

import com.kozen.kpm.common.dto.FileMetadataRequest;
import com.kozen.kpm.common.util.JsonUtil;
import com.kozen.kpm.task.dto.TaskWriteCommand;
import com.kozen.kpm.task.entity.TaskAttachmentEntity;
import com.kozen.kpm.task.entity.TaskCommentEntity;
import com.kozen.kpm.task.entity.TaskEntity;
import com.kozen.kpm.task.entity.UserLookupEntity;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

/** Task data access mapper backed by MyBatis. */
@Mapper
public interface TaskMapper {
    @Select("""
            select id, account, email, name
            from kpm_users
            where del_flag=0
              and (account=#{value} or email=#{value} or name=#{value})
            """)
    List<UserLookupEntity> usersByAccountOrName(@Param("value") Object value);

    @Select("""
            select semantic from kpm_enum_items
            where enum_type=#{enumType} and value=#{value} and active=true and del_flag=0
            limit 1
            """)
    String enumSemantic(@Param("enumType") String enumType, @Param("value") String value);

    @Select("""
            select value from kpm_enum_items
            where enum_type=#{enumType} and semantic=#{semantic} and active=true and del_flag=0
            order by sort_order, id
            limit 1
            """)
    String enumValueBySemantic(@Param("enumType") String enumType, @Param("semantic") String semantic);

    @Select("""
            select t.id,
                   t.task_no as taskNo,
                   t.title,
                   t.description,
                   t.project_id as projectId,
                   t.stage_id as stageId,
                   t.customer_id as customerId,
                   p.external_name as projectName,
                   s.stage_name as stageName,
                   c.name as customerName,
                   t.category,
                   t.status,
                   t.priority,
                   t.creator_user_id as creatorUserId,
                   t.creator,
                   t.expected_completion_at as expectedCompletionAt,
                   t.due_date as dueDate,
                   t.source,
                   t.blocked,
                   t.created_at as createdAt,
                   t.updated_at as updatedAt
            from kpm_tasks t
            left join kpm_projects p on p.id = t.project_id and p.del_flag=0
            left join kpm_project_stages s on s.id = t.stage_id and s.del_flag=0
            left join kpm_customers c on c.id = t.customer_id and c.del_flag=0
            where t.del_flag=0
              and (#{like} = '' or t.title ilike #{like} or t.description ilike #{like})
              and (#{status} = '' or t.status = #{status})
              and (#{category} = '' or t.category = #{category})
            order by t.created_at desc, t.id desc
            """)
    List<TaskEntity> list(@Param("like") String like, @Param("status") String status, @Param("category") String category);

    @Select("""
            select t.id,
                   t.task_no as taskNo,
                   t.title,
                   t.description,
                   t.project_id as projectId,
                   t.stage_id as stageId,
                   t.customer_id as customerId,
                   p.external_name as projectName,
                   s.stage_name as stageName,
                   c.name as customerName,
                   t.category,
                   t.status,
                   t.priority,
                   t.creator_user_id as creatorUserId,
                   t.creator,
                   t.expected_completion_at as expectedCompletionAt,
                   t.due_date as dueDate,
                   t.source,
                   t.blocked,
                   t.created_at as createdAt,
                   t.updated_at as updatedAt
            from kpm_tasks t
            left join kpm_projects p on p.id = t.project_id and p.del_flag=0
            left join kpm_project_stages s on s.id = t.stage_id and s.del_flag=0
            left join kpm_customers c on c.id = t.customer_id and c.del_flag=0
            where t.id = #{id} and t.del_flag=0
            """)
    TaskEntity load(@Param("id") String id);

    @Insert("""
            insert into kpm_tasks
            (id, task_no, title, description, project_id, stage_id, category, status, priority, creator_user_id, creator, expected_completion_at, due_date, source, customer_id, blocked)
            values
            (#{body.id}, #{body.taskNo}, #{body.title}, #{body.description}, #{body.projectId}, #{body.stageId}, #{body.category}, #{body.status}, #{body.priority}, #{body.creatorUserId}, #{body.creatorName}, cast(#{body.expectedCompletionAt} as date), cast(#{body.dueDate} as date), #{body.source}, #{body.customerId}, #{body.blocked})
            """)
    void insert(@Param("body") TaskWriteCommand body);

    @Update("""
            update kpm_tasks
            set title=#{body.title},
                description=#{body.description},
                project_id=#{body.projectId},
                stage_id=#{body.stageId},
                category=#{body.category},
                status=#{body.status},
                priority=#{body.priority},
                expected_completion_at=cast(#{body.expectedCompletionAt} as date),
                due_date=cast(#{body.dueDate} as date),
                customer_id=#{body.customerId},
                blocked=#{body.blocked},
                updated_at=current_timestamp,
                update_time=current_timestamp
            where id=#{body.id} and del_flag=0
            """)
    void updateTask(@Param("body") TaskWriteCommand body);

    @Update("update kpm_tasks set del_flag=1, updated_at=current_timestamp, update_time=current_timestamp where id=#{id} and del_flag=0")
    void deleteById(@Param("id") String id);

    @Select("""
            select coalesce(u.name, ta.assignee_name)
            from kpm_task_assignees ta
            left join kpm_users u on u.id = ta.user_id and u.del_flag=0
            where ta.task_id=#{id} and ta.del_flag=0
            order by coalesce(u.name, ta.assignee_name)
            """)
    List<String> assignees(@Param("id") String id);

    @Select("""
            select coalesce(u.name, tp.participant_name)
            from kpm_task_participants tp
            left join kpm_users u on u.id = tp.user_id and u.del_flag=0
            where tp.task_id=#{id} and tp.del_flag=0
            order by coalesce(u.name, tp.participant_name)
            """)
    List<String> participants(@Param("id") String id);

    @Select("""
            select id,
                   task_id as taskId,
                   file_name as fileName,
                   file_type as fileType,
                   file_size as fileSize,
                   uploader,
                   bucket,
                   object_key as objectKey,
                   storage_url as storageUrl,
                   storage_category as storageCategory,
                   uploaded_at as uploadedAt
            from kpm_task_attachments
            where task_id=#{id} and del_flag=0
            order by uploaded_at desc
            """)
    List<TaskAttachmentEntity> attachments(@Param("id") String id);

    @Select("""
            select id,
                   task_id as taskId,
                   author,
                   content,
                   attachments::text as attachments,
                   created_at as createdAt
            from kpm_task_comments
            where task_id=#{id} and del_flag=0
            order by created_at desc
            """)
    List<TaskCommentEntity> comments(@Param("id") String id);

    @Update("update kpm_task_assignees set del_flag=1, update_time=current_timestamp where task_id=#{id} and del_flag=0")
    void deleteAssignees(@Param("id") String id);

    @Insert("""
            insert into kpm_task_assignees (task_id, user_id, assignee_name)
            values (#{id}, #{userId}, #{name})
            on conflict (task_id, assignee_name) do update
            set user_id=excluded.user_id, del_flag=0, update_time=current_timestamp
            """)
    void insertAssignee(@Param("id") String id, @Param("userId") String userId, @Param("name") Object name);

    @Update("update kpm_task_participants set del_flag=1, update_time=current_timestamp where task_id=#{id} and del_flag=0")
    void deleteParticipants(@Param("id") String id);

    @Insert("""
            insert into kpm_task_participants (task_id, user_id, participant_name)
            values (#{id}, #{userId}, #{name})
            on conflict (task_id, participant_name) do update
            set user_id=excluded.user_id, del_flag=0, update_time=current_timestamp
            """)
    void insertParticipant(@Param("id") String id, @Param("userId") String userId, @Param("name") Object name);

    @Update("update kpm_requirements set status=#{requirementStatus}, update_time=current_timestamp where task_id=#{taskId} and del_flag=0")
    void syncRequirement(@Param("taskId") String taskId, @Param("requirementStatus") String requirementStatus);

    @Select("select nextval('kpm_task_no_seq')")
    Long nextTaskNumber();

    @Select("select short_name from kpm_customers where id=#{customerId} and del_flag=0")
    String customerShortName(@Param("customerId") String customerId);

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
            values (#{attachmentId}, #{taskId}, #{body.fileName}, #{body.fileType}, #{body.fileSize}, #{body.uploader}, #{body.bucket}, #{body.objectKey}, #{body.storageUrl}, coalesce(#{body.storageCategory}, #{body.category}))
            """)
    void insertAttachment(@Param("attachmentId") String attachmentId, @Param("taskId") String taskId, @Param("body") FileMetadataRequest body);

    @Update("update kpm_task_attachments set del_flag=1, update_time=current_timestamp where task_id=#{taskId} and id=#{attachmentId} and del_flag=0")
    void deleteAttachment(@Param("taskId") String taskId, @Param("attachmentId") String attachmentId);
}


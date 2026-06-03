package com.kozen.kpm.task.mapper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kozen.kpm.common.mapper.JdbcMapMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/** Task data access mapper. */
@Repository
public class TaskMapper extends JdbcMapMapper {
    private final ObjectMapper objectMapper = new ObjectMapper();

    public TaskMapper(JdbcTemplate jdbc) { super(jdbc); }

    public List<Map<String, Object>> usersByAccountOrName(Object value) {
        return rows("select id, account, email, name from kpm_users where account=? or email=? or name=?", value, value, value);
    }

    public List<Map<String, Object>> list(String like, String status, String category) { return rows("""
            select t.*, p.external_name as project_name, s.stage_name, c.name as customer_name
            from kpm_tasks t
            left join kpm_projects p on p.id = t.project_id
            left join kpm_project_stages s on s.id = t.stage_id
            left join kpm_customers c on c.id = t.customer_id
            where (? = '' or t.title ilike ? or t.description ilike ?)
              and (? = '' or t.status = ?)
              and (? = '' or t.category = ?)
            order by t.updated_at desc, t.created_at desc
            """, like, like, like, status, status, category, category); }

    public Map<String, Object> load(String id) { return row("""
            select t.*, p.external_name as project_name, s.stage_name, c.name as customer_name
            from kpm_tasks t
            left join kpm_projects p on p.id = t.project_id
            left join kpm_project_stages s on s.id = t.stage_id
            left join kpm_customers c on c.id = t.customer_id
            where t.id = ?
            """, id); }

    public void insert(String id, Map<String, Object> body, String projectId, String stageId, String customerId, String creatorUserId, String creatorName) { update("""
            insert into kpm_tasks (id, title, description, project_id, stage_id, category, status, priority, creator_user_id, creator, expected_completion_at, due_date, source, customer_id, blocked)
            values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, cast(? as date), cast(? as date), ?, ?, ?)
            """, id, body.get("title"), body.get("description"), projectId, stageId, body.getOrDefault("category", "其他"), body.getOrDefault("status", "待处理"), body.getOrDefault("priority", "中"), creatorUserId, creatorName, body.get("expectedCompletionAt"), body.get("dueDate"), body.getOrDefault("source", "任务管理"), customerId, body.getOrDefault("blocked", false)); }

    public void updateTask(String id, Map<String, Object> body, String projectId, String stageId, String customerId) { update("""
            update kpm_tasks set title=?, description=?, project_id=?, stage_id=?, category=?, status=?, priority=?, expected_completion_at=cast(? as date), due_date=cast(? as date), customer_id=?, blocked=?, updated_at=current_timestamp
            where id=?
            """, body.get("title"), body.get("description"), projectId, stageId, body.getOrDefault("category", "其他"), body.getOrDefault("status", "待处理"), body.getOrDefault("priority", "中"), body.get("expectedCompletionAt"), body.get("dueDate"), customerId, body.getOrDefault("blocked", false), id); }

    public void deleteById(String id) { update("delete from kpm_tasks where id=?", id); }
    public List<String> assignees(String id) { return column("""
            select coalesce(u.name, ta.assignee_name)
            from kpm_task_assignees ta
            left join kpm_users u on u.id = ta.user_id or (ta.user_id is null and u.name = ta.assignee_name)
            where ta.task_id=? order by coalesce(u.name, ta.assignee_name)
            """, String.class, id); }
    public List<String> participants(String id) { return column("""
            select coalesce(u.name, tp.participant_name)
            from kpm_task_participants tp
            left join kpm_users u on u.id = tp.user_id or (tp.user_id is null and u.name = tp.participant_name)
            where tp.task_id=? order by coalesce(u.name, tp.participant_name)
            """, String.class, id); }
    public List<Map<String, Object>> attachments(String id) { return rows("select * from kpm_task_attachments where task_id=? order by uploaded_at desc", id); }
    public List<Map<String, Object>> comments(String id) { return rows("select * from kpm_task_comments where task_id=? order by created_at desc", id); }
    public void deleteAssignees(String id) { update("delete from kpm_task_assignees where task_id=?", id); }
    public void insertAssignee(String id, String userId, Object name) { update("insert into kpm_task_assignees (task_id, user_id, assignee_name) values (?, ?, ?)", id, userId, name); }
    public void deleteParticipants(String id) { update("delete from kpm_task_participants where task_id=?", id); }
    public void insertParticipant(String id, String userId, Object name) { update("insert into kpm_task_participants (task_id, user_id, participant_name) values (?, ?, ?)", id, userId, name); }
    public void syncRequirement(String taskId, String requirementStatus) { update("update kpm_requirements set status=? where task_id=?", requirementStatus, taskId); }
    public Integer maxTaskNumber() { return jdbc.queryForObject("select coalesce(max(cast(regexp_replace(id, '[^0-9]', '', 'g') as int)), 100) from kpm_tasks where id like 'KPM-%'", Integer.class); }
    public void insertComment(String commentId, String taskId, Object author, Object content, Object attachments) {
        update("insert into kpm_task_comments (id, task_id, author, content, attachments) values (?, ?, ?, ?, cast(? as jsonb))",
                commentId, taskId, author, content, json(attachments));
    }

    public void insertNotificationEvent(String id, String eventType, String aggregateId, String title, String content, String recipientUserIdsJson) {
        update("""
                insert into kpm_notification_events (id, event_type, aggregate_type, aggregate_id, title, content, recipient_user_ids, status)
                values (?, ?, 'task', ?, ?, ?, cast(? as jsonb), 'PENDING')
                """, id, eventType, aggregateId, title, content, recipientUserIdsJson);
    }

    public void insertAttachment(String attachmentId, String taskId, Map<String, Object> body) {
        update("""
                insert into kpm_task_attachments
                (id, task_id, file_name, file_type, file_size, uploader, bucket, object_key, storage_url, storage_category)
                values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                attachmentId, taskId, body.get("fileName"), body.getOrDefault("fileType", "文件"),
                body.getOrDefault("fileSize", "-"), body.getOrDefault("uploader", "张敏"),
                body.get("bucket"), body.get("objectKey"), body.get("storageUrl"), body.get("category"));
    }

    private String json(Object value) {
        Object safeValue = value == null ? List.of() : value;
        try {
            return objectMapper.writeValueAsString(safeValue);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Invalid JSON payload", e);
        }
    }
}

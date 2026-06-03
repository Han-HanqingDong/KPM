package com.kozen.kpm.project.mapper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kozen.kpm.common.mapper.JdbcMapMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Project data access mapper. Project SQL is centralized here so controller and
 * service code can stay focused on API orchestration and business rules.
 */
@Repository
public class ProjectMapper extends JdbcMapMapper {
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ProjectMapper(JdbcTemplate jdbc) {
        super(jdbc);
    }

    public List<Map<String, Object>> list(String keyword, String salesability, Boolean archived) {
        StringBuilder sql = new StringBuilder("select * from kpm_projects where 1=1");
        List<Object> args = new ArrayList<>();
        if (keyword != null && !keyword.isBlank()) {
            sql.append(" and (external_name ilike ? or internal_name ilike ? or model_name ilike ?)");
            String like = "%" + keyword + "%";
            args.add(like);
            args.add(like);
            args.add(like);
        }
        if (salesability != null && !salesability.isBlank() && !salesability.startsWith("全部")) {
            sql.append(" and salesability = ?");
            args.add(salesability);
        }
        if (archived != null) {
            sql.append(" and archived = ?");
            args.add(archived);
        }
        sql.append(" order by created_at desc, external_name");
        return rows(sql.toString(), args.toArray());
    }

    public Map<String, Object> load(String id) {
        return row("select * from kpm_projects where id=?", id);
    }

    public List<String> projectIds(String id) {
        return column("select id from kpm_projects where id=?", String.class, id);
    }

    public void insertProject(String id, Map<String, Object> body, String salesability, Object unsellableReason, String managerUserId, String managerAccount) {
        update("""
                insert into kpm_projects (id, external_name, internal_name, model_name, manager_user_id, manager_account, status, archived, salesability, unsellable_reason, description)
                values (?, ?, ?, ?, ?, ?, '未开始', false, ?, ?, ?)
                """, id, body.get("externalName"), body.get("internalName"), body.get("modelName"), managerUserId, managerAccount, salesability, unsellableReason, body.get("description"));
    }

    public void updateProject(String id, Map<String, Object> body, String salesability, Object unsellableReason, String managerUserId, String managerAccount) {
        update("""
                update kpm_projects
                set external_name=?, internal_name=?, model_name=?, manager_user_id=?, manager_account=?, salesability=?, unsellable_reason=?, description=?, updated_at=current_timestamp
                where id=?
                """, body.get("externalName"), body.get("internalName"), body.get("modelName"), managerUserId, managerAccount, salesability, unsellableReason, body.get("description"), id);
    }

    public void deleteProject(String id) {
        update("delete from kpm_projects where id=?", id);
    }

    public Object managerName(Object account) {
        List<Map<String, Object>> rows = rows("select name from kpm_users where account=? or id=?", account, account);
        return rows.isEmpty() ? null : rows.getFirst().values().iterator().next();
    }

    public List<Map<String, Object>> usersByAccountOrName(Object value) {
        return rows("select id, account, email, name from kpm_users where account=? or email=? or name=?", value, value, value);
    }

    public Map<String, Object> userById(Object id) {
        return row("select id, account, name from kpm_users where id=?", id);
    }

    public List<Map<String, Object>> members(String projectId) {
        return rows("""
                select pm.id, pm.user_id, coalesce(u.account, pm.user_account) as user_account, coalesce(u.name, pm.user_account) as user_name, pm.role_name
                from kpm_project_members pm left join kpm_users u on u.id = pm.user_id or (pm.user_id is null and u.account = pm.user_account)
                where pm.project_id = ? order by pm.role_name, coalesce(u.name, pm.user_account)
                """, projectId);
    }

    public void deleteMembers(String projectId) {
        update("delete from kpm_project_members where project_id=?", projectId);
    }

    public void insertMember(String id, String projectId, String userId, String account, String role) {
        update("insert into kpm_project_members (id, project_id, user_id, user_account, role_name) values (?, ?, ?, ?, ?)", id, projectId, userId, account, role);
    }

    public List<Map<String, Object>> stages(String projectId) {
        return rows("select * from kpm_project_stages where project_id=? order by stage_order", projectId);
    }

    public Map<String, Object> stage(String stageId) {
        return row("select * from kpm_project_stages where id=?", stageId);
    }

    public List<String> stageIdsByName(String projectId, String stageName) {
        return column("select id from kpm_project_stages where project_id=? and stage_name=?", String.class, projectId, stageName);
    }

    public List<String> templateStageNames(String templateId) {
        return column("select stage_name from kpm_template_stages where template_id=? order by sort_order", String.class, templateId);
    }

    public void insertStage(String id, String projectId, String stageName, int order, Object status) {
        update("insert into kpm_project_stages (id, project_id, stage_name, stage_order, status) values (?, ?, ?, ?, ?)", id, projectId, stageName, order, status);
    }

    public void updateStageStatus(String stageId, Object status) {
        update("update kpm_project_stages set status=? where id=?", status, stageId);
    }

    public List<String> stageStatuses(String projectId) {
        return column("select status from kpm_project_stages where project_id=?", String.class, projectId);
    }

    public void updateProjectStatus(String projectId, String status) {
        update("update kpm_projects set status=?, updated_at=current_timestamp where id=?", status, projectId);
    }

    public void archiveProject(String projectId, Object archived) {
        update("update kpm_projects set archived=?, updated_at=current_timestamp where id=?", archived, projectId);
    }

    public List<Map<String, Object>> stageAssignees(Object stageId) {
        return rows("""
                select sa.assignee_type,
                       case when sa.assignee_type='user' then coalesce(u.name, sa.assignee_name) else sa.assignee_name end as assignee_name,
                       case when sa.assignee_type='user' then coalesce(u.account, sa.account) else sa.account end as account,
                       sa.user_id
                from kpm_stage_assignees sa
                left join kpm_users u on u.id = sa.user_id or (sa.user_id is null and u.account = sa.account)
                where sa.stage_id=? order by sa.id
                """, stageId);
    }

    public void deleteStageAssignees(String stageId) {
        update("delete from kpm_stage_assignees where stage_id=?", stageId);
    }

    public void insertStageAssignee(String id, String stageId, String type, String name, String account, String userId) {
        update("insert into kpm_stage_assignees (id, stage_id, assignee_type, assignee_name, account, user_id) values (?, ?, ?, ?, ?, ?)", id, stageId, type, name, account, userId);
    }

    public List<Map<String, Object>> stageMaterials(Object stageId) {
        return rows("select * from kpm_stage_materials where stage_id=? order by uploaded_at desc", stageId);
    }

    public void insertStageMaterial(String id, String stageId, Map<String, Object> body) {
        update("""
                insert into kpm_stage_materials
                (id, stage_id, file_name, file_type, file_size, uploader, bucket, object_key, storage_url, storage_category, published_to_project)
                values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, false)
                """,
                id, stageId, body.get("fileName"), body.getOrDefault("fileType", "文件"),
                body.getOrDefault("fileSize", "-"), body.getOrDefault("uploader", "张敏"),
                body.get("bucket"), body.get("objectKey"), body.get("storageUrl"), body.get("category"));
    }

    public List<Map<String, Object>> stageRecords(Object stageId) {
        return rows("select * from kpm_stage_records where stage_id=? order by created_at desc", stageId);
    }

    public void insertStageRecord(String id, String stageId, Object author, Object content, Object attachments) {
        update("insert into kpm_stage_records (id, stage_id, author, content, attachments) values (?, ?, ?, ?, cast(? as jsonb))",
                id, stageId, author, content, json(attachments));
    }

    public Map<String, Object> stageMaterialForPublish(String materialId) {
        return row("""
                select sm.*, ps.project_id, ps.stage_name
                from kpm_stage_materials sm join kpm_project_stages ps on ps.id = sm.stage_id
                where sm.id=?
                """, materialId);
    }

    public void markStageMaterialPublished(String materialId) {
        update("update kpm_stage_materials set published_to_project=true where id=?", materialId);
    }

    public void insertProjectMaterial(String id, Map<String, Object> material) {
        update("""
                insert into kpm_project_materials
                (id, project_id, source_stage, file_name, file_type, file_size, uploader, bucket, object_key, storage_url, storage_category, share_target)
                values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '项目资料区')
                """,
                id, material.get("projectId"), material.get("stageName"), material.get("fileName"),
                material.get("fileType"), material.get("fileSize"), material.get("uploader"),
                material.get("bucket"), material.get("objectKey"), material.get("storageUrl"), material.get("storageCategory"));
    }

    public List<Map<String, Object>> projectMaterials(String projectId) {
        return rows("select * from kpm_project_materials where project_id=? order by published_at desc", projectId);
    }

    public List<Map<String, Object>> projectCustomers(String projectId) {
        return rows("""
                select pc.id, pc.project_status, c.id as customer_id, c.name as customer_name, c.region, c.level, c.status as customer_status
                from kpm_project_customers pc join kpm_customers c on c.id = pc.customer_id
                where pc.project_id = ? order by c.name
                """, projectId);
    }

    public List<String> projectCustomerIds(String projectId, String customerId) {
        return column("select id from kpm_project_customers where project_id=? and customer_id=?", String.class, projectId, customerId);
    }

    public void insertProjectCustomer(String id, String projectId, String customerId, String projectStatus) {
        update("insert into kpm_project_customers (id, project_id, customer_id, project_status) values (?, ?, ?, ?)", id, projectId, customerId, projectStatus);
    }

    public void updateProjectCustomerStatus(String projectId, String customerId, Object projectStatus) {
        update("update kpm_project_customers set project_status=? where project_id=? and customer_id=?", projectStatus, projectId, customerId);
    }

    public List<Map<String, Object>> requirements(String projectId, Object customerId) {
        return rows("select * from kpm_requirements where project_id=? and customer_id=? order by created_date desc", projectId, customerId);
    }

    public List<Map<String, Object>> requirementOverview(String projectId) {
        return rows("""
                select r.title, count(*) as customer_count, string_agg(c.name, ', ' order by c.name) as customers,
                       max(r.priority) as priority, string_agg(distinct r.status, ', ') as statuses
                from kpm_requirements r join kpm_customers c on c.id = r.customer_id
                where r.project_id = ? group by r.title order by customer_count desc, r.title
                """, projectId);
    }

    public void insertRequirement(String id, String projectId, String customerId, Map<String, Object> body, String taskId) {
        update("""
                insert into kpm_requirements (id, project_id, customer_id, title, user_story, business_value, acceptance, priority, status, proposer, creator, created_date, task_id)
                values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, current_date, ?)
                """, id, projectId, customerId, body.get("title"), body.get("userStory"), body.get("businessValue"), body.get("acceptance"),
                body.getOrDefault("priority", "中"), body.getOrDefault("status", "待评估"), body.get("proposer"), body.getOrDefault("creator", "张敏"), taskId);
    }

    public Map<String, Object> requirement(String id) {
        return row("select * from kpm_requirements where id=?", id);
    }

    public void voidRequirement(String id) {
        update("update kpm_requirements set status='已作废' where id=?", id);
    }

    public void deleteRequirement(String id) {
        update("delete from kpm_requirements where id=?", id);
    }

    public Integer maxRequirementNumber() {
        return jdbc.queryForObject("select coalesce(max(cast(regexp_replace(id, '[^0-9]', '', 'g') as int)), 0) from kpm_requirements where id like 'REQ-%'", Integer.class);
    }

    public void insertRequirementTask(String taskId, String projectId, String customerId, Map<String, Object> body, String creatorUserId, String creatorName) {
        update("""
                insert into kpm_tasks (id, title, description, project_id, category, status, priority, creator_user_id, creator, expected_completion_at, due_date, source, customer_id)
                values (?, ?, ?, ?, '需求', '待处理', ?, ?, ?, cast(? as date), cast(? as date), '需求创建自动生成', ?)
                """, taskId, body.get("title"), body.get("userStory"), projectId, body.getOrDefault("priority", "中"),
                creatorUserId, creatorName, body.get("expectedCompletionAt"), body.get("expectedCompletionAt"), customerId);
    }

    public void insertRequirementTaskAssignee(String taskId, String userId, Object assigneeName) {
        update("insert into kpm_task_assignees (task_id, user_id, assignee_name) values (?, ?, ?)", taskId, userId, assigneeName);
    }

    public Integer maxTaskNumber() {
        return jdbc.queryForObject("select coalesce(max(cast(regexp_replace(id, '[^0-9]', '', 'g') as int)), 100) from kpm_tasks where id like 'KPM-%'", Integer.class);
    }

    public void insertNotificationEvent(String id, String eventType, String aggregateId, String title, String content, String recipientUserIdsJson) {
        update("""
                insert into kpm_notification_events (id, event_type, aggregate_type, aggregate_id, title, content, recipient_user_ids, status)
                values (?, ?, 'project', ?, ?, ?, cast(? as jsonb), 'PENDING')
                """, id, eventType, aggregateId, title, content, recipientUserIdsJson);
    }

    public List<Map<String, Object>> templates() {
        return rows("select * from kpm_process_templates order by updated_at desc, name");
    }

    public Map<String, Object> template(String id) {
        return row("select * from kpm_process_templates where id=?", id);
    }

    public List<String> templateIds(String id) {
        return column("select id from kpm_process_templates where id=?", String.class, id);
    }

    public void insertTemplate(String id, Map<String, Object> body) {
        update("insert into kpm_process_templates (id, name, scope, status, updated_at) values (?, ?, ?, ?, current_date)",
                id, body.get("name"), body.getOrDefault("scope", "通用"), body.getOrDefault("status", "草稿"));
    }

    public void updateTemplate(String id, Map<String, Object> body) {
        update("update kpm_process_templates set name=?, scope=?, status=?, updated_at=current_date where id=?",
                body.get("name"), body.getOrDefault("scope", "通用"), body.getOrDefault("status", "草稿"), id);
    }

    public void deleteTemplate(String id) {
        update("delete from kpm_process_templates where id=?", id);
    }

    public void deleteTemplateStages(String templateId) {
        update("delete from kpm_template_stages where template_id=?", templateId);
    }

    public void insertTemplateStage(String id, String templateId, Object stageName, int sortOrder) {
        update("insert into kpm_template_stages (id, template_id, stage_name, sort_order) values (?, ?, ?, ?)", id, templateId, stageName, sortOrder);
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

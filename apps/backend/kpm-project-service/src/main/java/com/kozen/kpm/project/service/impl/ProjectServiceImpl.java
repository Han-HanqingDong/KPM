package com.kozen.kpm.project.service.impl;

import com.kozen.kpm.common.dto.FileMetadataRequest;
import com.kozen.kpm.common.util.IdUtil;
import com.kozen.kpm.common.util.JsonUtil;
import com.kozen.kpm.common.util.ValidationUtil;
import com.kozen.kpm.project.dto.ArchiveProjectRequest;
import com.kozen.kpm.project.dto.LinkCustomerRequest;
import com.kozen.kpm.project.dto.ProcessTemplateRequest;
import com.kozen.kpm.project.dto.ProjectCustomerStatusRequest;
import com.kozen.kpm.project.dto.ProjectMembersRequest;
import com.kozen.kpm.project.dto.ProjectRequest;
import com.kozen.kpm.project.dto.ProjectSkuRequest;
import com.kozen.kpm.project.dto.RequirementRequest;
import com.kozen.kpm.project.dto.StageRecordRequest;
import com.kozen.kpm.project.dto.StageStatusRequest;
import com.kozen.kpm.project.mapper.ProjectMapper;
import com.kozen.kpm.project.service.ProjectService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Default project service implementation.
 */
@Service
public class ProjectServiceImpl implements ProjectService {
    private static final String DEFAULT_TEMPLATE_ID = "tpl-standard-pos";

    private final ProjectMapper projectMapper;

    public ProjectServiceImpl(ProjectMapper projectMapper) {
        this.projectMapper = projectMapper;
    }

    @Override
    public List<Map<String, Object>> list(String keyword, String salesability, Boolean archived) {
        List<Map<String, Object>> projects = projectMapper.list(keyword, salesability, archived);
        projects.forEach(this::enrichProject);
        return projects;
    }

    @Override
    public Map<String, Object> detail(String id) {
        Map<String, Object> project = projectMapper.load(id);
        enrichProject(project);
        return project;
    }

    @Override
    @Transactional
    public Map<String, Object> create(ProjectRequest request) {
        Map<String, Object> body = request.toMap();
        String id = uniqueProjectId(request.externalName());
        String projectStatus = resolveDefault(body.get("status"), "project_status", "项目状态");
        String salesability = resolveDefault(request.safeSalesability(), "salesability", "可销售状态");
        Object unsellableReason = "可销售".equals(salesability) ? null : request.unsellableReason();
        Map<String, Object> manager = requireUser(request.managerAccount(), "项目负责人");
        projectMapper.insertProject(id, body, projectStatus, salesability, unsellableReason, String.valueOf(manager.get("id")), String.valueOf(manager.get("account")));
        replaceProjectMembers(id, body);
        createProjectStages(id, body);
        syncProjectStatus(id);
        publishProjectCreatedEvent(id, body);
        return detail(id);
    }

    @Override
    @Transactional
    public Map<String, Object> update(String id, ProjectRequest request) {
        Map<String, Object> body = request.toMap();
        String salesability = resolveDefault(request.safeSalesability(), "salesability", "可销售状态");
        Object unsellableReason = "可销售".equals(salesability) ? null : request.unsellableReason();
        Map<String, Object> manager = requireUser(request.managerAccount(), "项目负责人");
        projectMapper.updateProject(id, body, salesability, unsellableReason, String.valueOf(manager.get("id")), String.valueOf(manager.get("account")));
        replaceProjectMembers(id, body);
        replaceStageAssignees(id, body);
        syncProjectStatus(id);
        return detail(id);
    }

    @Override
    public boolean delete(String id) {
        projectMapper.deleteProject(id);
        return true;
    }

    @Override
    @Transactional
    public Map<String, Object> updateStage(String stageId, StageStatusRequest request) {
        projectMapper.updateStageStatus(stageId, request.status());
        Map<String, Object> stage = projectMapper.stage(stageId);
        syncProjectStatus(String.valueOf(stage.get("projectId")));
        return stage;
    }

    @Override
    @Transactional
    public Map<String, Object> replaceMembers(String id, ProjectMembersRequest request) {
        replaceProjectMembers(id, request.toMap());
        return detail(id);
    }

    @Override
    public List<Map<String, Object>> skus(String projectId) {
        ensureProjectExists(projectId);
        return projectMapper.skus(projectId);
    }

    @Override
    @Transactional
    public Map<String, Object> createSku(String projectId, ProjectSkuRequest request, String operator) {
        ensureProjectExists(projectId);
        String id = IdUtil.nanoId("sku");
        projectMapper.insertSku(id, projectId, request.toMap(), stringValue(operator) == null ? "system" : operator);
        return projectMapper.sku(projectId, id);
    }

    @Override
    @Transactional
    public Map<String, Object> updateSku(String projectId, String skuId, ProjectSkuRequest request, String operator) {
        ensureProjectExists(projectId);
        int updated = projectMapper.updateSku(projectId, skuId, request.toMap(), stringValue(operator) == null ? "system" : operator);
        if (updated == 0) {
            throw new IllegalArgumentException("SKU不存在或已删除");
        }
        return projectMapper.sku(projectId, skuId);
    }

    @Override
    @Transactional
    public boolean deleteSku(String projectId, String skuId, String operator) {
        ensureProjectExists(projectId);
        return projectMapper.deleteSku(projectId, skuId, stringValue(operator) == null ? "system" : operator) > 0;
    }

    @Override
    @Transactional
    public Map<String, Object> linkCustomer(String projectId, LinkCustomerRequest request) {
        String customerId = request.customerId();
        String projectStatus = resolveDefault(request.projectStatus(), "customer_project_status", "客户项目状态");
        List<String> existing = projectMapper.projectCustomerIds(projectId, customerId);
        if (existing.isEmpty()) {
            projectMapper.insertProjectCustomer(IdUtil.nanoId("pc"), projectId, customerId, projectStatus);
        } else {
            projectMapper.updateProjectCustomerStatus(projectId, customerId, projectStatus);
        }
        return detail(projectId);
    }

    @Override
    @Transactional
    public Map<String, Object> updateProjectCustomerStatus(String projectId, String customerId, ProjectCustomerStatusRequest request) {
        projectMapper.updateProjectCustomerStatus(projectId, customerId, request.projectStatus());
        return detail(projectId);
    }

    @Override
    @Transactional
    public Map<String, Object> addStageRecord(String stageId, StageRecordRequest request) {
        boolean hasText = request.content() != null && !request.content().isBlank();
        boolean hasFiles = request.attachments() != null && !request.attachments().isEmpty();
        if (!hasText && !hasFiles) {
            throw new IllegalArgumentException("阶段留言内容或附件不能为空");
        }
        String author = ValidationUtil.requireText(request.author(), "阶段留言人", 60);
        projectMapper.insertStageRecord(IdUtil.nanoId("sr"), stageId, author, request.content(), request.safeAttachments());
        Map<String, Object> stage = projectMapper.stage(stageId);
        return detail(String.valueOf(stage.get("projectId")));
    }

    @Override
    @Transactional
    public Map<String, Object> addStageMaterial(String stageId, FileMetadataRequest request) {
        projectMapper.insertStageMaterial(IdUtil.nanoId("sm"), stageId, request.toMap());
        Map<String, Object> stage = projectMapper.stage(stageId);
        return detail(String.valueOf(stage.get("projectId")));
    }

    @Override
    @Transactional
    public Map<String, Object> publishStageMaterial(String materialId) {
        Map<String, Object> material = projectMapper.stageMaterialForPublish(materialId);
        projectMapper.markStageMaterialPublished(materialId);
        projectMapper.insertProjectMaterial(IdUtil.nanoId("mat"), material);
        return detail(String.valueOf(material.get("projectId")));
    }

    @Override
    @Transactional
    public Map<String, Object> archive(String id, ArchiveProjectRequest request) {
        projectMapper.archiveProject(id, request.archived());
        return detail(id);
    }

    @Override
    public List<Map<String, Object>> requirementOverview(String id) {
        return projectMapper.requirementOverview(id);
    }

    @Override
    @Transactional
    public Map<String, Object> createRequirement(String projectId, String customerId, RequirementRequest request) {
        Map<String, Object> body = request.toMap();
        String requirementId = nextRequirementId();
        String taskId = null;
        body.put("status", resolveDefault(body.get("status"), "requirement_status", "需求状态"));
        if (Boolean.TRUE.equals(body.getOrDefault("createTask", true))) {
            taskId = nextTaskId();
            Map<String, Object> creator = requireUser(body.get("creator"), "需求关联任务创建者");
            String taskCategory = requiredEnumBySemantic("task_category", "REQUIREMENT", "需求任务分类");
            String taskStatus = resolveDefault(null, "task_status", "任务状态");
            projectMapper.insertRequirementTask(taskId, projectId, customerId, body, taskCategory, taskStatus, "需求创建自动生成", String.valueOf(creator.get("id")), String.valueOf(creator.get("name")));
            projectMapper.insertRequirementTaskAssignee(taskId, String.valueOf(creator.get("id")), creator.get("name"));
        }
        projectMapper.insertRequirement(requirementId, projectId, customerId, body, taskId);
        return projectMapper.requirement(requirementId);
    }

    @Override
    @Transactional
    public Map<String, Object> voidRequirement(String id) {
        String voidStatus = requiredEnumBySemantic("requirement_status", "VOID", "需求作废状态");
        projectMapper.voidRequirement(id, voidStatus);
        return projectMapper.requirement(id);
    }

    @Override
    public boolean deleteRequirement(String id) {
        projectMapper.deleteRequirement(id);
        return true;
    }

    @Override
    public List<Map<String, Object>> templates() {
        List<Map<String, Object>> templates = projectMapper.templates();
        templates.forEach(this::enrichTemplate);
        return templates;
    }

    @Override
    @Transactional
    public Map<String, Object> createTemplate(ProcessTemplateRequest request) {
        Map<String, Object> body = request.toMap();
        String id = uniqueTemplateId(request.name());
        projectMapper.insertTemplate(id, body);
        replaceTemplateStages(id, body);
        Map<String, Object> template = projectMapper.template(id);
        enrichTemplate(template);
        return template;
    }

    @Override
    @Transactional
    public Map<String, Object> updateTemplate(String id, ProcessTemplateRequest request) {
        Map<String, Object> body = request.toMap();
        projectMapper.updateTemplate(id, body);
        replaceTemplateStages(id, body);
        Map<String, Object> template = projectMapper.template(id);
        enrichTemplate(template);
        return template;
    }

    @Override
    public boolean deleteTemplate(String id) {
        projectMapper.deleteTemplate(id);
        return true;
    }

    private void enrichProject(Map<String, Object> project) {
        if (project == null) {
            throw new IllegalArgumentException("项目不存在");
        }
        String id = String.valueOf(project.get("id"));
        project.put("managerName", projectMapper.managerName(project.getOrDefault("managerUserId", project.get("managerAccount"))));
        project.put("members", projectMapper.members(id));
        project.put("skus", projectMapper.skus(id));
        List<Map<String, Object>> stages = projectMapper.stages(id);
        stages.forEach(stage -> {
            Object stageId = stage.get("id");
            stage.put("assignees", projectMapper.stageAssignees(stageId));
            stage.put("materials", projectMapper.stageMaterials(stageId));
            stage.put("records", projectMapper.stageRecords(stageId));
        });
        project.put("stages", stages);

        List<Map<String, Object>> projectCustomers = projectMapper.projectCustomers(id);
        projectCustomers.forEach(projectCustomer -> projectCustomer.put("requirements", projectMapper.requirements(id, projectCustomer.get("customerId"))));
        project.put("projectCustomers", projectCustomers);
        project.put("projectMaterials", projectMapper.projectMaterials(id));
    }

    private void enrichTemplate(Map<String, Object> template) {
        template.put("stages", projectMapper.templateStageNames(String.valueOf(template.get("id"))));
    }

    @SuppressWarnings("unchecked")
    private void createProjectStages(String projectId, Map<String, Object> body) {
        List<Object> providedStages = (List<Object>) body.getOrDefault("stages", List.of());
        if (!providedStages.isEmpty()) {
            int order = 1;
            for (Object rawStage : providedStages) {
                Map<String, Object> stage = rawStage instanceof Map<?, ?> ? (Map<String, Object>) rawStage : Map.of("name", rawStage);
                String stageId = IdUtil.nanoId("st");
                String stageName = ValidationUtil.requireText(stage.getOrDefault("name", stage.get("stageName")), "阶段名称", 80);
                projectMapper.insertStage(stageId, projectId, stageName, order++, resolveDefault(stage.get("status"), "stage_status", "阶段状态"));
                insertStageAssignees(stageId, stage);
            }
            return;
        }

        List<String> stages = projectMapper.templateStageNames(DEFAULT_TEMPLATE_ID);
        int order = 1;
        for (String stage : stages) {
            projectMapper.insertStage(IdUtil.nanoId("st"), projectId, stage, order++, resolveDefault(null, "stage_status", "阶段状态"));
        }
    }

    @SuppressWarnings("unchecked")
    private void replaceProjectMembers(String projectId, Map<String, Object> body) {
        projectMapper.deleteMembers(projectId);
        List<Object> members = new ArrayList<>((List<Object>) body.getOrDefault("members", List.of()));
        String managerAccount = String.valueOf(body.getOrDefault("managerAccount", ""));
        boolean hasManager = members.stream()
                .filter(item -> item instanceof Map<?, ?>)
                .map(item -> (Map<String, Object>) item)
                .anyMatch(item -> managerAccount.equals(String.valueOf(item.getOrDefault("userAccount", item.getOrDefault("account", "")))));
        if (!managerAccount.isBlank() && !hasManager) {
            members.add(Map.of("userAccount", managerAccount, "role", "项目负责人"));
        }
        for (Object rawMember : members) {
            if (!(rawMember instanceof Map<?, ?>)) {
                continue;
            }
            Map<String, Object> member = (Map<String, Object>) rawMember;
            String account = String.valueOf(member.getOrDefault("userAccount", member.getOrDefault("account", "")));
            if (account.isBlank()) {
                continue;
            }
            String role = ValidationUtil.requireText(member.getOrDefault("role", member.get("roleName")), "项目成员角色", 60);
            Map<String, Object> user = requireUser(account, "项目成员");
            projectMapper.insertMember(IdUtil.nanoId("pm"), projectId, String.valueOf(user.get("id")), String.valueOf(user.get("account")), role);
        }
    }

    @SuppressWarnings("unchecked")
    private void replaceStageAssignees(String projectId, Map<String, Object> body) {
        List<Object> stages = (List<Object>) body.getOrDefault("stages", List.of());
        for (Object rawStage : stages) {
            if (!(rawStage instanceof Map<?, ?>)) {
                continue;
            }
            Map<String, Object> stage = (Map<String, Object>) rawStage;
            String stageId = stringValue(stage.get("id"));
            if (stageId == null) {
                String stageName = stringValue(stage.getOrDefault("name", stage.get("stageName")));
                List<String> ids = projectMapper.stageIdsByName(projectId, stageName);
                if (!ids.isEmpty()) {
                    stageId = ids.getFirst();
                }
            }
            if (stageId == null) {
                continue;
            }
            if (stage.containsKey("status")) {
                projectMapper.updateStageStatus(stageId, stage.get("status"));
            }
            projectMapper.deleteStageAssignees(stageId);
            insertStageAssignees(stageId, stage);
        }
    }

    @SuppressWarnings("unchecked")
    private void insertStageAssignees(String stageId, Map<String, Object> stage) {
        for (Object rawAssignee : (List<Object>) stage.getOrDefault("assignees", List.of())) {
            if (!(rawAssignee instanceof Map<?, ?>)) {
                continue;
            }
            Map<String, Object> assignee = (Map<String, Object>) rawAssignee;
            String type = ValidationUtil.requireText(assignee.getOrDefault("type", assignee.get("assigneeType")), "阶段负责人类型", 20);
            String account = stringValue(assignee.get("account"));
            Object nameValue = assignee.getOrDefault("name", assignee.get("assigneeName"));
            String userId = null;
            String name = nameValue == null ? null : String.valueOf(nameValue);
            if ("user".equals(type)) {
                Map<String, Object> user = requireUser(account != null ? account : nameValue, "阶段负责人");
                userId = String.valueOf(user.get("id"));
                account = String.valueOf(user.get("account"));
                name = String.valueOf(user.get("name"));
            }
            if (name == null || "null".equals(name) || name.isBlank()) {
                continue;
            }
            projectMapper.insertStageAssignee(IdUtil.nanoId("sa"), stageId, type, name, account, userId);
        }
    }

    private void syncProjectStatus(String projectId) {
        List<String> statuses = projectMapper.stageStatuses(projectId);
        String nextStatus = resolveDefault(null, "project_status", "项目状态");
        if (!statuses.isEmpty() && statuses.stream().allMatch(status -> "COMPLETED".equals(projectMapper.enumSemantic("stage_status", status)))) {
            nextStatus = requiredEnumBySemantic("project_status", "COMPLETED", "项目完成状态");
        } else if (statuses.stream().anyMatch(status -> "ACTIVE".equals(projectMapper.enumSemantic("stage_status", status)))) {
            nextStatus = requiredEnumBySemantic("project_status", "ACTIVE", "项目进行中状态");
        }
        projectMapper.updateProjectStatus(projectId, nextStatus);
    }

    @SuppressWarnings("unchecked")
    private void replaceTemplateStages(String templateId, Map<String, Object> body) {
        projectMapper.deleteTemplateStages(templateId);
        int sortOrder = 1;
        for (Object stage : (List<Object>) body.getOrDefault("stages", List.of())) {
            projectMapper.insertTemplateStage(IdUtil.nanoId("tpl-stage"), templateId, stage, sortOrder++);
        }
    }

    @SuppressWarnings("unchecked")
    private void publishProjectCreatedEvent(String projectId, Map<String, Object> body) {
        List<String> recipients = new ArrayList<>();
        recipients.add(String.valueOf(requireUser(body.get("managerAccount"), "项目负责人").get("id")));
        for (Object rawMember : (List<Object>) body.getOrDefault("members", List.of())) {
            if (!(rawMember instanceof Map<?, ?> rawMap)) continue;
            @SuppressWarnings("unchecked")
            Map<String, Object> member = (Map<String, Object>) rawMap;
            Object account = member.getOrDefault("userAccount", member.get("account"));
            recipients.add(String.valueOf(requireUser(account, "项目成员").get("id")));
        }
        List<String> distinctRecipients = recipients.stream().filter(value -> value != null && !value.isBlank()).distinct().toList();
        if (distinctRecipients.isEmpty()) {
            return;
        }
        projectMapper.insertNotificationEvent(
                IdUtil.nanoId("evt"),
                "PROJECT_CREATED",
                projectId,
                "你被加入新项目",
                "项目 " + body.get("externalName") + " 已创建，你已被加入项目成员。",
                JsonUtil.toJson(distinctRecipients)
        );
    }

    private String resolveDefault(Object value, String enumType, String label) {
        if (value != null && !String.valueOf(value).isBlank()) {
            return String.valueOf(value);
        }
        String defaultValue = projectMapper.defaultEnumValue(enumType);
        if (defaultValue == null || defaultValue.isBlank()) {
            throw new IllegalArgumentException(label + "未配置默认枚举值，请先在资源管理中配置");
        }
        return defaultValue;
    }

    private String requiredEnumBySemantic(String enumType, String semantic, String label) {
        String value = projectMapper.enumValueBySemantic(enumType, semantic);
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(label + "未配置枚举语义：" + semantic);
        }
        return value;
    }

    private Map<String, Object> requireUser(Object accountOrName, String label) {
        String value = stringValue(accountOrName);
        if (value == null) {
            throw new IllegalArgumentException(label + "必须从已有用户中选择");
        }
        List<Map<String, Object>> users = projectMapper.usersByAccountOrName(value);
        if (users.isEmpty()) {
            throw new IllegalArgumentException(label + "不存在，请从已有用户中选择");
        }
        return users.getFirst();
    }

    private String uniqueProjectId(String source) {
        String base = IdUtil.slug(source, "project");
        String candidate = base;
        int index = 2;
        while (!projectMapper.projectIds(candidate).isEmpty()) {
            candidate = base + "-" + index++;
        }
        return candidate;
    }

    private String uniqueTemplateId(String source) {
        String base = "tpl-" + IdUtil.slug(source, "template");
        String candidate = base;
        int index = 2;
        while (!projectMapper.templateIds(candidate).isEmpty()) {
            candidate = base + "-" + index++;
        }
        return candidate;
    }

    private String nextRequirementId() {
        Integer max = projectMapper.maxRequirementNumber();
        return "REQ-" + String.format("%03d", (max == null ? 0 : max) + 1);
    }

    private String nextTaskId() {
        Integer max = projectMapper.maxTaskNumber();
        return "KPM-" + ((max == null ? 100 : max) + 1);
    }

    private String stringValue(Object value) {
        if (value == null || String.valueOf(value).isBlank()) {
            return null;
        }
        return String.valueOf(value);
    }

    private void ensureProjectExists(String projectId) {
        if (projectMapper.load(projectId) == null) {
            throw new IllegalArgumentException("项目不存在");
        }
    }
}

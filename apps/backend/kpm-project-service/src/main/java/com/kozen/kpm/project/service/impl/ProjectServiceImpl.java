package com.kozen.kpm.project.service.impl;

import com.kozen.kpm.common.api.PageResult;
import com.kozen.kpm.common.dto.FileMetadataRequest;
import com.kozen.kpm.common.util.IdUtil;
import com.kozen.kpm.common.util.JsonUtil;
import com.kozen.kpm.common.util.PageParamUtil;
import com.kozen.kpm.common.util.ValidationUtil;
import com.kozen.kpm.project.converter.ProjectConverter;
import com.kozen.kpm.project.dto.ArchiveProjectRequest;
import com.kozen.kpm.project.dto.LinkCustomerRequest;
import com.kozen.kpm.project.dto.ProcessTemplateDto;
import com.kozen.kpm.project.dto.ProcessTemplateRequest;
import com.kozen.kpm.project.dto.ProcessTemplateWriteCommand;
import com.kozen.kpm.project.dto.ProjectCustomerDto;
import com.kozen.kpm.project.dto.ProjectCustomerStatusRequest;
import com.kozen.kpm.project.dto.ProjectDto;
import com.kozen.kpm.project.dto.ProjectMemberRequest;
import com.kozen.kpm.project.dto.ProjectMembersRequest;
import com.kozen.kpm.project.dto.ProjectRequest;
import com.kozen.kpm.project.dto.ProjectAnnouncementRequest;
import com.kozen.kpm.project.dto.ProjectSkuDto;
import com.kozen.kpm.project.dto.ProjectSkuRequest;
import com.kozen.kpm.project.dto.ProjectSkuWriteCommand;
import com.kozen.kpm.project.dto.ProjectStageDto;
import com.kozen.kpm.project.dto.ProjectStageRequest;
import com.kozen.kpm.project.dto.ProjectWriteCommand;
import com.kozen.kpm.project.dto.RequirementDto;
import com.kozen.kpm.project.dto.RequirementOverviewDto;
import com.kozen.kpm.project.dto.RequirementRequest;
import com.kozen.kpm.project.dto.RequirementTaskWriteCommand;
import com.kozen.kpm.project.dto.RequirementWriteCommand;
import com.kozen.kpm.project.dto.StageAssigneeRequest;
import com.kozen.kpm.project.dto.StageAssigneesRequest;
import com.kozen.kpm.project.dto.StageRecordRequest;
import com.kozen.kpm.project.dto.StageStatusRequest;
import com.kozen.kpm.project.entity.ProcessTemplateEntity;
import com.kozen.kpm.project.entity.ProjectEntity;
import com.kozen.kpm.project.entity.ProjectFileEntity;
import com.kozen.kpm.project.entity.ProjectSkuEntity;
import com.kozen.kpm.project.entity.ProjectStageEntity;
import com.kozen.kpm.project.entity.RequirementEntity;
import com.kozen.kpm.project.entity.StageAssigneeEntity;
import com.kozen.kpm.project.entity.UserLookupEntity;
import com.kozen.kpm.project.mapper.ProjectMapper;
import com.kozen.kpm.project.service.ProjectService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** Default project service implementation with typed DTO/entity boundaries. */
@Service
public class ProjectServiceImpl implements ProjectService {
    private final ProjectMapper projectMapper;
    private final ProjectConverter projectConverter;

    public ProjectServiceImpl(ProjectMapper projectMapper, ProjectConverter projectConverter) {
        this.projectMapper = projectMapper;
        this.projectConverter = projectConverter;
    }

    @Override
    public List<ProjectDto> list(String keyword, Boolean archived) {
        return projectMapper.list(keyword, archived).stream().map(this::enrichProject).toList();
    }

    @Override
    public PageResult<ProjectDto> page(String keyword, Boolean archived, Integer page, Integer pageSize) {
        int current = PageParamUtil.page(page);
        int size = PageParamUtil.pageSize(pageSize);
        List<ProjectDto> items = projectMapper.pageRows(keyword, archived, size, PageParamUtil.offset(current, size))
                .stream()
                .map(this::enrichProjectSummary)
                .toList();
        long total = projectMapper.countRows(keyword, archived);
        return PageResult.of(items, total, current, size);
    }

    @Override
    public ProjectDto detail(String id) {
        return enrichProject(requireProject(id));
    }

    @Override
    @Transactional
    public ProjectDto create(ProjectRequest request) {
        String id = uniqueProjectId(request.externalName());
        UserLookupEntity manager = requireUser(request.managerAccount(), "项目负责人");
        projectMapper.insertProject(new ProjectWriteCommand(id, request.externalName(), request.internalName(), request.modelName(), manager.getId(), manager.getAccount(), request.description()));
        replaceProjectMembers(id, request.safeMembers(), request.managerAccount());
        createProjectStages(id, request.safeStages());
        publishProjectCreatedEvent(id, request, manager);
        return detail(id);
    }

    @Override
    @Transactional
    public ProjectDto update(String id, ProjectRequest request) {
        ensureProjectExists(id);
        UserLookupEntity manager = requireUser(request.managerAccount(), "项目负责人");
        projectMapper.updateProject(new ProjectWriteCommand(id, request.externalName(), request.internalName(), request.modelName(), manager.getId(), manager.getAccount(), request.description()));
        replaceProjectMembers(id, request.safeMembers(), request.managerAccount());
        replaceStageAssignees(id, request.safeStages());
        return detail(id);
    }

    @Override
    public boolean delete(String id) {
        projectMapper.deleteProject(id);
        return true;
    }

    @Override
    @Transactional
    public ProjectDto updateStage(String stageId, StageStatusRequest request, String operatorAccount) {
        ProjectStageEntity stage = requireStage(stageId);
        assertStageStatusOperator(stageId, operatorAccount);
        projectMapper.updateStageStatus(stageId, request.status());
        return detail(stage.getProjectId());
    }

    @Override
    @Transactional
    public ProjectDto replaceStageAssignees(String stageId, StageAssigneesRequest request) {
        ProjectStageEntity stage = requireStage(stageId);
        projectMapper.deleteStageAssignees(stageId);
        insertStageAssignees(stageId, request.safeAssignees());
        return detail(stage.getProjectId());
    }

    @Override
    @Transactional
    public ProjectDto replaceMembers(String id, ProjectMembersRequest request) {
        ProjectEntity project = requireProject(id);
        replaceProjectMembers(id, request.safeMembers(), stringValue(request.managerAccount()) == null ? project.getManagerAccount() : request.managerAccount());
        return detail(id);
    }

    @Override
    public List<ProjectSkuDto> skus(String projectId) {
        ensureProjectExists(projectId);
        return projectMapper.skus(projectId).stream().map(projectConverter::toSkuDto).toList();
    }

    @Override
    @Transactional
    public ProjectSkuDto createSku(String projectId, ProjectSkuRequest request, String operator) {
        ensureProjectExists(projectId);
        String id = IdUtil.nanoId("sku");
        String resolvedOperator = resolveOperator(operator);
        projectMapper.insertSku(ProjectSkuWriteCommand.from(id, projectId, request, resolvedOperator));
        return projectConverter.toSkuDto(projectMapper.sku(projectId, id));
    }

    @Override
    @Transactional
    public ProjectSkuDto updateSku(String projectId, String skuId, ProjectSkuRequest request, String operator) {
        ensureProjectExists(projectId);
        String resolvedOperator = resolveOperator(operator);
        int updated = projectMapper.updateSku(ProjectSkuWriteCommand.from(skuId, projectId, request, resolvedOperator));
        if (updated == 0) {
            throw new IllegalArgumentException("SKU不存在或已删除");
        }
        return projectConverter.toSkuDto(projectMapper.sku(projectId, skuId));
    }

    @Override
    @Transactional
    public boolean deleteSku(String projectId, String skuId, String operator) {
        ensureProjectExists(projectId);
        return projectMapper.deleteSku(projectId, skuId, resolveOperator(operator)) > 0;
    }

    @Override
    @Transactional
    public ProjectDto linkCustomer(String projectId, LinkCustomerRequest request) {
        ensureProjectExists(projectId);
        String customerId = ValidationUtil.requireText(request.customerId(), "客户ID", 80);
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
    public ProjectDto updateProjectCustomerStatus(String projectId, String customerId, ProjectCustomerStatusRequest request) {
        ensureProjectExists(projectId);
        projectMapper.updateProjectCustomerStatus(projectId, customerId, request.projectStatus());
        return detail(projectId);
    }

    @Override
    @Transactional
    public ProjectDto addStageRecord(String stageId, StageRecordRequest request) {
        boolean hasText = request.content() != null && !request.content().isBlank();
        boolean hasFiles = request.attachments() != null && !request.attachments().isEmpty();
        if (!hasText && !hasFiles) {
            throw new IllegalArgumentException("阶段留言内容或附件不能为空");
        }
        String author = ValidationUtil.requireText(request.author(), "阶段留言人", 60);
        projectMapper.insertStageRecord(IdUtil.nanoId("sr"), stageId, author, request.content(), request.safeAttachments());
        ProjectStageEntity stage = requireStage(stageId);
        return detail(stage.getProjectId());
    }

    @Override
    @Transactional
    public ProjectDto addStageMaterial(String stageId, FileMetadataRequest request) {
        projectMapper.insertStageMaterial(IdUtil.nanoId("sm"), stageId, request);
        ProjectStageEntity stage = requireStage(stageId);
        return detail(stage.getProjectId());
    }

    @Override
    @Transactional
    public ProjectDto addProjectMaterial(String projectId, FileMetadataRequest request) {
        ensureProjectExists(projectId);
        projectMapper.insertProjectMaterialFromRequest(IdUtil.nanoId("mat"), projectId, request);
        return detail(projectId);
    }

    @Override
    @Transactional
    public ProjectDto publishAnnouncement(String projectId, ProjectAnnouncementRequest request, String publisher) {
        ensureProjectExists(projectId);
        String title = ValidationUtil.requireText(request.title(), "公告标题", 120);
        String content = ValidationUtil.requireText(request.content(), "公告内容", 3000);
        String announcementType = resolveDefault(request.announcementType(), "project_announcement_type", "公告类型");
        String publisherName = ValidationUtil.optionalText(publisher, "发布人", 80);
        if (publisherName == null || publisherName.isBlank()) {
            publisherName = "KPM";
        }
        String announcementId = IdUtil.nanoId("ann");
        projectMapper.insertProjectAnnouncement(announcementId, projectId, title, content, announcementType, publisherName);
        projectMapper.insertCustomerPortalMessagesForAnnouncement(projectId, announcementId, announcementType + "：" + title, content);
        return detail(projectId);
    }

    @Override
    @Transactional
    public ProjectDto publishStageMaterial(String materialId) {
        ProjectFileEntity material = projectMapper.stageMaterialForPublish(materialId);
        if (material == null) {
            throw new IllegalArgumentException("阶段资料不存在或已删除");
        }
        projectMapper.markStageMaterialPublished(materialId);
        projectMapper.insertProjectMaterial(IdUtil.nanoId("mat"), material);
        return detail(material.getProjectId());
    }

    @Override
    @Transactional
    public ProjectDto publishProjectMaterialToCustomer(String projectId, String materialId) {
        ensureProjectExists(projectId);
        int updated = projectMapper.markProjectMaterialPublic(projectId, materialId, "customer-visible");
        if (updated == 0) {
            throw new IllegalArgumentException("项目资料不存在或已删除");
        }
        return detail(projectId);
    }

    @Override
    @Transactional
    public ProjectDto retractProjectMaterialFromCustomer(String projectId, String materialId, String operator) {
        ensureProjectExists(projectId);
        int updated = projectMapper.retractProjectMaterialPublic(projectId, materialId, resolveOperator(operator));
        if (updated == 0) {
            throw new IllegalArgumentException("项目资料不存在、已删除或不可下架");
        }
        return detail(projectId);
    }

    @Override
    @Transactional
    public ProjectDto deleteProjectMaterial(String projectId, String materialId, String operator) {
        ensureProjectExists(projectId);
        int updated = projectMapper.deleteProjectMaterial(projectId, materialId, resolveOperator(operator));
        if (updated == 0) {
            throw new IllegalArgumentException("项目资料不存在或已删除");
        }
        return detail(projectId);
    }

    @Override
    @Transactional
    public ProjectDto retractAnnouncement(String projectId, String announcementId, String operator) {
        ensureProjectExists(projectId);
        int updated = projectMapper.retractProjectAnnouncement(projectId, announcementId, resolveOperator(operator));
        if (updated == 0) {
            throw new IllegalArgumentException("公告不存在、已撤回或已删除");
        }
        return detail(projectId);
    }

    @Override
    @Transactional
    public ProjectDto archive(String id, ArchiveProjectRequest request) {
        ensureProjectExists(id);
        projectMapper.archiveProject(id, request.archived());
        return detail(id);
    }

    @Override
    public List<RequirementOverviewDto> requirementOverview(String id) {
        ensureProjectExists(id);
        return projectMapper.requirementOverview(id).stream().map(projectConverter::toRequirementOverviewDto).toList();
    }

    @Override
    @Transactional
    public RequirementDto createRequirement(String projectId, String customerId, RequirementRequest request) {
        ensureProjectExists(projectId);
        String requirementId = nextRequirementId();
        String taskId = null;
        String requirementStatus = resolveDefault(request.status(), "requirement_status", "需求状态");
        if (request.createTask() == null || request.createTask()) {
            taskId = IdUtil.nanoId("task");
            String taskNo = nextTaskNo(customerId);
            UserLookupEntity creator = requireUser(request.creator(), "需求关联任务创建者");
            String taskCategory = requiredEnumBySemantic("task_category", "REQUIREMENT", "需求任务分类");
            String taskStatus = resolveDefault(null, "task_status", "任务状态");
            projectMapper.insertRequirementTask(new RequirementTaskWriteCommand(taskId, taskNo, projectId, customerId, request.title(), request.userStory(), request.priority(), null, taskCategory, taskStatus, "需求创建自动生成", creator.getId(), creator.getName()));
            projectMapper.insertRequirementTaskAssignee(taskId, creator.getId(), creator.getName());
        }
        projectMapper.insertRequirement(new RequirementWriteCommand(requirementId, projectId, customerId, request.title(), request.userStory(), request.businessValue(), request.acceptance(), request.priority(), requirementStatus, request.proposer(), request.creator(), null, taskId));
        return projectConverter.toRequirementDto(projectMapper.requirement(requirementId));
    }

    @Override
    @Transactional
    public RequirementDto voidRequirement(String id) {
        String voidStatus = requiredEnumBySemantic("requirement_status", "VOID", "需求作废状态");
        projectMapper.voidRequirement(id, voidStatus);
        return projectConverter.toRequirementDto(projectMapper.requirement(id));
    }

    @Override
    public boolean deleteRequirement(String id) {
        projectMapper.deleteRequirement(id);
        return true;
    }

    @Override
    public List<ProcessTemplateDto> templates() {
        return projectMapper.templates().stream().map(this::enrichTemplate).toList();
    }

    @Override
    @Transactional
    public ProcessTemplateDto createTemplate(ProcessTemplateRequest request) {
        String id = uniqueTemplateId(request.name());
        projectMapper.insertTemplate(new ProcessTemplateWriteCommand(id, request.name(), request.scope(), request.status()));
        replaceTemplateStages(id, request.safeStages());
        return enrichTemplate(projectMapper.template(id));
    }

    @Override
    @Transactional
    public ProcessTemplateDto updateTemplate(String id, ProcessTemplateRequest request) {
        projectMapper.updateTemplate(new ProcessTemplateWriteCommand(id, request.name(), request.scope(), request.status()));
        replaceTemplateStages(id, request.safeStages());
        return enrichTemplate(projectMapper.template(id));
    }

    @Override
    public boolean deleteTemplate(String id) {
        projectMapper.deleteTemplate(id);
        return true;
    }

    private ProjectDto enrichProject(ProjectEntity project) {
        if (project == null) {
            throw new IllegalArgumentException("项目不存在");
        }
        String id = project.getId();
        String managerName = projectMapper.managerName(stringValue(project.getManagerUserId()) == null ? project.getManagerAccount() : project.getManagerUserId());
        List<ProjectStageDto> stages = projectMapper.stages(id).stream()
                .map(stage -> projectConverter.toStageDto(stage, projectMapper.stageAssignees(stage.getId()), projectMapper.stageMaterials(stage.getId()), projectMapper.stageRecords(stage.getId())))
                .toList();
        List<ProjectCustomerDto> customers = projectMapper.projectCustomers(id).stream()
                .map(customer -> projectConverter.toCustomerDto(customer, projectMapper.requirements(id, customer.getCustomerId())))
                .toList();
        return projectConverter.toProjectDto(project, managerName, projectMapper.members(id), projectMapper.skus(id), stages, customers, projectMapper.projectMaterials(id), projectMapper.projectAnnouncements(id));
    }

    private ProjectDto enrichProjectSummary(ProjectEntity project) {
        if (project == null) {
            throw new IllegalArgumentException("项目不存在");
        }
        String id = project.getId();
        String managerName = projectMapper.managerName(stringValue(project.getManagerUserId()) == null ? project.getManagerAccount() : project.getManagerUserId());
        return projectConverter.toProjectSummaryDto(project, managerName, projectMapper.members(id), projectMapper.skus(id));
    }

    private ProcessTemplateDto enrichTemplate(ProcessTemplateEntity template) {
        if (template == null) {
            throw new IllegalArgumentException("流程模板不存在");
        }
        return projectConverter.toTemplateDto(template, projectMapper.templateStageNames(template.getId()));
    }

    private void createProjectStages(String projectId, List<ProjectStageRequest> providedStages) {
        if (!providedStages.isEmpty()) {
            int order = 1;
            for (ProjectStageRequest stage : providedStages) {
                String stageId = IdUtil.nanoId("st");
                String stageName = ValidationUtil.requireText(stage.name(), "阶段名称", 80);
                projectMapper.insertStage(stageId, projectId, stageName, order++, resolveDefault(null, "stage_status", "阶段状态"));
                insertStageAssignees(stageId, stage.safeAssignees());
            }
            return;
        }

        List<ProcessTemplateEntity> templates = projectMapper.templates();
        List<String> stages = templates.isEmpty() ? List.of() : projectMapper.templateStageNames(templates.getFirst().getId());
        int order = 1;
        for (String stage : stages) {
            projectMapper.insertStage(IdUtil.nanoId("st"), projectId, stage, order++, resolveDefault(null, "stage_status", "阶段状态"));
        }
    }

    private void replaceProjectMembers(String projectId, List<ProjectMemberRequest> requestedMembers, String managerAccount) {
        projectMapper.deleteMembers(projectId);
        List<ProjectMemberRequest> members = new ArrayList<>(requestedMembers);
        boolean hasManager = members.stream().anyMatch(item -> managerAccount.equals(item.userAccount()));
        if (stringValue(managerAccount) != null && !hasManager) {
            members.add(new ProjectMemberRequest(managerAccount, "项目负责人"));
        }
        for (ProjectMemberRequest member : members) {
            String account = stringValue(member.userAccount());
            if (account == null) {
                continue;
            }
            String role = ValidationUtil.requireText(member.role(), "项目成员角色", 60);
            UserLookupEntity user = requireUser(account, "项目成员");
            projectMapper.insertMember(IdUtil.nanoId("pm"), projectId, user.getId(), user.getAccount(), role);
        }
    }

    private void replaceStageAssignees(String projectId, List<ProjectStageRequest> stages) {
        for (ProjectStageRequest stage : stages) {
            String stageId = stringValue(stage.id());
            if (stageId == null) {
                List<String> ids = projectMapper.stageIdsByName(projectId, stage.name());
                if (!ids.isEmpty()) {
                    stageId = ids.getFirst();
                }
            }
            if (stageId == null) {
                continue;
            }
            projectMapper.deleteStageAssignees(stageId);
            insertStageAssignees(stageId, stage.safeAssignees());
        }
    }

    private void insertStageAssignees(String stageId, List<StageAssigneeRequest> assignees) {
        for (StageAssigneeRequest assignee : assignees) {
            String type = ValidationUtil.requireText(assignee.type(), "阶段负责人类型", 20);
            String account = stringValue(assignee.account());
            String name = stringValue(assignee.name());
            String userId = null;
            if ("user".equals(type)) {
                UserLookupEntity user = requireUser(account != null ? account : name, "阶段负责人");
                userId = user.getId();
                account = user.getAccount();
                name = user.getName();
            }
            if (name == null) {
                continue;
            }
            projectMapper.insertStageAssignee(IdUtil.nanoId("sa"), stageId, type, name, account, userId);
        }
    }

    private void replaceTemplateStages(String templateId, List<String> stages) {
        projectMapper.deleteTemplateStages(templateId);
        int sortOrder = 1;
        for (String stageName : stages) {
            projectMapper.insertTemplateStage(IdUtil.nanoId("tpl-stage"), templateId, ValidationUtil.requireText(stageName, "模板阶段名称", 80), sortOrder++);
        }
    }

    private void publishProjectCreatedEvent(String projectId, ProjectRequest request, UserLookupEntity manager) {
        List<String> recipients = new ArrayList<>();
        recipients.add(manager.getId());
        for (ProjectMemberRequest member : request.safeMembers()) {
            recipients.add(requireUser(member.userAccount(), "项目成员").getId());
        }
        List<String> distinctRecipients = recipients.stream().filter(value -> value != null && !value.isBlank()).distinct().toList();
        if (distinctRecipients.isEmpty()) {
            return;
        }
        projectMapper.insertNotificationEvent(
                IdUtil.numericId(),
                "PROJECT_CREATED",
                projectId,
                "你被加入新项目",
                "项目 " + request.externalName() + " 已创建，你已被加入项目成员。",
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

    private UserLookupEntity requireUser(String accountOrName, String label) {
        String value = stringValue(accountOrName);
        if (value == null) {
            throw new IllegalArgumentException(label + "必须从已有用户中选择");
        }
        List<UserLookupEntity> users = projectMapper.usersByAccountOrName(value);
        if (users.isEmpty()) {
            throw new IllegalArgumentException(label + "不存在，请从已有用户中选择");
        }
        return users.getFirst();
    }

    private void assertStageStatusOperator(String stageId, String operatorAccount) {
        String account = stringValue(operatorAccount);
        if (account == null) {
            throw new SecurityException("无法识别当前登录用户，请重新登录后再修改阶段状态");
        }
        UserLookupEntity operator = requireUser(account, "当前登录用户");
        List<StageAssigneeEntity> assignees = projectMapper.stageAssignees(stageId);
        boolean allowed = assignees.stream().anyMatch(assignee -> isSameUser(operator, assignee));
        if (!allowed) {
            throw new SecurityException("只有阶段负责人可以修改阶段状态");
        }
    }

    private boolean isSameUser(UserLookupEntity operator, StageAssigneeEntity assignee) {
        if (operator == null || assignee == null) {
            return false;
        }
        return sameText(operator.getId(), assignee.getUserId())
                || sameText(operator.getAccount(), assignee.getAccount())
                || sameText(operator.getEmail(), assignee.getAccount());
    }

    private boolean sameText(String left, String right) {
        if (left == null || right == null) {
            return false;
        }
        return left.trim().equalsIgnoreCase(right.trim());
    }

    private String uniqueProjectId(String source) {
        return IdUtil.numericId();
    }

    private String uniqueTemplateId(String source) {
        return IdUtil.numericId();
    }

    private String nextRequirementId() {
        return IdUtil.numericId();
    }

    private String nextTaskNo(String customerId) {
        String shortName = projectMapper.customerShortName(customerId);
        String prefix = shortName == null || shortName.isBlank() ? "N" : shortName.trim().toUpperCase();
        Long next = projectMapper.nextTaskNumber();
        return prefix + (next == null ? 1 : next);
    }

    private String resolveOperator(String operator) {
        String value = stringValue(operator);
        if (value == null) {
            throw new IllegalArgumentException("操作人不能为空");
        }
        return value;
    }

    private String stringValue(Object value) {
        if (value == null || String.valueOf(value).isBlank()) {
            return null;
        }
        return String.valueOf(value);
    }

    private ProjectEntity requireProject(String projectId) {
        ProjectEntity project = projectMapper.load(projectId);
        if (project == null) {
            throw new IllegalArgumentException("项目不存在");
        }
        return project;
    }

    private ProjectStageEntity requireStage(String stageId) {
        ProjectStageEntity stage = projectMapper.stage(stageId);
        if (stage == null) {
            throw new IllegalArgumentException("阶段不存在");
        }
        return stage;
    }

    private void ensureProjectExists(String projectId) {
        requireProject(projectId);
    }
}

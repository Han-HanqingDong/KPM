package com.kozen.kpm.task.service.impl;

import com.kozen.kpm.common.api.PageResult;
import com.kozen.kpm.common.dto.FileMetadataRequest;
import com.kozen.kpm.common.util.IdUtil;
import com.kozen.kpm.common.util.JsonUtil;
import com.kozen.kpm.common.util.PageParamUtil;
import com.kozen.kpm.common.util.SqlParamUtil;
import com.kozen.kpm.common.util.ValidationUtil;
import com.kozen.kpm.task.converter.TaskConverter;
import com.kozen.kpm.task.dto.TaskCommentDto;
import com.kozen.kpm.task.dto.TaskCommentRequest;
import com.kozen.kpm.task.dto.TaskDto;
import com.kozen.kpm.task.dto.TaskRequest;
import com.kozen.kpm.task.dto.TaskWriteCommand;
import com.kozen.kpm.task.entity.TaskAttachmentEntity;
import com.kozen.kpm.task.entity.TaskCommentEntity;
import com.kozen.kpm.task.entity.TaskEntity;
import com.kozen.kpm.task.entity.TaskRelatedStringEntity;
import com.kozen.kpm.task.entity.UserLookupEntity;
import com.kozen.kpm.task.mapper.TaskMapper;
import com.kozen.kpm.task.service.TaskService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Default task service implementation.
 *
 * <p>Task business logic stays in the service layer: it validates selected users, assembles typed
 * persistence commands, maintains assignees/participants, emits notification events and synchronizes
 * linked requirement status. Controllers only delegate; mappers only run SQL.</p>
 */
@Service
public class TaskServiceImpl implements TaskService {
    private final TaskMapper taskMapper;
    private final TaskConverter taskConverter;

    public TaskServiceImpl(TaskMapper taskMapper, TaskConverter taskConverter) {
        this.taskMapper = taskMapper;
        this.taskConverter = taskConverter;
    }

    @Override
    public List<TaskDto> list(String keyword, String status, String category) {
        String like = SqlParamUtil.likeOrBlank(keyword);
        String st = SqlParamUtil.blankIfAll(status);
        String cat = SqlParamUtil.blankIfAll(category);
        return enrichTasks(taskMapper.list(like, st, cat));
    }

    @Override
    public PageResult<TaskDto> page(String keyword, String status, String category, String customerId, String projectId, String id, String userId, String assigneeScope, String relationScope, String statusScope, List<String> completedStatuses, Integer page, Integer pageSize) {
        int current = PageParamUtil.page(page);
        int size = PageParamUtil.pageSize(pageSize);
        String like = SqlParamUtil.likeOrBlank(keyword);
        String st = SqlParamUtil.blankIfAll(status);
        String cat = SqlParamUtil.blankIfAll(category);
        String customer = SqlParamUtil.blankIfAll(customerId);
        String project = SqlParamUtil.blankIfAll(projectId);
        String taskId = SqlParamUtil.blankIfAll(id);
        String scopedUserId = SqlParamUtil.blankIfAll(userId);
        String assignee = SqlParamUtil.blankIfAll(assigneeScope);
        String relation = SqlParamUtil.blankIfAll(relationScope);
        String statusScopeValue = SqlParamUtil.blankIfAll(statusScope);
        List<String> completed = completedStatuses == null ? List.of() : completedStatuses.stream().filter(value -> value != null && !value.isBlank()).toList();
        List<TaskDto> items = enrichTaskSummaries(taskMapper.pageRows(like, st, cat, customer, project, taskId, scopedUserId, assignee, relation, statusScopeValue, completed, size, PageParamUtil.offset(current, size)));
        long total = taskMapper.countRows(like, st, cat, customer, project, taskId, scopedUserId, assignee, relation, statusScopeValue, completed);
        return PageResult.of(items, total, current, size);
    }

    private List<TaskDto> enrichTasks(List<TaskEntity> tasks) {
        if (tasks.isEmpty()) {
            return List.of();
        }
        List<String> taskIds = tasks.stream().map(TaskEntity::getId).toList();
        Map<String, List<String>> assignees = groupRelatedStrings(taskMapper.assigneesForTasks(taskIds));
        Map<String, List<String>> assigneeIds = groupRelatedStrings(taskMapper.assigneeIdsForTasks(taskIds));
        Map<String, List<String>> participants = groupRelatedStrings(taskMapper.participantsForTasks(taskIds));
        Map<String, List<String>> participantIds = groupRelatedStrings(taskMapper.participantIdsForTasks(taskIds));
        Map<String, List<TaskAttachmentEntity>> attachments = taskMapper.attachmentsForTasks(taskIds).stream()
                .collect(Collectors.groupingBy(TaskAttachmentEntity::getTaskId));
        Map<String, List<TaskCommentEntity>> comments = taskMapper.commentsForTasks(taskIds).stream()
                .collect(Collectors.groupingBy(TaskCommentEntity::getTaskId));
        return tasks.stream()
                .map(task -> taskConverter.toTaskDto(
                        task,
                        assignees.getOrDefault(task.getId(), List.of()),
                        assigneeIds.getOrDefault(task.getId(), List.of()),
                        participants.getOrDefault(task.getId(), List.of()),
                        participantIds.getOrDefault(task.getId(), List.of()),
                        attachments.getOrDefault(task.getId(), List.of()),
                        comments.getOrDefault(task.getId(), List.of())
                ))
                .toList();
    }

    private List<TaskDto> enrichTaskSummaries(List<TaskEntity> tasks) {
        if (tasks.isEmpty()) {
            return List.of();
        }
        List<String> taskIds = tasks.stream().map(TaskEntity::getId).toList();
        Map<String, List<String>> assignees = groupRelatedStrings(taskMapper.assigneesForTasks(taskIds));
        Map<String, List<String>> assigneeIds = groupRelatedStrings(taskMapper.assigneeIdsForTasks(taskIds));
        Map<String, List<String>> participants = groupRelatedStrings(taskMapper.participantsForTasks(taskIds));
        Map<String, List<String>> participantIds = groupRelatedStrings(taskMapper.participantIdsForTasks(taskIds));
        return tasks.stream()
                .map(task -> taskConverter.toTaskSummaryDto(
                        task,
                        assignees.getOrDefault(task.getId(), List.of()),
                        assigneeIds.getOrDefault(task.getId(), List.of()),
                        participants.getOrDefault(task.getId(), List.of()),
                        participantIds.getOrDefault(task.getId(), List.of())
                ))
                .toList();
    }

    @Override
    public TaskDto detail(String id) {
        TaskEntity task = taskMapper.load(id);
        if (task == null) {
            throw new IllegalArgumentException("任务不存在");
        }
        return enrichTask(task);
    }

    @Override
    @Transactional
    public TaskDto create(TaskRequest request) {
        String id = request.id() == null || request.id().isBlank() ? IdUtil.nanoId("task") : request.id();
        String customerId = SqlParamUtil.stringOrNull(request.customerId());
        String taskNo = nextTaskNo(customerId);
        UserLookupEntity creator = requireUser(request.creator(), "任务创建者");
        TaskWriteCommand command = TaskWriteCommand.from(
                id,
                taskNo,
                request,
                SqlParamUtil.stringOrNull(request.projectId()),
                SqlParamUtil.stringOrNull(request.stageId()),
                customerId,
                creator.getId(),
                creator.getName()
        );
        taskMapper.insert(command);
        replacePeople(id, request);
        publishTaskCreatedEvent(id, taskNo, request);
        return detail(id);
    }

    @Override
    @Transactional
    public TaskDto update(String id, TaskRequest request) {
        TaskEntity before = taskMapper.load(id);
        if (before == null) {
            throw new IllegalArgumentException("任务不存在");
        }
        UserLookupEntity creator = requireUser(request.creator(), "任务创建者");
        TaskWriteCommand command = TaskWriteCommand.from(
                id,
                null,
                request,
                SqlParamUtil.stringOrNull(request.projectId()),
                SqlParamUtil.stringOrNull(request.stageId()),
                SqlParamUtil.stringOrNull(request.customerId()),
                creator.getId(),
                creator.getName()
        );
        taskMapper.updateTask(command);
        replacePeople(id, request);
        syncRequirementByTaskStatus(id, request.status());
        publishCustomerPortalTaskUpdate(before, request);
        return detail(id);
    }

    @Override
    public boolean delete(String id) {
        taskMapper.deleteById(id);
        return true;
    }

    @Override
    public PageResult<TaskCommentDto> comments(String id, Integer page, Integer pageSize) {
        if (taskMapper.load(id) == null) {
            throw new IllegalArgumentException("任务不存在");
        }
        int current = PageParamUtil.page(page);
        int size = Math.min(PageParamUtil.pageSize(pageSize), 50);
        List<TaskCommentDto> items = taskMapper.commentsPage(id, size, PageParamUtil.offset(current, size))
                .stream()
                .map(taskConverter::toCommentDto)
                .toList();
        long total = taskMapper.commentCount(id);
        return PageResult.of(items, total, current, size);
    }

    @Override
    @Transactional
    public TaskDto addComment(String id, TaskCommentRequest request) {
        TaskEntity task = taskMapper.load(id);
        if (task == null) {
            throw new IllegalArgumentException("任务不存在");
        }
        boolean hasText = request.content() != null && !request.content().isBlank();
        boolean hasFiles = request.attachments() != null && !request.attachments().isEmpty();
        if (!hasText && !hasFiles) {
            throw new IllegalArgumentException("评论内容或附件不能为空");
        }
        String author = ValidationUtil.requireText(request.author(), "评论作者", 64);
        String commentType = request.normalizedCommentType();
        if (request.external() && (task.getCustomerId() == null || task.getCustomerId().isBlank())) {
            throw new IllegalArgumentException("外部留言必须关联具体客户任务");
        }
        taskMapper.insertComment(IdUtil.nanoId("tc"), id, author, commentType, request.content(), request.safeAttachments());
        if (request.external()) {
            publishExternalCommentToCustomer(task, author, request.content());
        }
        return detail(id);
    }

    @Override
    public TaskDto addAttachment(String id, FileMetadataRequest request) {
        taskMapper.insertAttachment(IdUtil.nanoId("ta"), id, request);
        return detail(id);
    }

    @Override
    public TaskDto deleteAttachment(String id, String attachmentId) {
        taskMapper.deleteAttachment(id, attachmentId);
        return detail(id);
    }

    private TaskDto enrichTask(TaskEntity task) {
        String id = task.getId();
        return taskConverter.toTaskDto(
                task,
                taskMapper.assignees(id),
                taskMapper.assigneeIds(id),
                taskMapper.participants(id),
                taskMapper.participantIds(id),
                taskMapper.attachments(id),
                taskMapper.comments(id)
        );
    }

    private Map<String, List<String>> groupRelatedStrings(List<TaskRelatedStringEntity> rows) {
        return rows.stream()
                .collect(Collectors.groupingBy(
                        TaskRelatedStringEntity::getTaskId,
                        Collectors.mapping(TaskRelatedStringEntity::getValue, Collectors.toList())
                ));
    }

    private void replacePeople(String taskId, TaskRequest request) {
        taskMapper.deleteAssignees(taskId);
        for (String name : request.safeAssignees()) {
            UserLookupEntity user = requireUser(name, "执行者");
            taskMapper.insertAssignee(taskId, user.getId(), user.getName());
        }
        taskMapper.deleteParticipants(taskId);
        for (String name : request.safeParticipants()) {
            UserLookupEntity user = requireUser(name, "参与者");
            taskMapper.insertParticipant(taskId, user.getId(), user.getName());
        }
    }

    private void publishCustomerPortalTaskUpdate(TaskEntity before, TaskRequest request) {
        if (before.getCustomerId() == null || before.getCustomerId().isBlank()) {
            return;
        }
        String oldStatus = before.getStatus() == null ? "" : before.getStatus();
        String newStatus = request.status() == null ? "" : request.status();
        if (!oldStatus.equals(newStatus)) {
            taskMapper.insertPortalMessagesForTaskUpdate(
                    before.getId(),
                    "任务状态更新：" + before.getTaskNo(),
                    "任务“" + before.getTitle() + "”状态已从“" + oldStatus + "”更新为“" + newStatus + "”。"
            );
        }
    }

    private void publishExternalCommentToCustomer(TaskEntity task, String author, String content) {
        String title = "任务外部留言：" + firstNonBlank(task.getTaskNo(), task.getTitle(), task.getId());
        String body = "Kozen 团队成员 " + author + " 在任务“" + firstNonBlank(task.getTitle(), task.getTaskNo(), task.getId()) + "”中发布了外部留言：\n" + firstNonBlank(content, "请登录客户门户查看详情。");
        taskMapper.insertPortalMessagesForExternalComment(task.getId(), title, body);
        taskMapper.insertCustomerEmailOutboxForExternalComment(task.getId(), title, body);
    }

    private void publishTaskCreatedEvent(String taskId, String taskNo, TaskRequest request) {
        List<String> recipients = request.safeAssignees().stream()
                .map(person -> requireUser(person, "通知接收人"))
                .map(UserLookupEntity::getId)
                .distinct()
                .toList();
        if (recipients.isEmpty()) {
            return;
        }
        taskMapper.insertNotificationEvent(
                IdUtil.numericId(),
                "TASK_CREATED",
                taskId,
                "新任务已分配",
                "任务 " + taskNo + "：" + request.title() + " 已创建并分配给你。",
                JsonUtil.toJson(recipients)
        );
    }

    private UserLookupEntity requireUser(Object accountOrName, String label) {
        if (accountOrName == null || String.valueOf(accountOrName).isBlank()) {
            throw new IllegalArgumentException(label + "必须从已有用户中选择");
        }
        List<UserLookupEntity> users = taskMapper.usersByAccountOrName(accountOrName);
        if (users.isEmpty()) {
            throw new IllegalArgumentException(label + "不存在，请从已有用户中选择");
        }
        return users.getFirst();
    }

    private void syncRequirementByTaskStatus(String taskId, String status) {
        String semantic = taskMapper.enumSemantic("task_status", status);
        if ("完成".equals(semantic) || "拒绝".equals(semantic)) {
            String requirementStatus = taskMapper.enumValueBySemantic("requirement_status", semantic);
            if (requirementStatus == null || requirementStatus.isBlank()) {
                throw new IllegalArgumentException("需求状态未配置语义：" + semantic);
            }
            taskMapper.syncRequirement(taskId, requirementStatus);
        }
    }

    private String nextTaskNo(String customerId) {
        String prefix = "N";
        if (customerId != null) {
            String shortName = taskMapper.customerShortName(customerId);
            if (shortName != null && !shortName.isBlank()) {
                prefix = shortName.trim().toUpperCase();
            }
        }
        Long next = taskMapper.nextTaskNumber();
        return prefix + (next == null ? 1 : next);
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) return value.trim();
        }
        return "";
    }
}

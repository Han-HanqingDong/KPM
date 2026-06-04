package com.kozen.kpm.task.service.impl;

import com.kozen.kpm.common.dto.FileMetadataRequest;
import com.kozen.kpm.common.util.IdUtil;
import com.kozen.kpm.common.util.JsonUtil;
import com.kozen.kpm.common.util.SqlParamUtil;
import com.kozen.kpm.common.util.ValidationUtil;
import com.kozen.kpm.task.converter.TaskConverter;
import com.kozen.kpm.task.dto.TaskCommentRequest;
import com.kozen.kpm.task.dto.TaskDto;
import com.kozen.kpm.task.dto.TaskRequest;
import com.kozen.kpm.task.dto.TaskWriteCommand;
import com.kozen.kpm.task.entity.TaskEntity;
import com.kozen.kpm.task.entity.UserLookupEntity;
import com.kozen.kpm.task.mapper.TaskMapper;
import com.kozen.kpm.task.service.TaskService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
        return taskMapper.list(like, st, cat).stream()
                .map(this::enrichTask)
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
        return detail(id);
    }

    @Override
    public boolean delete(String id) {
        taskMapper.deleteById(id);
        return true;
    }

    @Override
    public TaskDto addComment(String id, TaskCommentRequest request) {
        boolean hasText = request.content() != null && !request.content().isBlank();
        boolean hasFiles = request.attachments() != null && !request.attachments().isEmpty();
        if (!hasText && !hasFiles) {
            throw new IllegalArgumentException("评论内容或附件不能为空");
        }
        String author = ValidationUtil.requireText(request.author(), "评论作者", 64);
        taskMapper.insertComment(IdUtil.nanoId("tc"), id, author, request.content(), request.safeAttachments());
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
                IdUtil.nanoId("evt"),
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
}

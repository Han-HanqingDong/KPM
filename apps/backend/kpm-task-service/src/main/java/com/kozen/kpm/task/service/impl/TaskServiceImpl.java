package com.kozen.kpm.task.service.impl;

import com.kozen.kpm.common.dto.FileMetadataRequest;
import com.kozen.kpm.common.util.IdUtil;
import com.kozen.kpm.common.util.JsonUtil;
import com.kozen.kpm.common.util.SqlParamUtil;
import com.kozen.kpm.common.util.ValidationUtil;
import com.kozen.kpm.task.dto.TaskCommentRequest;
import com.kozen.kpm.task.dto.TaskRequest;
import com.kozen.kpm.task.mapper.TaskMapper;
import com.kozen.kpm.task.service.TaskService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/** Default task service implementation. */
@Service
public class TaskServiceImpl implements TaskService {
    private final TaskMapper taskMapper;
    public TaskServiceImpl(TaskMapper taskMapper) { this.taskMapper = taskMapper; }

    @Override
    public List<Map<String, Object>> list(String keyword, String status, String category) {
        String like = SqlParamUtil.likeOrBlank(keyword);
        String st = SqlParamUtil.blankIfAll(status);
        String cat = SqlParamUtil.blankIfAll(category);
        List<Map<String, Object>> rows = taskMapper.list(like, st, cat);
        rows.forEach(this::enrichTask);
        return rows;
    }

    @Override
    public Map<String, Object> detail(String id) { Map<String, Object> task = taskMapper.load(id); enrichTask(task); return task; }

    @Override
    @Transactional
    public Map<String, Object> create(TaskRequest request) {
        Map<String, Object> body = request.toMap();
        String id = request.id() == null || request.id().isBlank() ? nextTaskId() : request.id();
        Map<String, Object> creator = requireUser(request.creator(), "任务创建者");
        taskMapper.insert(id, body, SqlParamUtil.stringOrNull(request.projectId()), SqlParamUtil.stringOrNull(request.stageId()), SqlParamUtil.stringOrNull(request.customerId()), String.valueOf(creator.get("id")), String.valueOf(creator.get("name")));
        replacePeople(id, request);
        publishTaskCreatedEvent(id, request);
        return detail(id);
    }

    @Override
    @Transactional
    public Map<String, Object> update(String id, TaskRequest request) {
        Map<String, Object> body = request.toMap();
        taskMapper.updateTask(id, body, SqlParamUtil.stringOrNull(request.projectId()), SqlParamUtil.stringOrNull(request.stageId()), SqlParamUtil.stringOrNull(request.customerId()));
        replacePeople(id, request);
        syncRequirementByTaskStatus(id, request.status());
        return detail(id);
    }

    @Override
    public boolean delete(String id) { taskMapper.deleteById(id); return true; }

    @Override
    public Map<String, Object> addComment(String id, TaskCommentRequest request) {
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
    public Map<String, Object> addAttachment(String id, FileMetadataRequest request) {
        taskMapper.insertAttachment(IdUtil.nanoId("ta"), id, request.toMap());
        return detail(id);
    }

    private void enrichTask(Map<String, Object> task) {
        String id = String.valueOf(task.get("id"));
        task.put("assignees", taskMapper.assignees(id));
        task.put("participants", taskMapper.participants(id));
        task.put("attachments", taskMapper.attachments(id));
        task.put("comments", taskMapper.comments(id));
    }

    private void replacePeople(String taskId, TaskRequest request) {
        taskMapper.deleteAssignees(taskId);
        for (String name : request.safeAssignees()) {
            Map<String, Object> user = requireUser(name, "执行者");
            taskMapper.insertAssignee(taskId, String.valueOf(user.get("id")), user.get("name"));
        }
        taskMapper.deleteParticipants(taskId);
        for (String name : request.safeParticipants()) {
            Map<String, Object> user = requireUser(name, "参与者");
            taskMapper.insertParticipant(taskId, String.valueOf(user.get("id")), user.get("name"));
        }
    }

    private void publishTaskCreatedEvent(String taskId, TaskRequest request) {
        List<String> recipients = request.safeAssignees().stream()
                .map(person -> requireUser(person, "通知接收人"))
                .map(user -> String.valueOf(user.get("id")))
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
                "任务 " + taskId + "：" + request.title() + " 已创建并分配给你。",
                JsonUtil.toJson(recipients)
        );
    }

    private Map<String, Object> requireUser(Object accountOrName, String label) {
        if (accountOrName == null || String.valueOf(accountOrName).isBlank()) {
            throw new IllegalArgumentException(label + "必须从已有用户中选择");
        }
        List<Map<String, Object>> users = taskMapper.usersByAccountOrName(accountOrName);
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

    private String nextTaskId() {
        Integer max = taskMapper.maxTaskNumber();
        return "KPM-" + ((max == null ? 100 : max) + 1);
    }
}

package com.kozen.kpm.task.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Schema(description = "任务保存请求")
public record TaskRequest(
        String id,
        @NotBlank(message = "任务标题不能为空")
        @Size(max = 120, message = "任务标题不能超过120个字符")
        String title,
        @Size(max = 3000, message = "任务描述不能超过3000个字符")
        String description,
        @Size(max = 80, message = "项目ID不能超过80个字符")
        String projectId,
        @Size(max = 80, message = "阶段ID不能超过80个字符")
        String stageId,
        @Size(max = 80, message = "客户ID不能超过80个字符")
        String customerId,
        @NotBlank(message = "任务分类不能为空")
        @Size(max = 40, message = "任务分类不能超过40个字符")
        String category,
        @NotBlank(message = "任务状态不能为空")
        @Size(max = 40, message = "任务状态不能超过40个字符")
        String status,
        @NotBlank(message = "优先级不能为空")
        @Size(max = 20, message = "优先级不能超过20个字符")
        String priority,
        @NotBlank(message = "创建人不能为空")
        @Size(max = 60, message = "创建人不能超过60个字符")
        String creator,
        @Pattern(regexp = "^$|\\d{4}-\\d{2}-\\d{2}$", message = "预期完成时间必须是YYYY-MM-DD格式")
        String expectedCompletionAt,
        @Pattern(regexp = "^$|\\d{4}-\\d{2}-\\d{2}$", message = "截止时间必须是YYYY-MM-DD格式")
        String dueDate,
        @Size(max = 80, message = "任务来源不能超过80个字符")
        String source,
        Boolean blocked,
        @Size(max = 30, message = "执行者不能超过30人")
        List<String> assignees,
        @Size(max = 50, message = "参与者不能超过50人")
        List<String> participants
) {
    public List<String> safeAssignees() { return assignees == null ? List.of() : assignees; }
    public List<String> safeParticipants() { return participants == null ? List.of() : participants; }

    public Map<String, Object> toMap() {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", id);
        map.put("title", title);
        map.put("description", description);
        map.put("projectId", projectId);
        map.put("stageId", stageId);
        map.put("customerId", customerId);
        map.put("category", category);
        map.put("status", status);
        map.put("priority", priority);
        map.put("creator", creator);
        map.put("expectedCompletionAt", expectedCompletionAt == null || expectedCompletionAt.isBlank() ? null : expectedCompletionAt);
        map.put("dueDate", dueDate == null || dueDate.isBlank() ? null : dueDate);
        map.put("source", source == null || source.isBlank() ? "任务管理" : source);
        map.put("blocked", blocked != null && blocked);
        map.put("assignees", safeAssignees());
        map.put("participants", safeParticipants());
        return map;
    }
}

package com.kozen.kpm.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.LinkedHashMap;
import java.util.Map;

public record RequirementRequest(
        @NotBlank(message = "需求标题不能为空") @Size(max = 120, message = "需求标题不能超过120个字符") String title,
        @NotBlank(message = "用户故事不能为空") @Size(max = 1500, message = "用户故事不能超过1500个字符") String userStory,
        @NotBlank(message = "业务价值不能为空") @Size(max = 1000, message = "业务价值不能超过1000个字符") String businessValue,
        @NotBlank(message = "验收标准不能为空") @Size(max = 1500, message = "验收标准不能超过1500个字符") String acceptance,
        @NotBlank(message = "优先级不能为空") @Size(max = 20, message = "优先级不能超过20个字符") String priority,
        @Size(max = 40, message = "需求状态不能超过40个字符") String status,
        @Size(max = 60, message = "提出人不能超过60个字符") String proposer,
        @Size(max = 60, message = "创建人不能超过60个字符") String creator,
        Boolean createTask
) {
    public Map<String, Object> toMap() {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("title", title);
        map.put("userStory", userStory);
        map.put("businessValue", businessValue);
        map.put("acceptance", acceptance);
        map.put("priority", priority);
        map.put("status", status == null || status.isBlank() ? "待评估" : status);
        map.put("proposer", proposer);
        map.put("creator", creator);
        map.put("createTask", createTask == null || createTask);
        return map;
    }
}

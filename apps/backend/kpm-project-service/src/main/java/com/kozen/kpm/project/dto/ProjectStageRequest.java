package com.kozen.kpm.project.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public record ProjectStageRequest(
        @Size(max = 80, message = "阶段ID不能超过80个字符") String id,
        @NotBlank(message = "阶段名称不能为空")
        @Size(max = 80, message = "阶段名称不能超过80个字符") String name,
        @Size(max = 40, message = "阶段状态不能超过40个字符") String status,
        @Valid @Size(max = 30, message = "阶段负责人不能超过30项") List<StageAssigneeRequest> assignees
) {
    public List<StageAssigneeRequest> safeAssignees() { return assignees == null ? List.of() : assignees; }
    public Map<String, Object> toMap() {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", id);
        map.put("name", name);
        map.put("status", status == null || status.isBlank() ? "未开始" : status);
        map.put("assignees", safeAssignees().stream().map(StageAssigneeRequest::toMap).toList());
        return map;
    }
}

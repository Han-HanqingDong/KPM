package com.kozen.kpm.project.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ProjectStageRequest(
        @Size(max = 80, message = "阶段ID不能超过80个字符") String id,
        @NotBlank(message = "阶段名称不能为空")
        @Size(max = 80, message = "阶段名称不能超过80个字符") String name,
        @Valid @Size(max = 30, message = "阶段负责人不能超过30项") List<StageAssigneeRequest> assignees
) {
    public List<StageAssigneeRequest> safeAssignees() { return assignees == null ? List.of() : assignees; }
}

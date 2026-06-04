package com.kozen.kpm.project.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;

import java.util.List;

public record StageAssigneesRequest(
        @Valid @Size(max = 30, message = "阶段负责人不能超过30项") List<StageAssigneeRequest> assignees
) {
    public List<StageAssigneeRequest> safeAssignees() { return assignees == null ? List.of() : assignees; }
}

package com.kozen.kpm.resource.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "部门保存请求")
public record DepartmentRequest(
        @NotBlank(message = "部门名称不能为空")
        @Size(max = 40, message = "部门名称不能超过40个字符")
        String name,
        @Size(max = 20, message = "部门状态不能超过20个字符")
        String status
) {
    public String normalizedStatus() { return status == null || status.isBlank() ? "启用" : status.trim(); }
}

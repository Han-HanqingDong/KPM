package com.kozen.kpm.resource.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

@Schema(description = "角色保存请求")
public record RoleRequest(
        @NotBlank(message = "角色名称不能为空")
        @Size(max = 40, message = "角色名称不能超过40个字符")
        String name,
        @Size(max = 40, message = "角色类型不能超过40个字符")
        String roleType,
        @Size(max = 20, message = "角色状态不能超过20个字符")
        String status,
        @Size(max = 300, message = "角色权限不能超过300项")
        List<String> permissions
) {
    public String normalizedRoleType() { return roleType == null || roleType.isBlank() ? "项目内角色" : roleType.trim(); }
    public String normalizedStatus() { return status == null || status.isBlank() ? "启用" : status.trim(); }
    public List<String> safePermissions() { return permissions == null ? List.of() : permissions; }
}

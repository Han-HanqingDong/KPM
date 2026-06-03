package com.kozen.kpm.resource.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

@Schema(description = "用户保存请求。登录账号默认等于邮箱。")
public record UserRequest(
        @Schema(description = "姓名", example = "张敏")
        @NotBlank(message = "姓名不能为空")
        @Size(max = 40, message = "姓名不能超过40个字符")
        String name,

        @Schema(description = "登录账号；为空时默认使用邮箱", example = "admin@kozenmobile.com")
        @Email(message = "账号必须是邮箱格式")
        @Size(max = 128, message = "账号不能超过128个字符")
        String account,

        @Schema(description = "邮箱，同时作为默认登录账号", example = "admin@kozenmobile.com")
        @NotBlank(message = "邮箱不能为空")
        @Email(message = "邮箱格式不正确")
        @Size(max = 128, message = "邮箱不能超过128个字符")
        String email,

        @Size(max = 20, message = "所属部门不能超过20项")
        List<String> departments,

        @Size(max = 20, message = "角色不能超过20项")
        List<String> globalRoles,

        @Size(max = 200, message = "直接权限不能超过200项")
        List<String> directPermissions,

        @Size(max = 20, message = "状态不能超过20个字符")
        String status
) {
    public String loginAccount() {
        String explicit = account == null ? "" : account.trim();
        return explicit.isBlank() ? email.trim() : explicit;
    }

    public String normalizedEmail() {
        return email == null ? "" : email.trim();
    }

    public String normalizedStatus() {
        return status == null || status.isBlank() ? "启用" : status.trim();
    }

    public List<String> safeDepartments() { return departments == null ? List.of() : departments; }
    public List<String> safeGlobalRoles() { return globalRoles == null ? List.of("普通员工") : globalRoles; }
    public List<String> safeDirectPermissions() { return directPermissions == null ? List.of() : directPermissions; }
}

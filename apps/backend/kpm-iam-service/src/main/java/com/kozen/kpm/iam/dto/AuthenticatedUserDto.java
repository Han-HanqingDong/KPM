package com.kozen.kpm.iam.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "当前登录用户信息和权限聚合结果")
public record AuthenticatedUserDto(
        @Schema(description = "用户ID", example = "user-admin")
        String id,

        @Schema(description = "登录账号，KPM V1 默认为邮箱", example = "admin@kozenmobile.com")
        String account,

        @Schema(description = "用户邮箱", example = "admin@kozenmobile.com")
        String email,

        @Schema(description = "用户显示名称", example = "系统管理员")
        String name,

        @Schema(description = "账号状态", example = "启用")
        String status,

        @Schema(description = "用户所属部门名称列表")
        List<String> departments,

        @Schema(description = "用户拥有的角色名称列表")
        List<String> roles,

        @Schema(description = "用户最终生效的权限编码列表")
        List<String> permissions
) {}

package com.kozen.kpm.resource.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "用户管理列表项")
public record UserResourceDto(
        String id,
        String account,
        String email,
        String name,
        String status,
        LocalDateTime createdAt,
        List<String> departments,
        List<String> globalRoles,
        List<String> directPermissions,
        @Schema(description = "仅在新增或重置密码时返回") String defaultPassword
) {}

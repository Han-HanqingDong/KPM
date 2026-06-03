package com.kozen.kpm.resource.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "角色管理列表项")
public record RoleDto(String id, String name, String roleType, String status, List<String> permissions) {}

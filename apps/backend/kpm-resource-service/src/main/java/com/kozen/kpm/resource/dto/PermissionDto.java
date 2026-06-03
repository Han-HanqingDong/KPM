package com.kozen.kpm.resource.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "系统自动生成的菜单/按钮权限")
public record PermissionDto(String id, String code, String name, String permissionType, String target, String location) {}

package com.kozen.kpm.resource.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "资源管理启动数据")
public record ResourceBootstrapDto(
        List<UserResourceDto> users,
        List<DepartmentDto> departments,
        List<RoleDto> roles,
        List<PermissionDto> permissions,
        List<EnumItemDto> enumItems,
        List<TaskStatusTransitionDto> taskStatusTransitions
) {}

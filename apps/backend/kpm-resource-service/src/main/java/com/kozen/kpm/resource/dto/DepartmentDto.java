package com.kozen.kpm.resource.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "部门管理列表项")
public record DepartmentDto(String id, String name, String status, Integer userCount) {}

package com.kozen.kpm.resource.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "任务状态流转规则")
public record TaskStatusTransitionDto(String id, String fromStatus, String toStatus) {}

package com.kozen.kpm.resource.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "任务状态流转保存请求")
public record TaskStatusTransitionRequest(
        @NotBlank(message = "起始状态不能为空")
        @Size(max = 64, message = "起始状态不能超过64个字符")
        String fromStatus,
        @NotBlank(message = "目标状态不能为空")
        @Size(max = 64, message = "目标状态不能超过64个字符")
        String toStatus
) {}

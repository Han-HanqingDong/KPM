package com.kozen.kpm.customer.portal.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "客户门户创建任务请求")
public record CustomerPortalTaskRequest(
        @NotBlank(message = "项目不能为空")
        String projectId,
        @NotBlank(message = "任务标题不能为空")
        @Size(max = 120, message = "任务标题不能超过120个字符")
        String title,
        @NotBlank(message = "任务描述不能为空")
        @Size(max = 3000, message = "任务描述不能超过3000个字符")
        String description,
        @Size(max = 40, message = "优先级不能超过40个字符")
        String priority
) {}

package com.kozen.kpm.customer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "客户通知发送请求")
public record CustomerNotificationRequest(
        @NotBlank(message = "通知标题不能为空")
        @Size(max = 120, message = "通知标题不能超过120个字符")
        String title,
        @NotBlank(message = "通知内容不能为空")
        @Size(max = 3000, message = "通知内容不能超过3000个字符")
        String content
) {}

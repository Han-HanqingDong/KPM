package com.kozen.kpm.customer.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "客户通知发送结果")
public record CustomerNotificationResultDto(
        String customerId,
        int contactCount,
        int portalMessageCount,
        int emailAttemptCount
) {}

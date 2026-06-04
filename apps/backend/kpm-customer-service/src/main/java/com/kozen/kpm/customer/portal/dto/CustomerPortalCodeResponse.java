package com.kozen.kpm.customer.portal.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "客户门户验证码发送结果")
public record CustomerPortalCodeResponse(
        boolean sent,
        long expiresInSeconds,
        String message,
        String debugCode
) {}

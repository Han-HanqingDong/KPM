package com.kozen.kpm.customer.portal.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "客户门户登录响应")
public record CustomerPortalLoginResponse(
        String token,
        String tokenType,
        long expiresIn,
        CustomerPortalMeDto user
) {}

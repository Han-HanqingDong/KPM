package com.kozen.kpm.iam.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "登录成功响应")
public record LoginResponseDto(
        @Schema(description = "访问令牌")
        String token,

        @Schema(description = "令牌类型", example = "Bearer")
        String tokenType,

        @Schema(description = "令牌有效期，单位秒", example = "28800")
        long expiresIn,

        @Schema(description = "当前登录用户信息")
        AuthenticatedUserDto user
) {}

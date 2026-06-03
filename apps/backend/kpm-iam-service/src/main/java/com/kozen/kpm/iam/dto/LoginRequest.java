package com.kozen.kpm.iam.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "登录请求。KPM V1 约定登录账号使用邮箱。")
public record LoginRequest(
        @Schema(description = "登录邮箱", example = "admin@kozenmobile.com")
        @NotBlank(message = "登录邮箱不能为空")
        @Email(message = "登录账号必须是邮箱格式")
        @Size(max = 128, message = "登录邮箱不能超过128个字符")
        String account,

        @Schema(description = "密码", example = "123456")
        @NotBlank(message = "密码不能为空")
        @Size(max = 128, message = "密码不能超过128个字符")
        String password
) {}

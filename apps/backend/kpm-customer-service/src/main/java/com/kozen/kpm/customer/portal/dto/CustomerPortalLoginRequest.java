package com.kozen.kpm.customer.portal.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Schema(description = "客户门户验证码登录请求")
public record CustomerPortalLoginRequest(
        @NotBlank(message = "邮箱不能为空")
        @Email(message = "邮箱格式不正确")
        @Size(max = 120, message = "邮箱不能超过120个字符")
        String email,
        @NotBlank(message = "验证码不能为空")
        @Pattern(regexp = "^[A-Za-z0-9]{6}$", message = "验证码必须为6位字母或数字")
        String code
) {}

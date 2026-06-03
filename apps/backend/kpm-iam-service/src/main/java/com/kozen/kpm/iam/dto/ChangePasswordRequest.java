package com.kozen.kpm.iam.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "修改密码请求")
public record ChangePasswordRequest(
        @Schema(description = "登录邮箱。网关已传入 X-KPM-Account 时可不填。")
        @Email(message = "登录账号必须是邮箱格式")
        @Size(max = 128, message = "登录邮箱不能超过128个字符")
        String account,

        @NotBlank(message = "原密码不能为空")
        @Size(max = 128, message = "原密码不能超过128个字符")
        String oldPassword,

        @NotBlank(message = "新密码不能为空")
        @Size(min = 6, max = 128, message = "新密码长度必须在6到128位之间")
        String newPassword
) {
    public ChangePasswordRequest withAccount(String nextAccount) {
        return new ChangePasswordRequest(nextAccount, oldPassword, newPassword);
    }
}

package com.kozen.kpm.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.LinkedHashMap;
import java.util.Map;

public record ProjectMemberRequest(
        @NotBlank(message = "项目成员账号不能为空")
        @Size(max = 128, message = "项目成员账号不能超过128个字符")
        String userAccount,
        @NotBlank(message = "项目成员角色不能为空")
        @Size(max = 60, message = "项目成员角色不能超过60个字符")
        String role
) {
    public Map<String, Object> toMap() {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("userAccount", userAccount);
        map.put("role", role);
        return map;
    }
}

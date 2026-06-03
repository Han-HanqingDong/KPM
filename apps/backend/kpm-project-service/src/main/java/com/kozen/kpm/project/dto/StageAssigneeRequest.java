package com.kozen.kpm.project.dto;

import jakarta.validation.constraints.Size;

import java.util.LinkedHashMap;
import java.util.Map;

public record StageAssigneeRequest(
        @Size(max = 20, message = "负责人类型不能超过20个字符") String type,
        @Size(max = 128, message = "负责人名称不能超过128个字符") String name,
        @Size(max = 128, message = "负责人账号不能超过128个字符") String account
) {
    public Map<String, Object> toMap() {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("type", type == null || type.isBlank() ? "user" : type);
        map.put("name", name);
        map.put("account", account);
        return map;
    }
}

package com.kozen.kpm.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public record ProcessTemplateRequest(
        @NotBlank(message = "模板名称不能为空") @Size(max = 80, message = "模板名称不能超过80个字符") String name,
        @NotBlank(message = "适用范围不能为空") @Size(max = 120, message = "适用范围不能超过120个字符") String scope,
        @Size(max = 20, message = "模板状态不能超过20个字符") String status,
        @Size(max = 80, message = "模板阶段不能超过80项") List<String> stages
) {
    public List<String> safeStages() { return stages == null ? List.of() : stages; }
    public Map<String, Object> toMap() {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("name", name);
        map.put("scope", scope);
        map.put("status", status == null || status.isBlank() ? "草稿" : status);
        map.put("stages", safeStages());
        return map;
    }
}

package com.kozen.kpm.project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.LinkedHashMap;
import java.util.Map;

@Schema(description = "项目 SKU 保存请求")
public record ProjectSkuRequest(
        @NotBlank(message = "整机料号不能为空")
        @Size(max = 120, message = "整机料号不能超过120个字符")
        String wholeMachinePartNumber,

        @NotBlank(message = "配置名称不能为空")
        @Size(max = 160, message = "配置名称不能超过160个字符")
        String configurationName,

        @NotBlank(message = "内存类型不能为空")
        @Size(max = 120, message = "内存类型不能超过120个字符")
        String memoryType,

        Boolean active
) {
    public Map<String, Object> toMap() {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("wholeMachinePartNumber", wholeMachinePartNumber);
        map.put("configurationName", configurationName);
        map.put("memoryType", memoryType);
        map.put("active", active == null || active);
        return map;
    }
}

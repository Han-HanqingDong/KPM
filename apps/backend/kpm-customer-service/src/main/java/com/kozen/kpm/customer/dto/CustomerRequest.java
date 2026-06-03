package com.kozen.kpm.customer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Schema(description = "客户保存请求")
public record CustomerRequest(
        @NotBlank(message = "客户名称不能为空")
        @Size(max = 120, message = "客户名称不能超过120个字符")
        String name,
        @Size(max = 60, message = "客户简称不能超过60个字符")
        String shortName,
        @NotBlank(message = "国家/区域不能为空")
        @Size(max = 80, message = "国家/区域不能超过80个字符")
        String region,
        @Size(max = 255, message = "详细地址不能超过255个字符")
        String address,
        @Size(max = 60, message = "客户等级不能超过60个字符")
        String level,
        @Size(max = 60, message = "客户状态不能超过60个字符")
        String status,
        @Size(max = 30, message = "负责销售不能超过30人")
        List<String> salesOwners,
        @Size(max = 30, message = "负责技术支持不能超过30人")
        List<String> supportOwners
) {
    public List<String> safeSalesOwners() { return salesOwners == null ? List.of() : salesOwners; }
    public List<String> safeSupportOwners() { return supportOwners == null ? List.of() : supportOwners; }

    public Map<String, Object> toMap() {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("name", name);
        map.put("shortName", shortName == null || shortName.isBlank() ? null : shortName.trim());
        map.put("region", region);
        map.put("address", address);
        map.put("level", level);
        map.put("status", status);
        map.put("salesOwners", safeSalesOwners());
        map.put("supportOwners", safeSupportOwners());
        return map;
    }
}

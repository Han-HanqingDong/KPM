package com.kozen.kpm.resource.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "枚举值保存请求")
public record EnumItemRequest(
        @NotBlank(message = "枚举类型不能为空")
        @Size(max = 64, message = "枚举类型不能超过64个字符")
        String enumType,
        @NotBlank(message = "枚举名称不能为空")
        @Size(max = 80, message = "枚举名称不能超过80个字符")
        String name,
        @Size(max = 80, message = "枚举值不能超过80个字符")
        String value,
        @Size(max = 40, message = "枚举语义不能超过40个字符")
        String semantic,
        Boolean active,
        Integer sortOrder
) {
    public String normalizedValue() { return value == null || value.isBlank() ? name.trim() : value.trim(); }
    public boolean normalizedActive() { return active == null || active; }
    public int normalizedSortOrder() { return sortOrder == null ? 100 : sortOrder; }
}

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
        @Size(max = 80, message = "中文显示不能超过80个字符")
        String labelZh,
        @Size(max = 80, message = "英文显示不能超过80个字符")
        String labelEn,
        @Size(max = 12, message = "中文短标签不能超过12个字符")
        String shortLabelZh,
        @Size(max = 12, message = "英文短标签不能超过12个字符")
        String shortLabelEn,
        @Size(max = 40, message = "枚举语义不能超过40个字符")
        String semantic,
        Boolean active,
        Integer sortOrder
) {
    public String normalizedValue() { return value == null || value.isBlank() ? name.trim() : value.trim(); }
    public String normalizedLabelZh() { return labelZh == null || labelZh.isBlank() ? name.trim() : labelZh.trim(); }
    public String normalizedLabelEn() { return labelEn == null || labelEn.isBlank() ? name.trim() : labelEn.trim(); }
    public String normalizedShortLabelZh() { return shortLabelZh == null || shortLabelZh.isBlank() ? normalizedLabelZh().substring(0, Math.min(1, normalizedLabelZh().length())) : shortLabelZh.trim(); }
    public String normalizedShortLabelEn() { return shortLabelEn == null || shortLabelEn.isBlank() ? normalizedLabelEn().substring(0, Math.min(1, normalizedLabelEn().length())).toUpperCase() : shortLabelEn.trim(); }
    public boolean normalizedActive() { return active == null || active; }
    public int normalizedSortOrder() { return sortOrder == null ? 100 : sortOrder; }
}

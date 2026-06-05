package com.kozen.kpm.resource.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "资源管理枚举项")
public record EnumItemDto(
        String id,
        String enumType,
        String name,
        String value,
        String labelZh,
        String labelEn,
        String shortLabelZh,
        String shortLabelEn,
        String semantic,
        Boolean active,
        Integer sortOrder
) {}

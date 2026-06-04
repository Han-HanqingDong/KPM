package com.kozen.kpm.customer.portal.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "客户门户批量更新数量")
public record CustomerPortalUpdatedCountDto(int count) {}

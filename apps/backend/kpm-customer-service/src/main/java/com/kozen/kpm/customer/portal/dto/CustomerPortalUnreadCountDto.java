package com.kozen.kpm.customer.portal.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "客户门户未读消息数量")
public record CustomerPortalUnreadCountDto(int count) {}

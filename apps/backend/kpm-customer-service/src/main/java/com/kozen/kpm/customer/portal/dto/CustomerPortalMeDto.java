package com.kozen.kpm.customer.portal.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "客户门户当前联系人")
public record CustomerPortalMeDto(
        String customerId,
        String customerName,
        String customerShortName,
        String contactId,
        String contactName,
        String email
) {}

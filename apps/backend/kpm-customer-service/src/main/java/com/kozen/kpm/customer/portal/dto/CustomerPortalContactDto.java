package com.kozen.kpm.customer.portal.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "客户门户联系人筛选 DTO")
public record CustomerPortalContactDto(
        @Schema(description = "联系人ID") String contactId,
        @Schema(description = "联系人姓名") String contactName,
        @Schema(description = "联系人邮箱") String email
) {
}

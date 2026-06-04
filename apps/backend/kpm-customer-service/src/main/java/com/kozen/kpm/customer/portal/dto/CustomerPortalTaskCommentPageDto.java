package com.kozen.kpm.customer.portal.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "客户门户任务留言分页结果")
public record CustomerPortalTaskCommentPageDto(
        List<CustomerPortalTaskCommentDto> records,
        int page,
        int pageSize,
        long total,
        boolean hasMore
) {}

package com.kozen.kpm.customer.portal.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "客户门户任务外部留言")
public record CustomerPortalTaskCommentDto(
        String id,
        String taskId,
        String author,
        String content,
        Object attachments,
        LocalDateTime createdAt
) {}

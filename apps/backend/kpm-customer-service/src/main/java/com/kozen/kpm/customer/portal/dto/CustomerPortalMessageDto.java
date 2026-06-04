package com.kozen.kpm.customer.portal.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "客户门户消息 DTO")
public record CustomerPortalMessageDto(
        String id,
        String title,
        String content,
        String messageType,
        String projectId,
        String projectName,
        String taskId,
        String announcementId,
        Boolean readFlag,
        LocalDateTime createdAt,
        LocalDateTime readAt
) {}

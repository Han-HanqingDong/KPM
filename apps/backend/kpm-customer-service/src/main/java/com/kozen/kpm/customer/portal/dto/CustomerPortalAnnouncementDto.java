package com.kozen.kpm.customer.portal.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "客户门户公告 DTO")
public record CustomerPortalAnnouncementDto(
        String id,
        String projectId,
        String projectName,
        String announcementType,
        String title,
        String content,
        String publisher,
        LocalDateTime publishedAt
) {}

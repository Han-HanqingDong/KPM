package com.kozen.kpm.project.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "项目公告历史")
public record ProjectAnnouncementDto(
        String id,
        String projectId,
        String announcementType,
        String title,
        String content,
        String publisher,
        LocalDateTime publishedAt,
        String announcementStatus,
        LocalDateTime retractedAt,
        String retractedBy
) {}

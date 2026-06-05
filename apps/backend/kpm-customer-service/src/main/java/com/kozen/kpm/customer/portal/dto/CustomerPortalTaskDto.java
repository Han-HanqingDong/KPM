package com.kozen.kpm.customer.portal.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "客户门户任务 DTO")
public record CustomerPortalTaskDto(
        String id,
        String taskNo,
        String title,
        String description,
        String projectId,
        String projectName,
        String category,
        String categoryLabelZh,
        String categoryLabelEn,
        String categoryShortLabelZh,
        String categoryShortLabelEn,
        String status,
        String priority,
        String creator,
        LocalDate expectedCompletionAt,
        Boolean blocked,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Integer commentCount,
        List<CustomerPortalTaskAttachmentDto> attachments,
        List<CustomerPortalTaskCommentDto> comments
) {}

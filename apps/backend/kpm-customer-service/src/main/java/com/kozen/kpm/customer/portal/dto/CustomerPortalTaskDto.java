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
        String status,
        String priority,
        LocalDate expectedCompletionAt,
        Boolean blocked,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Integer commentCount,
        List<CustomerPortalTaskCommentDto> comments
) {}

package com.kozen.kpm.task.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "任务详情/列表项")
public record TaskDto(
        String id,
        String title,
        String description,
        String projectId,
        String stageId,
        String customerId,
        String projectName,
        String stageName,
        String customerName,
        String category,
        String status,
        String priority,
        String creatorUserId,
        String creator,
        LocalDate expectedCompletionAt,
        LocalDate dueDate,
        String source,
        Boolean blocked,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<String> assignees,
        List<String> participants,
        List<TaskAttachmentDto> attachments,
        List<TaskCommentDto> comments
) {}

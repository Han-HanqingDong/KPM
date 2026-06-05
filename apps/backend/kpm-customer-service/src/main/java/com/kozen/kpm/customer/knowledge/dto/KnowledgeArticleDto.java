package com.kozen.kpm.customer.knowledge.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "知识库文章")
public record KnowledgeArticleDto(
        String id,
        String title,
        String symptom,
        String rootCause,
        String solution,
        String workaround,
        Object attachments,
        String status,
        String authorUserId,
        String authorName,
        LocalDateTime publishedAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<String> projectIds,
        List<String> projectNames,
        String projectScope,
        List<String> customerIds,
        List<String> customerNames,
        String customerScope,
        List<String> taskIds
) {}

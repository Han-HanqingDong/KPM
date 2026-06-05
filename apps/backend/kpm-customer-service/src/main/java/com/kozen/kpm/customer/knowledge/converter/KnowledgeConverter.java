package com.kozen.kpm.customer.knowledge.converter;

import com.kozen.kpm.common.util.JsonUtil;
import com.kozen.kpm.customer.knowledge.dto.KnowledgeArticleDto;
import com.kozen.kpm.customer.knowledge.entity.KnowledgeArticleEntity;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class KnowledgeConverter {
    public KnowledgeArticleDto toDto(KnowledgeArticleEntity entity) {
        return new KnowledgeArticleDto(
                entity.getId(),
                entity.getTitle(),
                entity.getSymptom(),
                entity.getRootCause(),
                entity.getSolution(),
                entity.getWorkaround(),
                entity.getAttachments() == null ? List.of() : JsonUtil.fromJson(entity.getAttachments()),
                entity.getStatus(),
                entity.getAuthorUserId(),
                entity.getAuthorName(),
                entity.getPublishedAt(),
                entity.getCreatedAt(),
                entity.getUpdatedAt(),
                split(entity.getProjectIds()),
                split(entity.getProjectNames()),
                primaryScope(entity.getProjectScopes(), "PROJECT"),
                split(entity.getCustomerIds()),
                split(entity.getCustomerNames()),
                primaryScope(entity.getCustomerScopes(), "CUSTOMER"),
                split(entity.getTaskIds())
        );
    }

    private List<String> split(String value) {
        if (value == null || value.isBlank()) return List.of();
        return Arrays.stream(value.split(","))
                .map(String::trim)
                .filter(item -> !item.isBlank())
                .distinct()
                .toList();
    }

    private String primaryScope(String value, String fallback) {
        if (value == null || value.isBlank()) return fallback;
        if (value.contains("INTERNAL")) return "INTERNAL";
        if (value.contains("ALL")) return "ALL";
        if (value.contains("OTHER")) return "OTHER";
        return value.split(",")[0].trim();
    }
}

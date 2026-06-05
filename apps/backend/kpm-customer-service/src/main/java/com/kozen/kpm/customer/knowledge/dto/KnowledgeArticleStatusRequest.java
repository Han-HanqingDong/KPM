package com.kozen.kpm.customer.knowledge.dto;

import jakarta.validation.constraints.NotBlank;

public record KnowledgeArticleStatusRequest(
        @NotBlank(message = "请选择知识库文章状态") String status
) {}

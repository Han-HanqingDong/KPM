package com.kozen.kpm.customer.knowledge.service;

import com.kozen.kpm.common.api.PageResult;
import com.kozen.kpm.customer.knowledge.dto.KnowledgeArticleDto;
import com.kozen.kpm.customer.knowledge.dto.KnowledgeArticleRequest;
import com.kozen.kpm.customer.knowledge.dto.KnowledgeArticleStatusRequest;

public interface KnowledgeService {
    /** Query internal knowledge articles; internal users can see all statuses and visibility scopes. */
    PageResult<KnowledgeArticleDto> page(String keyword, String status, String projectId, String customerId, String taskId, Integer page, Integer pageSize);

    /** Load one internal knowledge article detail. */
    KnowledgeArticleDto detail(String id);

    /** Create a knowledge article in pending-review status. */
    KnowledgeArticleDto create(KnowledgeArticleRequest request, String operatorAccount);

    /** Update article content and relation scopes without changing review status. */
    KnowledgeArticleDto update(String id, KnowledgeArticleRequest request, String operatorAccount);

    /** Change article status between pending review and published. */
    KnowledgeArticleDto updateStatus(String id, KnowledgeArticleStatusRequest request, String operatorAccount);

    /** Logically delete an article. */
    boolean delete(String id, String operatorAccount);

    /** Query customer-visible published knowledge articles for customer portal. */
    PageResult<KnowledgeArticleDto> portalPage(String customerId, String keyword, Integer page, Integer pageSize);

    /** Load one customer-visible knowledge article detail for customer portal. */
    KnowledgeArticleDto portalDetail(String customerId, String id);
}

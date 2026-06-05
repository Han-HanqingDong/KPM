package com.kozen.kpm.customer.knowledge.service.impl;

import com.kozen.kpm.common.api.PageResult;
import com.kozen.kpm.common.util.IdUtil;
import com.kozen.kpm.common.util.JsonUtil;
import com.kozen.kpm.common.util.PageParamUtil;
import com.kozen.kpm.common.util.SqlParamUtil;
import com.kozen.kpm.common.util.ValidationUtil;
import com.kozen.kpm.customer.knowledge.converter.KnowledgeConverter;
import com.kozen.kpm.customer.knowledge.dto.KnowledgeArticleDto;
import com.kozen.kpm.customer.knowledge.dto.KnowledgeArticleRequest;
import com.kozen.kpm.customer.knowledge.dto.KnowledgeArticleStatusRequest;
import com.kozen.kpm.customer.knowledge.entity.KnowledgeArticleEntity;
import com.kozen.kpm.customer.knowledge.entity.KnowledgeUserEntity;
import com.kozen.kpm.customer.knowledge.mapper.KnowledgeMapper;
import com.kozen.kpm.customer.knowledge.service.KnowledgeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class KnowledgeServiceImpl implements KnowledgeService {
    private static final String STATUS_PENDING = "待审核";
    private static final String STATUS_PUBLISHED = "已发布";
    private static final String PROJECT_SCOPE_OTHER = "OTHER";
    private static final String CUSTOMER_SCOPE_ALL = "ALL";
    private static final String CUSTOMER_SCOPE_INTERNAL = "INTERNAL";
    private static final String CUSTOMER_SCOPE_CUSTOMER = "CUSTOMER";

    private final KnowledgeMapper knowledgeMapper;
    private final KnowledgeConverter knowledgeConverter;

    public KnowledgeServiceImpl(KnowledgeMapper knowledgeMapper, KnowledgeConverter knowledgeConverter) {
        this.knowledgeMapper = knowledgeMapper;
        this.knowledgeConverter = knowledgeConverter;
    }

    @Override
    public PageResult<KnowledgeArticleDto> page(String keyword, String status, String projectId, String customerId, String taskId, Integer page, Integer pageSize) {
        int current = PageParamUtil.page(page);
        int size = PageParamUtil.pageSize(pageSize);
        String like = SqlParamUtil.likeOrBlank(keyword);
        String statusValue = SqlParamUtil.blankIfAll(status);
        String projectValue = SqlParamUtil.blankIfAll(projectId);
        String customerValue = SqlParamUtil.blankIfAll(customerId);
        String taskValue = SqlParamUtil.blankIfAll(taskId);
        List<KnowledgeArticleDto> items = knowledgeMapper.pageRows(like, statusValue, projectValue, customerValue, taskValue, size, PageParamUtil.offset(current, size))
                .stream()
                .map(knowledgeConverter::toDto)
                .toList();
        long total = knowledgeMapper.countRows(like, statusValue, projectValue, customerValue, taskValue);
        return PageResult.of(items, total, current, size);
    }

    @Override
    public KnowledgeArticleDto detail(String id) {
        return knowledgeConverter.toDto(requireArticle(id));
    }

    @Override
    @Transactional
    public KnowledgeArticleDto create(KnowledgeArticleRequest request, String operatorAccount) {
        validateContent(request);
        KnowledgeUserEntity operator = resolveOperator(operatorAccount);
        String articleId = IdUtil.numericId();
        knowledgeMapper.insertArticle(
                articleId,
                clean(request.title()),
                clean(request.symptom()),
                clean(request.rootCause()),
                cleanOptional(request.solution()),
                cleanOptional(request.workaround()),
                JsonUtil.toJson(request.safeAttachments()),
                operator.getId(),
                operator.getName(),
                operator.getAccount()
        );
        replaceRelations(articleId, request, operator.getAccount());
        return detail(articleId);
    }

    @Override
    @Transactional
    public KnowledgeArticleDto update(String id, KnowledgeArticleRequest request, String operatorAccount) {
        requireArticle(id);
        validateContent(request);
        KnowledgeUserEntity operator = resolveOperator(operatorAccount);
        int updated = knowledgeMapper.updateArticle(
                id,
                clean(request.title()),
                clean(request.symptom()),
                clean(request.rootCause()),
                cleanOptional(request.solution()),
                cleanOptional(request.workaround()),
                JsonUtil.toJson(request.safeAttachments()),
                operator.getAccount()
        );
        if (updated == 0) throw new IllegalArgumentException("知识库文章不存在或已删除");
        replaceRelations(id, request, operator.getAccount());
        return detail(id);
    }

    @Override
    @Transactional
    public KnowledgeArticleDto updateStatus(String id, KnowledgeArticleStatusRequest request, String operatorAccount) {
        requireArticle(id);
        String status = clean(request.status());
        if (!STATUS_PENDING.equals(status) && !STATUS_PUBLISHED.equals(status)) {
            throw new IllegalArgumentException("知识库文章状态仅支持待审核或已发布");
        }
        KnowledgeUserEntity operator = resolveOperator(operatorAccount);
        int updated = knowledgeMapper.updateStatus(id, status, operator.getAccount());
        if (updated == 0) throw new IllegalArgumentException("知识库文章不存在或已删除");
        return detail(id);
    }

    @Override
    @Transactional
    public boolean delete(String id, String operatorAccount) {
        requireArticle(id);
        KnowledgeUserEntity operator = resolveOperator(operatorAccount);
        return knowledgeMapper.deleteArticle(id, operator.getAccount()) > 0;
    }

    @Override
    public PageResult<KnowledgeArticleDto> portalPage(String customerId, String keyword, Integer page, Integer pageSize) {
        String customer = ValidationUtil.requireText(customerId, "客户ID", 40);
        int current = PageParamUtil.page(page);
        int size = Math.min(PageParamUtil.pageSize(pageSize), 30);
        String like = SqlParamUtil.likeOrBlank(keyword);
        List<KnowledgeArticleDto> items = knowledgeMapper.portalPageRows(customer, like, size, PageParamUtil.offset(current, size))
                .stream()
                .map(knowledgeConverter::toDto)
                .toList();
        long total = knowledgeMapper.portalCountRows(customer, like);
        return PageResult.of(items, total, current, size);
    }

    @Override
    public KnowledgeArticleDto portalDetail(String customerId, String id) {
        String customer = ValidationUtil.requireText(customerId, "客户ID", 40);
        if (knowledgeMapper.portalArticleVisible(id, customer) == 0) {
            throw new IllegalArgumentException("知识库文章不存在或无权查看");
        }
        return detail(id);
    }

    private KnowledgeArticleEntity requireArticle(String id) {
        KnowledgeArticleEntity entity = knowledgeMapper.detail(ValidationUtil.requireText(id, "知识库文章ID", 40));
        if (entity == null) throw new IllegalArgumentException("知识库文章不存在或已删除");
        return entity;
    }

    private void validateContent(KnowledgeArticleRequest request) {
        ValidationUtil.requireText(request.title(), "标题", 180);
        ValidationUtil.requireText(request.symptom(), "现象", 4000);
        ValidationUtil.requireText(request.rootCause(), "根因", 4000);
        boolean hasSolution = cleanOptional(request.solution()) != null;
        boolean hasWorkaround = cleanOptional(request.workaround()) != null;
        if (!hasSolution && !hasWorkaround) {
            throw new IllegalArgumentException("解决方案和临时替代方案至少填写一个");
        }
    }

    private void replaceRelations(String articleId, KnowledgeArticleRequest request, String operator) {
        knowledgeMapper.deleteProjectLinks(articleId, operator);
        String projectScope = normalizeProjectScope(request.projectScope(), request.safeProjectIds());
        if (PROJECT_SCOPE_OTHER.equals(projectScope)) {
            knowledgeMapper.insertProjectScope(IdUtil.numericId(), articleId, PROJECT_SCOPE_OTHER, operator);
        } else {
            for (String projectId : request.safeProjectIds()) {
                requireProject(projectId);
                knowledgeMapper.insertProjectLink(IdUtil.numericId(), articleId, projectId, operator);
            }
        }

        knowledgeMapper.deleteCustomerLinks(articleId, operator);
        String customerScope = normalizeCustomerScope(request.customerScope(), request.safeCustomerIds());
        if (CUSTOMER_SCOPE_ALL.equals(customerScope) || CUSTOMER_SCOPE_INTERNAL.equals(customerScope)) {
            knowledgeMapper.insertCustomerScope(IdUtil.numericId(), articleId, customerScope, operator);
        } else {
            for (String customerId : request.safeCustomerIds()) {
                requireCustomer(customerId);
                knowledgeMapper.insertCustomerLink(IdUtil.numericId(), articleId, customerId, operator);
            }
        }

        knowledgeMapper.deleteTaskLinks(articleId, operator);
        for (String taskId : request.safeTaskIds()) {
            requireTask(taskId);
            knowledgeMapper.insertTaskLink(IdUtil.numericId(), articleId, taskId, operator);
        }
    }

    private String normalizeProjectScope(String rawScope, List<String> projectIds) {
        String value = cleanOptional(rawScope);
        if (PROJECT_SCOPE_OTHER.equalsIgnoreCase(value) || projectIds.isEmpty()) return PROJECT_SCOPE_OTHER;
        return "PROJECT";
    }

    private String normalizeCustomerScope(String rawScope, List<String> customerIds) {
        String value = cleanOptional(rawScope);
        if (CUSTOMER_SCOPE_ALL.equalsIgnoreCase(value)) return CUSTOMER_SCOPE_ALL;
        if (CUSTOMER_SCOPE_INTERNAL.equalsIgnoreCase(value) || customerIds.isEmpty()) return CUSTOMER_SCOPE_INTERNAL;
        return CUSTOMER_SCOPE_CUSTOMER;
    }

    private void requireProject(String id) {
        requireNumericId(id, "项目ID");
        if (knowledgeMapper.projectExists(id) == 0) throw new IllegalArgumentException("项目不存在：" + id);
    }

    private void requireCustomer(String id) {
        requireNumericId(id, "客户ID");
        if (knowledgeMapper.customerExists(id) == 0) throw new IllegalArgumentException("客户不存在：" + id);
    }

    private void requireTask(String id) {
        requireNumericId(id, "任务ID");
        if (knowledgeMapper.taskExists(id) == 0) throw new IllegalArgumentException("任务不存在：" + id);
    }

    private void requireNumericId(String id, String label) {
        String value = ValidationUtil.requireText(id, label, 40);
        if (!value.matches("\\d+")) {
            throw new IllegalArgumentException(label + "格式不正确");
        }
    }

    private KnowledgeUserEntity resolveOperator(String account) {
        String value = cleanOptional(account);
        if (value == null) throw new IllegalArgumentException("操作人不能为空");
        KnowledgeUserEntity user = knowledgeMapper.userByAccount(value);
        if (user == null) throw new IllegalArgumentException("操作人不存在：" + value);
        return user;
    }

    private String clean(String value) {
        return value == null ? "" : value.trim();
    }

    private String cleanOptional(String value) {
        String text = value == null ? "" : value.trim();
        return text.isEmpty() ? null : text;
    }
}

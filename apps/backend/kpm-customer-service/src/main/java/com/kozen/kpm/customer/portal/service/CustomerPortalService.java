package com.kozen.kpm.customer.portal.service;

import com.kozen.kpm.common.api.PageResult;
import com.kozen.kpm.customer.knowledge.dto.KnowledgeArticleDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalCodeRequest;
import com.kozen.kpm.customer.portal.dto.CustomerPortalCodeResponse;
import com.kozen.kpm.customer.portal.dto.CustomerPortalContactDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalDataDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalLoginRequest;
import com.kozen.kpm.customer.portal.dto.CustomerPortalLoginResponse;
import com.kozen.kpm.customer.portal.dto.CustomerPortalMeDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalMessageDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalMaterialDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalTaskAttachmentRequest;
import com.kozen.kpm.customer.portal.dto.CustomerPortalTaskDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalTaskCommentPageDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalTaskCommentRequest;
import com.kozen.kpm.customer.portal.dto.CustomerPortalTaskRequest;
import com.kozen.kpm.customer.portal.dto.CustomerPortalTaskStatsDto;

import java.util.List;

public interface CustomerPortalService {
    /** Send a one-time login code to a customer contact email. */
    CustomerPortalCodeResponse requestCode(CustomerPortalCodeRequest request, String requestIp);

    /** Verify the one-time code and issue a customer-portal bearer token. */
    CustomerPortalLoginResponse login(CustomerPortalLoginRequest request);

    /** Issue a fresh customer-portal token after a valid request, implementing sliding expiration. */
    String refreshToken(String authorizationHeader);

    /** Return current customer contact info from a customer-portal bearer token. */
    CustomerPortalMeDto me(String authorizationHeader);

    /** Load customer portal shell data: related projects, task status options, announcements and messages. */
    CustomerPortalDataDto data(String authorizationHeader);

    /** Page customer-visible public project materials with database-side filters. */
    PageResult<CustomerPortalMaterialDto> materialsPage(String authorizationHeader, String projectId, String keyword, Integer page, Integer pageSize);

    /** Return contacts of the current customer for customer-side task creator filters. */
    List<CustomerPortalContactDto> contacts(String authorizationHeader);

    /** Create a customer-originated task and notify configured technical support owners. */
    CustomerPortalTaskDto createTask(String authorizationHeader, CustomerPortalTaskRequest request);

    /** Page customer portal tasks with database-side project/status/creator filters. */
    PageResult<CustomerPortalTaskDto> tasksPage(String authorizationHeader, String projectId, String status, String creatorEmail, Integer page, Integer pageSize);

    /** Load one customer-visible task detail including task-level attachments. */
    CustomerPortalTaskDto task(String authorizationHeader, String taskId);

    /** Attach uploaded file metadata to a customer-visible task. */
    CustomerPortalTaskDto addTaskAttachments(String authorizationHeader, String taskId, CustomerPortalTaskAttachmentRequest request);

    /** Return task statuses currently used by this customer's tasks. */
    List<String> taskStatuses(String authorizationHeader);

    /** Return customer-visible task delivery statistics, optionally scoped to one project. */
    CustomerPortalTaskStatsDto taskStats(String authorizationHeader, String projectId);

    /** Page customer-visible task comments in reverse chronological order. */
    CustomerPortalTaskCommentPageDto taskComments(String authorizationHeader, String taskId, int page, int pageSize);

    /** Add a customer-visible task comment from the customer portal. */
    CustomerPortalTaskDto addTaskComment(String authorizationHeader, String taskId, CustomerPortalTaskCommentRequest request);

    /** Query customer portal messages for the current contact. */
    List<CustomerPortalMessageDto> messages(String authorizationHeader, boolean unreadOnly);

    /** Query unread message count for the current contact. */
    int unreadCount(String authorizationHeader);

    /** Mark one customer portal message as read. */
    boolean markMessageRead(String authorizationHeader, String messageId);

    /** Mark all customer portal messages as read. */
    int markAllMessagesRead(String authorizationHeader);

    /** Query customer-visible published knowledge base articles. */
    PageResult<KnowledgeArticleDto> knowledgePage(String authorizationHeader, String keyword, Integer page, Integer pageSize);

    /** Load one customer-visible published knowledge base article. */
    KnowledgeArticleDto knowledgeDetail(String authorizationHeader, String id);
}

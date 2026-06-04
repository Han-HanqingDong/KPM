package com.kozen.kpm.customer.portal.service;

import com.kozen.kpm.customer.portal.dto.CustomerPortalCodeRequest;
import com.kozen.kpm.customer.portal.dto.CustomerPortalCodeResponse;
import com.kozen.kpm.customer.portal.dto.CustomerPortalDataDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalLoginRequest;
import com.kozen.kpm.customer.portal.dto.CustomerPortalLoginResponse;
import com.kozen.kpm.customer.portal.dto.CustomerPortalMeDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalMessageDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalTaskDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalTaskCommentPageDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalTaskCommentRequest;
import com.kozen.kpm.customer.portal.dto.CustomerPortalTaskRequest;

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

    /** Load public customer portal data: related projects, public materials and customer tasks. */
    CustomerPortalDataDto data(String authorizationHeader);

    /** Create a customer-originated task and notify configured technical support owners. */
    CustomerPortalTaskDto createTask(String authorizationHeader, CustomerPortalTaskRequest request);

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
}

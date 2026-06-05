package com.kozen.kpm.customer.service;

import com.kozen.kpm.common.api.PageResult;
import com.kozen.kpm.common.dto.FileMetadataRequest;
import com.kozen.kpm.customer.dto.CustomerContactRequest;
import com.kozen.kpm.customer.dto.CustomerDto;
import com.kozen.kpm.customer.dto.CustomerFollowupRequest;
import com.kozen.kpm.customer.dto.CustomerNotificationRequest;
import com.kozen.kpm.customer.dto.CustomerNotificationResultDto;
import com.kozen.kpm.customer.dto.CustomerRequest;

import java.util.List;

/**
 * Customer domain service.
 * Responsible for customer master data, owner assignment, contacts,
 * customer materials, follow-up records, and customer-project relation views.
 */
public interface CustomerService {
    /** Query customers by optional keyword and enrich each row with owners and related data. */
    List<CustomerDto> list(String keyword);

    /** Query a paged customer list with keyword filtering inside SQL. */
    PageResult<CustomerDto> page(String keyword, Integer page, Integer pageSize);

    /** Load customer detail including contacts, materials, follow-ups and related projects. */
    CustomerDto detail(String id);

    /** Create one customer and bind sales/support owners. */
    CustomerDto create(CustomerRequest request);

    /** Update customer base fields and owner bindings. */
    CustomerDto update(String id, CustomerRequest request);

    /** Delete one customer by ID. */
    boolean delete(String id);

    /** Add one contact to the customer. */
    CustomerDto addContact(String id, CustomerContactRequest request);

    /** Delete one contact from the customer. */
    CustomerDto deleteContact(String id, String contactId);

    /** Add one follow-up record to the customer. */
    CustomerDto addFollowup(String id, CustomerFollowupRequest request);

    /** Add one uploaded material metadata record to the customer. */
    CustomerDto addMaterial(String id, FileMetadataRequest request);

    /** Send a customer-level notification to all customer contacts with email. */
    CustomerNotificationResultDto sendNotification(String id, CustomerNotificationRequest request, String publisher);
}

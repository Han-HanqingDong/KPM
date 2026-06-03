package com.kozen.kpm.customer.service;

import com.kozen.kpm.common.dto.FileMetadataRequest;
import com.kozen.kpm.customer.dto.CustomerContactRequest;
import com.kozen.kpm.customer.dto.CustomerFollowupRequest;
import com.kozen.kpm.customer.dto.CustomerRequest;

import java.util.List;
import java.util.Map;

/**
 * Customer domain service.
 * Responsible for customer master data, owner assignment, contacts,
 * customer materials, follow-up records, and customer-project relation views.
 */
public interface CustomerService {
    /**
     * Query customers by optional keyword and enrich each row with owners and related data.
     */
    List<Map<String, Object>> list(String keyword);

    /**
     * Load customer detail including contacts, materials, follow-ups and related projects.
     */
    Map<String, Object> detail(String id);

    /**
     * Create one customer and bind sales/support owners.
     */
    Map<String, Object> create(CustomerRequest request);

    /**
     * Update customer base fields and owner bindings.
     */
    Map<String, Object> update(String id, CustomerRequest request);

    /**
     * Delete one customer by ID.
     */
    boolean delete(String id);

    /**
     * Add one contact to the customer.
     */
    Map<String, Object> addContact(String id, CustomerContactRequest request);

    /**
     * Delete one contact from the customer.
     */
    Map<String, Object> deleteContact(String id, String contactId);

    /**
     * Add one follow-up record to the customer.
     */
    Map<String, Object> addFollowup(String id, CustomerFollowupRequest request);

    /**
     * Add one uploaded material metadata record to the customer.
     */
    Map<String, Object> addMaterial(String id, FileMetadataRequest request);
}

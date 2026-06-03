package com.kozen.kpm.order.service;

import com.kozen.kpm.order.dto.OrderRequest;

import java.util.List;
import java.util.Map;

/**
 * Order domain service.
 * Responsible for order CRUD, amount calculation, order history recording,
 * and automatic project-customer status maintenance after order creation/update.
 */
public interface OrderService {
    /**
     * Query order list by optional year/customer/project filters.
     */
    List<Map<String, Object>> list(String year, String customerId, String projectId);

    /**
     * Load one order with modification histories.
     */
    Map<String, Object> detail(String id);

    /**
     * Create a new order and update related customer-project status.
     */
    Map<String, Object> create(OrderRequest request);

    /**
     * Update an existing order and append an audit history record.
     */
    Map<String, Object> update(String id, OrderRequest request);

    /**
     * Delete one order by ID.
     */
    boolean delete(String id);
}

package com.kozen.kpm.order.service.impl;

import com.kozen.kpm.common.util.IdUtil;
import com.kozen.kpm.common.util.JsonUtil;
import com.kozen.kpm.common.util.SqlParamUtil;
import com.kozen.kpm.common.util.ValidationUtil;
import com.kozen.kpm.order.dto.OrderRequest;
import com.kozen.kpm.order.mapper.OrderMapper;
import com.kozen.kpm.order.service.OrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * Default order service implementation.
 */
@Service
public class OrderServiceImpl implements OrderService {
    private final OrderMapper orderMapper;

    public OrderServiceImpl(OrderMapper orderMapper) {
        this.orderMapper = orderMapper;
    }

    @Override
    public List<Map<String, Object>> list(String year, String customerId, String projectId) {
        String y = SqlParamUtil.blankIfAll(year);
        String c = SqlParamUtil.blankIfAll(customerId);
        String p = SqlParamUtil.blankIfAll(projectId);
        List<Map<String, Object>> rows = orderMapper.list(y, c, p);
        rows.forEach(this::enrichOrder);
        return rows;
    }

    @Override
    public Map<String, Object> detail(String id) {
        Map<String, Object> order = orderMapper.load(id);
        enrichOrder(order);
        return order;
    }

    @Override
    @Transactional
    public Map<String, Object> create(OrderRequest request) {
        Map<String, Object> body = request.toMap();
        String id = request.id() == null || request.id().isBlank() ? nextOrderId() : request.id();
        BigDecimal unitPrice = request.unitPrice();
        int quantity = request.quantity();
        BigDecimal amount = unitPrice.multiply(BigDecimal.valueOf(quantity));
        Map<String, Object> creator = requireUser(request.creator(), "订单创建人");
        orderMapper.insert(body, id, quantity, unitPrice, amount, String.valueOf(creator.get("id")), String.valueOf(creator.get("name")));
        ensureProjectCustomer(request.projectId(), request.customerId(), request.safeOrderType());
        publishOrderCreatedEvent(id, request);
        return detail(id);
    }

    @Override
    @Transactional
    public Map<String, Object> update(String id, OrderRequest request) {
        Map<String, Object> body = request.toMap();
        Map<String, Object> before = detail(id);
        BigDecimal unitPrice = request.unitPrice();
        int quantity = request.quantity();
        BigDecimal amount = unitPrice.multiply(BigDecimal.valueOf(quantity));
        orderMapper.updateOrder(id, body, quantity, unitPrice, amount);
        String changes = request.changeSummary() == null || request.changeSummary().isBlank() ? summarize(before, body) : request.changeSummary();
        String reason = ValidationUtil.requireText(request.changeReason(), "修改原因", 500);
        String modifier = request.modifier() == null || request.modifier().isBlank() ? "张敏" : request.modifier();
        orderMapper.insertHistory(IdUtil.nanoId("oh"), id, modifier, changes, reason);
        ensureProjectCustomer(request.projectId(), request.customerId(), request.safeOrderType());
        return detail(id);
    }

    @Override
    public boolean delete(String id) {
        orderMapper.deleteById(id);
        return true;
    }

    private Map<String, Object> requireUser(Object accountOrName, String label) {
        if (accountOrName == null || String.valueOf(accountOrName).isBlank()) {
            throw new IllegalArgumentException(label + "必须从已有用户中选择");
        }
        List<Map<String, Object>> users = orderMapper.usersByAccountOrName(accountOrName);
        if (users.isEmpty()) {
            throw new IllegalArgumentException(label + "不存在，请从已有用户中选择");
        }
        return users.getFirst();
    }

    private void publishOrderCreatedEvent(String orderId, OrderRequest request) {
        List<String> recipients = orderMapper.customerOwnerUserIds(request.customerId());
        if (recipients.isEmpty()) {
            return;
        }
        orderMapper.insertNotificationEvent(
                IdUtil.nanoId("evt"),
                "ORDER_CREATED",
                orderId,
                "新订单已创建",
                "订单 " + orderId + " 已创建，请相关销售和技术支持关注交付计划。",
                JsonUtil.toJson(recipients)
        );
    }

    private void enrichOrder(Map<String, Object> order) {
        order.put("histories", orderMapper.histories(String.valueOf(order.get("id"))));
    }

    private void ensureProjectCustomer(String projectId, String customerId, String orderType) {
        String status = switch (orderType) {
            case "样品订单" -> "样机测试";
            case "预订单" -> "商机发掘";
            default -> "订单冲刺";
        };
        List<String> ids = orderMapper.projectCustomerIds(projectId, customerId);
        if (ids.isEmpty()) {
            orderMapper.insertProjectCustomer(IdUtil.nanoId("pc"), projectId, customerId, status);
        } else {
            orderMapper.updateProjectCustomerStatus(projectId, customerId, status);
        }
    }

    private String summarize(Map<String, Object> before, Map<String, Object> after) {
        return "订单更新：" + before.get("quantity") + "台 → " + after.get("quantity") + "台；计划发货 " + before.get("plannedShipDate") + " → " + after.get("plannedShipDate");
    }

    private String nextOrderId() {
        String ym = java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMM"));
        String prefix = "ORD-" + ym + "-";
        return prefix + String.format("%03d", orderMapper.nextMonthlyOrderSequence(prefix));
    }
}

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
import java.time.LocalDate;
import java.util.LinkedHashMap;
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
        if (order == null) {
            throw new IllegalArgumentException("订单不存在");
        }
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
        String status = resolveOrderStatus(request.safeStatus());
        Map<String, Object> skuSnapshot = skuSnapshot(request.projectId(), request.skuId());
        String actualShipDate = shouldMarkShipped(null, status) ? LocalDate.now().toString() : null;
        orderMapper.insert(body, id, quantity, unitPrice, amount, String.valueOf(creator.get("id")), String.valueOf(creator.get("name")), status, actualShipDate, JsonUtil.toJson(skuSnapshot));
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
        String status = resolveOrderStatus(request.safeStatus());
        Map<String, Object> skuSnapshot = skuSnapshot(request.projectId(), request.skuId());
        String previousActualShipDate = stringValue(before.get("actualShipDate"));
        String actualShipDate = shouldMarkShipped(before.get("status"), status) && previousActualShipDate == null
                ? LocalDate.now().toString()
                : previousActualShipDate;
        orderMapper.updateOrder(id, body, quantity, unitPrice, amount, status, actualShipDate, JsonUtil.toJson(skuSnapshot));
        Map<String, Object> after = new LinkedHashMap<>(body);
        after.put("status", status);
        after.put("actualShipDate", actualShipDate);
        after.put("amount", amount);
        after.put("unitPrice", unitPrice);
        after.put("skuSnapshot", skuSnapshot);
        String changes = request.changeSummary() == null || request.changeSummary().isBlank() ? summarize(before, after) : request.changeSummary();
        String reason = ValidationUtil.requireText(request.changeReason(), "修改原因", 500);
        String modifier = ValidationUtil.requireText(request.modifier(), "修改人", 60);
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

    private String resolveOrderStatus(String requestedStatus) {
        if (requestedStatus != null && !requestedStatus.isBlank()) {
            return requestedStatus;
        }
        String status = orderMapper.defaultEnumValue("order_status");
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("订单状态未配置默认枚举值，请先在资源管理中配置");
        }
        return status;
    }

    private Map<String, Object> skuSnapshot(String projectId, String skuId) {
        Map<String, Object> sku = orderMapper.activeProjectSku(projectId, skuId);
        if (sku == null) {
            throw new IllegalArgumentException("SKU不存在、未启用或不属于当前项目");
        }
        Map<String, Object> snapshot = new LinkedHashMap<>();
        snapshot.put("id", sku.get("id"));
        snapshot.put("wholeMachinePartNumber", sku.get("wholeMachinePartNumber"));
        snapshot.put("configurationName", sku.get("configurationName"));
        snapshot.put("memoryType", sku.get("memoryType"));
        return snapshot;
    }

    private boolean shouldMarkShipped(Object previousStatus, String nextStatus) {
        if (nextStatus == null || nextStatus.isBlank()) {
            return false;
        }
        if (String.valueOf(nextStatus).equals(String.valueOf(previousStatus))) {
            return false;
        }
        return "SHIPPED".equals(orderMapper.enumSemantic("order_status", nextStatus));
    }

    private void ensureProjectCustomer(String projectId, String customerId, String orderType) {
        String status = orderMapper.customerProjectStatusByOrderType(orderType);
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("订单类型未配置客户项目状态映射：" + orderType);
        }
        List<String> ids = orderMapper.projectCustomerIds(projectId, customerId);
        if (ids.isEmpty()) {
            orderMapper.insertProjectCustomer(IdUtil.nanoId("pc"), projectId, customerId, status);
        } else {
            orderMapper.updateProjectCustomerStatus(projectId, customerId, status);
        }
    }

    private String summarize(Map<String, Object> before, Map<String, Object> after) {
        List<String> fields = List.of("status", "quantity", "amount", "expectedShipDate", "plannedShipDate", "actualShipDate", "softwareVersion", "skuId", "specification");
        List<String> changes = fields.stream()
                .map(field -> {
                    String oldValue = stringValue(before.get(field));
                    String newValue = stringValue(after.get(field));
                    if (oldValue == null && newValue == null) return null;
                    if (oldValue != null && oldValue.equals(newValue)) return null;
                    return fieldLabel(field) + "：" + (oldValue == null ? "-" : oldValue) + " → " + (newValue == null ? "-" : newValue);
                })
                .filter(value -> value != null && !value.isBlank())
                .toList();
        return changes.isEmpty() ? "订单信息已更新" : String.join("；", changes);
    }

    private String fieldLabel(String field) {
        return switch (field) {
            case "status" -> "订单状态";
            case "quantity" -> "数量";
            case "amount" -> "金额";
            case "expectedShipDate" -> "期望发货日期";
            case "plannedShipDate" -> "计划发货日期";
            case "actualShipDate" -> "实际发货日期";
            case "softwareVersion" -> "软件版本号";
            case "skuId" -> "SKU";
            case "specification" -> "具体规格";
            default -> field;
        };
    }

    private String stringValue(Object value) {
        if (value == null || String.valueOf(value).isBlank() || "null".equals(String.valueOf(value))) {
            return null;
        }
        return String.valueOf(value);
    }

    private String nextOrderId() {
        String ym = java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMM"));
        String prefix = "ORD-" + ym + "-";
        return prefix + String.format("%03d", orderMapper.nextMonthlyOrderSequence(prefix));
    }
}

package com.kozen.kpm.order.service.impl;

import com.kozen.kpm.common.api.PageResult;
import com.kozen.kpm.common.util.IdUtil;
import com.kozen.kpm.common.util.JsonUtil;
import com.kozen.kpm.common.util.PageParamUtil;
import com.kozen.kpm.common.util.SqlParamUtil;
import com.kozen.kpm.common.util.ValidationUtil;
import com.kozen.kpm.order.converter.OrderConverter;
import com.kozen.kpm.order.dto.OrderDto;
import com.kozen.kpm.order.dto.OrderRequest;
import com.kozen.kpm.order.dto.OrderSkuSnapshotDto;
import com.kozen.kpm.order.dto.OrderWriteCommand;
import com.kozen.kpm.order.entity.OrderEntity;
import com.kozen.kpm.order.entity.OrderHistoryEntity;
import com.kozen.kpm.order.entity.ProjectSkuEntity;
import com.kozen.kpm.order.entity.UserLookupEntity;
import com.kozen.kpm.order.mapper.OrderMapper;
import com.kozen.kpm.order.service.OrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/** Default order service implementation. */
@Service
public class OrderServiceImpl implements OrderService {
    private final OrderMapper orderMapper;
    private final OrderConverter orderConverter;

    public OrderServiceImpl(OrderMapper orderMapper, OrderConverter orderConverter) {
        this.orderMapper = orderMapper;
        this.orderConverter = orderConverter;
    }

    @Override
    public List<OrderDto> list(String year, String customerId, String projectId) {
        String y = SqlParamUtil.blankIfAll(year);
        String c = SqlParamUtil.blankIfAll(customerId);
        String p = SqlParamUtil.blankIfAll(projectId);
        DateRange range = orderDateRange(y);
        List<OrderEntity> orders = orderMapper.list(range.startDate(), range.endDate(), c, p);
        return toDtosWithHistories(orders);
    }

    @Override
    public PageResult<OrderDto> page(String keyword, String year, String customerId, String projectId, String orderType, String status, Integer page, Integer pageSize) {
        int current = PageParamUtil.page(page);
        int size = PageParamUtil.pageSize(pageSize);
        DateRange range = orderDateRange(SqlParamUtil.blankIfAll(year));
        String customer = SqlParamUtil.blankIfAll(customerId);
        String project = SqlParamUtil.blankIfAll(projectId);
        String type = SqlParamUtil.blankIfAll(orderType);
        String st = SqlParamUtil.blankIfAll(status);
        String like = SqlParamUtil.likeOrBlank(keyword);
        List<OrderDto> items = orderMapper.pageRows(
                range.startDate(),
                range.endDate(),
                customer,
                project,
                type,
                st,
                like,
                size,
                PageParamUtil.offset(current, size)
        ).stream().map(orderConverter::toOrderSummaryDto).toList();
        long total = orderMapper.countRows(range.startDate(), range.endDate(), customer, project, type, st, like);
        return PageResult.of(items, total, current, size);
    }

    private List<OrderDto> toDtosWithHistories(List<OrderEntity> orders) {
        if (orders.isEmpty()) {
            return List.of();
        }
        Map<String, List<OrderHistoryEntity>> histories = orderMapper.historiesForOrders(
                        orders.stream().map(OrderEntity::getId).toList()
                ).stream()
                .collect(Collectors.groupingBy(OrderHistoryEntity::getOrderId));
        return orders.stream()
                .map(order -> orderConverter.toOrderDto(order, histories.getOrDefault(order.getId(), List.of())))
                .toList();
    }

    @Override
    public OrderDto detail(String id) {
        OrderEntity order = orderMapper.load(id);
        if (order == null) {
            throw new IllegalArgumentException("订单不存在");
        }
        return toDtoWithHistories(order);
    }

    @Override
    @Transactional
    public OrderDto create(OrderRequest request) {
        String orderId = request.id() == null || request.id().isBlank() ? nextOrderId() : request.id();
        UserLookupEntity creator = requireUser(request.creator(), "订单创建人");
        OrderSkuSnapshotDto skuSnapshot = skuSnapshot(request.projectId(), request.skuId());
        String status = resolveOrderStatus(request.safeStatus());
        String actualShipDate = shouldMarkShipped(null, status) ? LocalDate.now().toString() : null;
        OrderWriteCommand command = toWriteCommand(orderId, request, creator, status, actualShipDate, skuSnapshot);

        orderMapper.insert(command);
        ensureProjectCustomer(request.projectId(), request.customerId(), request.safeOrderType());
        publishOrderCreatedEvent(orderId, request);
        return detail(orderId);
    }

    @Override
    @Transactional
    public OrderDto update(String id, OrderRequest request) {
        OrderDto before = detail(id);
        OrderSkuSnapshotDto skuSnapshot = skuSnapshot(request.projectId(), request.skuId());
        String status = resolveOrderStatus(request.safeStatus());
        String previousActualShipDate = stringValue(before.actualShipDate());
        String actualShipDate = shouldMarkShipped(before.status(), status) && previousActualShipDate == null
                ? LocalDate.now().toString()
                : previousActualShipDate;
        UserLookupEntity creator = new UserLookupEntity();
        creator.setId(before.creatorUserId());
        creator.setName(before.creator());
        OrderWriteCommand command = toWriteCommand(id, request, creator, status, actualShipDate, skuSnapshot);

        orderMapper.updateOrder(command);
        String changes = request.changeSummary() == null || request.changeSummary().isBlank()
                ? summarize(before, command)
                : request.changeSummary();
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

    private OrderDto toDtoWithHistories(OrderEntity order) {
        return orderConverter.toOrderDto(order, orderMapper.histories(order.getId()));
    }

    private OrderWriteCommand toWriteCommand(
            String id,
            OrderRequest request,
            UserLookupEntity creator,
            String status,
            String actualShipDate,
            OrderSkuSnapshotDto skuSnapshot
    ) {
        int quantity = request.quantity();
        BigDecimal unitPrice = request.unitPrice();
        BigDecimal amount = unitPrice.multiply(BigDecimal.valueOf(quantity));
        return new OrderWriteCommand(
                id,
                request.orderDate(),
                request.customerId(),
                request.projectId(),
                request.skuId(),
                JsonUtil.toJson(skuSnapshot),
                request.safeOrderType(),
                status,
                quantity,
                request.specification(),
                request.safeExpectedShipDate(),
                request.safePlannedShipDate(),
                actualShipDate,
                request.softwareVersion(),
                request.safeCurrency(),
                unitPrice,
                amount,
                creator.getId(),
                creator.getName()
        );
    }

    private UserLookupEntity requireUser(Object accountOrName, String label) {
        if (accountOrName == null || String.valueOf(accountOrName).isBlank()) {
            throw new IllegalArgumentException(label + "必须从已有用户中选择");
        }
        List<UserLookupEntity> users = orderMapper.usersByAccountOrName(accountOrName);
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
                IdUtil.numericId(),
                "ORDER_CREATED",
                orderId,
                "新订单已创建",
                "订单 " + orderId + " 已创建，请相关销售和技术支持关注交付计划。",
                JsonUtil.toJson(recipients)
        );
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

    private OrderSkuSnapshotDto skuSnapshot(String projectId, String skuId) {
        ProjectSkuEntity sku = orderMapper.activeProjectSku(projectId, skuId);
        if (sku == null) {
            throw new IllegalArgumentException("SKU不存在、未启用或不属于当前项目");
        }
        return orderConverter.toSkuSnapshotDto(sku);
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

    private String summarize(OrderDto before, OrderWriteCommand after) {
        List<String> fields = List.of("status", "quantity", "amount", "expectedShipDate", "plannedShipDate", "actualShipDate", "softwareVersion", "skuId", "specification");
        List<String> changes = fields.stream()
                .map(field -> summarizeField(field, oldValue(before, field), newValue(after, field)))
                .filter(value -> value != null && !value.isBlank())
                .toList();
        return changes.isEmpty() ? "订单信息已更新" : String.join("；", changes);
    }

    private String summarizeField(String field, String oldValue, String newValue) {
        if (oldValue == null && newValue == null) return null;
        if (oldValue != null && oldValue.equals(newValue)) return null;
        return fieldLabel(field) + "：" + (oldValue == null ? "-" : oldValue) + " → " + (newValue == null ? "-" : newValue);
    }

    private String oldValue(OrderDto order, String field) {
        return switch (field) {
            case "status" -> stringValue(order.status());
            case "quantity" -> stringValue(order.quantity());
            case "amount" -> stringValue(order.amount());
            case "expectedShipDate" -> stringValue(order.expectedShipDate());
            case "plannedShipDate" -> stringValue(order.plannedShipDate());
            case "actualShipDate" -> stringValue(order.actualShipDate());
            case "softwareVersion" -> stringValue(order.softwareVersion());
            case "skuId" -> stringValue(order.skuId());
            case "specification" -> stringValue(order.specification());
            default -> null;
        };
    }

    private String newValue(OrderWriteCommand order, String field) {
        return switch (field) {
            case "status" -> stringValue(order.getStatus());
            case "quantity" -> stringValue(order.getQuantity());
            case "amount" -> stringValue(order.getAmount());
            case "expectedShipDate" -> stringValue(order.getExpectedShipDate());
            case "plannedShipDate" -> stringValue(order.getPlannedShipDate());
            case "actualShipDate" -> stringValue(order.getActualShipDate());
            case "softwareVersion" -> stringValue(order.getSoftwareVersion());
            case "skuId" -> stringValue(order.getSkuId());
            case "specification" -> stringValue(order.getSpecification());
            default -> null;
        };
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
        return IdUtil.numericId();
    }

    private DateRange orderDateRange(String year) {
        if (year == null || year.isBlank()) {
            return new DateRange(null, null);
        }
        if (!year.matches("\\d{4}")) {
            throw new IllegalArgumentException("年份格式不正确，应为4位年份");
        }
        LocalDate start = LocalDate.of(Integer.parseInt(year), 1, 1);
        return new DateRange(start, start.plusYears(1));
    }

    private record DateRange(LocalDate startDate, LocalDate endDate) {}
}

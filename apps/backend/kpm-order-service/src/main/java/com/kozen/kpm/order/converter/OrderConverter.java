package com.kozen.kpm.order.converter;

import com.kozen.kpm.order.dto.OrderDto;
import com.kozen.kpm.order.dto.OrderHistoryDto;
import com.kozen.kpm.order.dto.OrderSkuSnapshotDto;
import com.kozen.kpm.order.entity.OrderEntity;
import com.kozen.kpm.order.entity.OrderHistoryEntity;
import com.kozen.kpm.order.entity.ProjectSkuEntity;
import org.springframework.stereotype.Component;

import java.util.List;

/** Converts order persistence projections into API-facing DTOs. */
@Component
public class OrderConverter {
    public OrderDto toOrderDto(OrderEntity order, List<OrderHistoryEntity> histories) {
        return new OrderDto(
                order.getId(),
                order.getOrderDate(),
                order.getCustomerId(),
                order.getCustomerName(),
                order.getRegion(),
                order.getProjectId(),
                order.getProjectName(),
                order.getSkuId(),
                order.getSkuSnapshot(),
                order.getOrderType(),
                order.getOrderType(),
                order.getStatus(),
                order.getQuantity(),
                order.getSpecification(),
                order.getExpectedShipDate(),
                order.getPlannedShipDate(),
                order.getActualShipDate(),
                order.getSoftwareVersion(),
                order.getCurrency(),
                order.getUnitPrice(),
                order.getAmount(),
                order.getCreatorUserId(),
                order.getCreator(),
                order.getWholeMachinePartNumber(),
                order.getConfigurationName(),
                order.getMemoryType(),
                order.getCreatedAt(),
                order.getUpdatedAt(),
                histories.stream().map(this::toHistoryDto).toList()
        );
    }

    public OrderDto toOrderSummaryDto(OrderEntity order) {
        return new OrderDto(
                order.getId(),
                order.getOrderDate(),
                order.getCustomerId(),
                order.getCustomerName(),
                order.getRegion(),
                order.getProjectId(),
                order.getProjectName(),
                order.getSkuId(),
                order.getSkuSnapshot(),
                order.getOrderType(),
                order.getOrderType(),
                order.getStatus(),
                order.getQuantity(),
                order.getSpecification(),
                order.getExpectedShipDate(),
                order.getPlannedShipDate(),
                order.getActualShipDate(),
                order.getSoftwareVersion(),
                order.getCurrency(),
                order.getUnitPrice(),
                order.getAmount(),
                order.getCreatorUserId(),
                order.getCreator(),
                order.getWholeMachinePartNumber(),
                order.getConfigurationName(),
                order.getMemoryType(),
                order.getCreatedAt(),
                order.getUpdatedAt(),
                List.of()
        );
    }

    public OrderHistoryDto toHistoryDto(OrderHistoryEntity history) {
        return new OrderHistoryDto(
                history.getId(),
                history.getOrderId(),
                history.getModifier(),
                history.getModifiedAt(),
                history.getChanges(),
                history.getReason()
        );
    }

    public OrderSkuSnapshotDto toSkuSnapshotDto(ProjectSkuEntity sku) {
        return new OrderSkuSnapshotDto(
                sku.getId(),
                sku.getWholeMachinePartNumber(),
                sku.getConfigurationName(),
                sku.getMemoryType()
        );
    }
}

package com.kozen.kpm.order.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.Map;

@Schema(description = "订单保存请求")
public record OrderRequest(
        String id,
        @NotBlank(message = "下单日期不能为空")
        @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "下单日期必须是YYYY-MM-DD格式")
        String orderDate,
        @NotBlank(message = "客户ID不能为空")
        @Size(max = 80, message = "客户ID不能超过80个字符")
        String customerId,
        @NotBlank(message = "项目ID不能为空")
        @Size(max = 80, message = "项目ID不能超过80个字符")
        String projectId,
        @NotBlank(message = "SKU不能为空")
        @Size(max = 80, message = "SKU ID不能超过80个字符")
        String skuId,
        @NotBlank(message = "订单类型不能为空")
        @Size(max = 40, message = "订单类型不能超过40个字符")
        String orderType,
        @Size(max = 40, message = "订单状态不能超过40个字符")
        String status,
        @NotNull(message = "数量不能为空")
        @Positive(message = "数量必须大于0")
        Integer quantity,
        @NotBlank(message = "具体规格不能为空")
        @Size(max = 1000, message = "具体规格不能超过1000个字符")
        String specification,
        @NotBlank(message = "期望发货日期不能为空")
        @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "期望发货日期必须是YYYY-MM-DD格式")
        String expectedShipDate,
        @Pattern(regexp = "^$|\\d{4}-\\d{2}-\\d{2}$", message = "计划发货日期必须是YYYY-MM-DD格式")
        String plannedShipDate,
        @Size(max = 80, message = "软件版本号不能超过80个字符")
        String softwareVersion,
        @NotBlank(message = "币种不能为空")
        @Size(max = 10, message = "币种不能超过10个字符")
        String currency,
        @NotNull(message = "单价不能为空")
        @DecimalMin(value = "0.00", message = "单价不能小于0")
        BigDecimal unitPrice,
        @NotBlank(message = "创建人不能为空")
        @Size(max = 60, message = "创建人不能超过60个字符")
        String creator,
        @Size(max = 60, message = "修改人不能超过60个字符")
        String modifier,
        @Size(max = 1000, message = "修改内容不能超过1000个字符")
        String changeSummary,
        @Size(max = 500, message = "修改原因不能超过500个字符")
        String changeReason
) {
    public String safeExpectedShipDate() { return expectedShipDate == null || expectedShipDate.isBlank() ? null : expectedShipDate; }
    public String safePlannedShipDate() { return plannedShipDate == null || plannedShipDate.isBlank() ? null : plannedShipDate; }
    public String safeCurrency() { return currency; }
    public String safeOrderType() { return orderType; }
    public String safeStatus() { return status == null || status.isBlank() ? null : status; }

    public Map<String, Object> toMap() {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", id);
        map.put("orderDate", orderDate);
        map.put("customerId", customerId);
        map.put("projectId", projectId);
        map.put("skuId", skuId);
        map.put("orderType", safeOrderType());
        map.put("status", safeStatus());
        map.put("quantity", quantity);
        map.put("specification", specification);
        map.put("expectedShipDate", safeExpectedShipDate());
        map.put("plannedShipDate", safePlannedShipDate());
        map.put("softwareVersion", softwareVersion);
        map.put("currency", safeCurrency());
        map.put("unitPrice", unitPrice);
        map.put("creator", creator);
        map.put("modifier", modifier);
        map.put("changeSummary", changeSummary);
        map.put("changeReason", changeReason);
        return map;
    }
}

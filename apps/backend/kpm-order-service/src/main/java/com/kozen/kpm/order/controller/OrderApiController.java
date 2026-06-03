package com.kozen.kpm.order.controller;

import com.kozen.kpm.common.api.ApiResponse;
import com.kozen.kpm.order.dto.OrderRequest;
import com.kozen.kpm.order.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(originPatterns = "*")
@Tag(name = "订单管理", description = "订单增删改查、订单修改记录与订单驱动的客户项目状态联动")
public class OrderApiController {
    private final OrderService orderService;

    public OrderApiController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    @Operation(summary = "查询订单列表", description = "支持按年份、客户、项目过滤订单。")
    public ApiResponse<List<Map<String, Object>>> list(@RequestParam(required = false) String year,
                                                        @RequestParam(required = false) String customerId,
                                                        @RequestParam(required = false) String projectId) {
        return ApiResponse.ok(orderService.list(year, customerId, projectId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "查询订单详情", description = "返回订单基础信息和修改记录。")
    public ApiResponse<Map<String, Object>> detail(@PathVariable String id) {
        return ApiResponse.ok(orderService.detail(id));
    }

    @PostMapping
    @Operation(summary = "新增订单", description = "新增订单时自动计算金额；如果客户与项目未关联，则按订单类型自动建立客户项目状态。")
    public ApiResponse<Map<String, Object>> create(@Valid @RequestBody OrderRequest request) {
        return ApiResponse.ok(orderService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "修改订单", description = "修改订单时必须记录修改原因，并写入订单修改记录。")
    public ApiResponse<Map<String, Object>> update(@PathVariable String id, @Valid @RequestBody OrderRequest request) {
        return ApiResponse.ok(orderService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除订单", description = "删除指定订单。")
    public ApiResponse<Boolean> delete(@PathVariable String id) {
        return ApiResponse.ok(orderService.delete(id));
    }
}

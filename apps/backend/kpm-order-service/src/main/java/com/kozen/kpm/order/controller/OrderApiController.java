package com.kozen.kpm.order.controller;

import com.kozen.kpm.common.api.ApiResponse;
import com.kozen.kpm.common.api.PageResult;
import com.kozen.kpm.order.dto.OrderDto;
import com.kozen.kpm.order.dto.OrderRequest;
import com.kozen.kpm.order.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ApiResponse<List<OrderDto>> list(@RequestParam(required = false) String year,
                                                        @RequestParam(required = false) String customerId,
                                                        @RequestParam(required = false) String projectId) {
        return ApiResponse.ok(orderService.list(year, customerId, projectId));
    }

    @GetMapping("/page")
    @Operation(summary = "分页查询订单列表", description = "支持关键字、年份、客户、项目、订单类型与状态过滤；分页排序在后端 SQL 执行。")
    public ApiResponse<PageResult<OrderDto>> page(@RequestParam(required = false) String keyword,
                                                  @RequestParam(required = false) String year,
                                                  @RequestParam(required = false) String customerId,
                                                  @RequestParam(required = false) String projectId,
                                                  @RequestParam(required = false) String orderType,
                                                  @RequestParam(required = false) String status,
                                                  @RequestParam(defaultValue = "1") Integer page,
                                                  @RequestParam(defaultValue = "20") Integer pageSize) {
        return ApiResponse.ok(orderService.page(keyword, year, customerId, projectId, orderType, status, page, pageSize));
    }

    @GetMapping("/{id}")
    @Operation(summary = "查询订单详情", description = "返回订单基础信息和修改记录。")
    public ApiResponse<OrderDto> detail(@PathVariable String id) {
        return ApiResponse.ok(orderService.detail(id));
    }

    @PostMapping
    @Operation(summary = "新增订单", description = "新增订单时自动计算金额；如果客户与项目未关联，则按订单类型自动建立客户项目状态。")
    public ApiResponse<OrderDto> create(@Valid @RequestBody OrderRequest request) {
        return ApiResponse.ok(orderService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "修改订单", description = "修改订单时必须记录修改原因，并写入订单修改记录。")
    public ApiResponse<OrderDto> update(@PathVariable String id, @Valid @RequestBody OrderRequest request) {
        return ApiResponse.ok(orderService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除订单", description = "删除指定订单。")
    public ApiResponse<Boolean> delete(@PathVariable String id) {
        return ApiResponse.ok(orderService.delete(id));
    }
}

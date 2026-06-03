package com.kozen.kpm.customer.controller;

import com.kozen.kpm.common.api.ApiResponse;
import com.kozen.kpm.common.dto.FileMetadataRequest;
import com.kozen.kpm.customer.dto.CustomerContactRequest;
import com.kozen.kpm.customer.dto.CustomerFollowupRequest;
import com.kozen.kpm.customer.dto.CustomerRequest;
import com.kozen.kpm.customer.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(originPatterns = "*")
@Tag(name = "客户管理", description = "客户资料、客户负责人、联系人、资料库、跟进记录与关联项目管理")
public class CustomerApiController {
    private final CustomerService customerService;

    public CustomerApiController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    @Operation(summary = "查询客户列表", description = "支持按客户名称、简称或地区关键字搜索。")
    public ApiResponse<List<Map<String, Object>>> list(@RequestParam(required = false) String keyword) {
        return ApiResponse.ok(customerService.list(keyword));
    }

    @GetMapping("/{id}")
    @Operation(summary = "查询客户详情", description = "返回客户基础信息、销售/技术支持负责人、联系人、资料、跟进记录和关联项目。")
    public ApiResponse<Map<String, Object>> detail(@PathVariable String id) {
        return ApiResponse.ok(customerService.detail(id));
    }

    @PostMapping
    @Operation(summary = "新增客户", description = "新增客户并配置负责销售与技术支持人员。")
    public ApiResponse<Map<String, Object>> create(@Valid @RequestBody CustomerRequest request) {
        return ApiResponse.ok(customerService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "修改客户", description = "修改客户基础资料并同步负责人绑定关系。")
    public ApiResponse<Map<String, Object>> update(@PathVariable String id, @Valid @RequestBody CustomerRequest request) {
        return ApiResponse.ok(customerService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除客户", description = "删除指定客户及其联系人、资料、跟进记录等从属数据。")
    public ApiResponse<Boolean> delete(@PathVariable String id) {
        return ApiResponse.ok(customerService.delete(id));
    }

    @PostMapping("/{id}/contacts")
    @Operation(summary = "新增客户联系人", description = "为客户新增一个联系人。")
    public ApiResponse<Map<String, Object>> addContact(@PathVariable String id, @Valid @RequestBody CustomerContactRequest request) {
        return ApiResponse.ok(customerService.addContact(id, request));
    }

    @DeleteMapping("/{id}/contacts/{contactId}")
    @Operation(summary = "删除客户联系人", description = "删除客户详情中的指定联系人。")
    public ApiResponse<Map<String, Object>> deleteContact(@PathVariable String id, @PathVariable String contactId) {
        return ApiResponse.ok(customerService.deleteContact(id, contactId));
    }

    @PostMapping("/{id}/followups")
    @Operation(summary = "新增客户跟进记录", description = "以留言或附件记录客户跟进过程。")
    public ApiResponse<Map<String, Object>> addFollowup(@PathVariable String id, @Valid @RequestBody CustomerFollowupRequest request) {
        return ApiResponse.ok(customerService.addFollowup(id, request));
    }

    @PostMapping("/{id}/materials")
    @Operation(summary = "新增客户资料", description = "记录客户资料库中的文件元数据，后续可接入 OSS 文件存储。")
    public ApiResponse<Map<String, Object>> addMaterial(@PathVariable String id, @Valid @RequestBody FileMetadataRequest request) {
        return ApiResponse.ok(customerService.addMaterial(id, request));
    }
}

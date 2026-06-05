package com.kozen.kpm.customer.controller;

import com.kozen.kpm.common.api.ApiResponse;
import com.kozen.kpm.common.api.PageResult;
import com.kozen.kpm.common.dto.FileMetadataRequest;
import com.kozen.kpm.customer.dto.CustomerContactRequest;
import com.kozen.kpm.customer.dto.CustomerDto;
import com.kozen.kpm.customer.dto.CustomerFollowupRequest;
import com.kozen.kpm.customer.dto.CustomerNotificationRequest;
import com.kozen.kpm.customer.dto.CustomerNotificationResultDto;
import com.kozen.kpm.customer.dto.CustomerRequest;
import com.kozen.kpm.customer.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;

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
    public ApiResponse<List<CustomerDto>> list(@RequestParam(required = false) String keyword) {
        return ApiResponse.ok(customerService.list(keyword));
    }

    @GetMapping("/page")
    @Operation(summary = "分页查询客户列表", description = "分页和关键字搜索下沉到后端 SQL，避免客户数量增加后前端全量分页。")
    public ApiResponse<PageResult<CustomerDto>> page(@RequestParam(required = false) String keyword,
                                                     @RequestParam(defaultValue = "1") Integer page,
                                                     @RequestParam(defaultValue = "20") Integer pageSize) {
        return ApiResponse.ok(customerService.page(keyword, page, pageSize));
    }

    @GetMapping("/{id}")
    @Operation(summary = "查询客户详情", description = "返回客户基础信息、销售/技术支持负责人、联系人、资料、跟进记录和关联项目。")
    public ApiResponse<CustomerDto> detail(@PathVariable String id) {
        return ApiResponse.ok(customerService.detail(id));
    }

    @PostMapping
    @Operation(summary = "新增客户", description = "新增客户并配置负责销售与技术支持人员。")
    public ApiResponse<CustomerDto> create(@Valid @RequestBody CustomerRequest request) {
        return ApiResponse.ok(customerService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "修改客户", description = "修改客户基础资料并同步负责人绑定关系。")
    public ApiResponse<CustomerDto> update(@PathVariable String id, @Valid @RequestBody CustomerRequest request) {
        return ApiResponse.ok(customerService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除客户", description = "删除指定客户及其联系人、资料、跟进记录等从属数据。")
    public ApiResponse<Boolean> delete(@PathVariable String id) {
        return ApiResponse.ok(customerService.delete(id));
    }

    @PostMapping("/{id}/contacts")
    @Operation(summary = "新增客户联系人", description = "为客户新增一个联系人。")
    public ApiResponse<CustomerDto> addContact(@PathVariable String id, @Valid @RequestBody CustomerContactRequest request) {
        return ApiResponse.ok(customerService.addContact(id, request));
    }

    @DeleteMapping("/{id}/contacts/{contactId}")
    @Operation(summary = "删除客户联系人", description = "删除客户详情中的指定联系人。")
    public ApiResponse<CustomerDto> deleteContact(@PathVariable String id, @PathVariable String contactId) {
        return ApiResponse.ok(customerService.deleteContact(id, contactId));
    }

    @PostMapping("/{id}/followups")
    @Operation(summary = "新增客户跟进记录", description = "以留言或附件记录客户跟进过程。")
    public ApiResponse<CustomerDto> addFollowup(@PathVariable String id, @Valid @RequestBody CustomerFollowupRequest request) {
        return ApiResponse.ok(customerService.addFollowup(id, request));
    }


    @PostMapping("/{id}/notifications")
    @Operation(summary = "发送客户通知", description = "向客户所有配置了邮箱的联系人发送客户门户系统消息，并在邮件配置启用时同步发送邮件。")
    public ApiResponse<CustomerNotificationResultDto> sendNotification(@PathVariable String id,
                                                                        @Valid @RequestBody CustomerNotificationRequest request,
                                                                        @RequestHeader(value = "X-KPM-User-Name-Base64", required = false) String encodedPublisher,
                                                                        @RequestHeader(value = "X-KPM-User", required = false) String publisher,
                                                                        @RequestHeader(value = "X-KPM-Account", required = false) String publisherAccount) {
        return ApiResponse.ok(customerService.sendNotification(id, request, resolvePublisher(encodedPublisher, publisher, publisherAccount)));
    }

    @PostMapping("/{id}/materials")
    @Operation(summary = "新增客户资料", description = "记录客户资料库中的文件元数据，后续可接入 OSS 文件存储。")
    public ApiResponse<CustomerDto> addMaterial(@PathVariable String id, @Valid @RequestBody FileMetadataRequest request) {
        return ApiResponse.ok(customerService.addMaterial(id, request));
    }
    private String resolvePublisher(String encodedPublisher, String publisher, String publisherAccount) {
        String decoded = decodeBase64Utf8(encodedPublisher);
        if (hasText(decoded)) return decoded;
        if (hasText(publisher) && !publisher.contains("?")) return publisher.trim();
        if (hasText(publisherAccount)) return publisherAccount.trim();
        return "系统";
    }

    private String decodeBase64Utf8(String value) {
        if (!hasText(value)) return "";
        try {
            return new String(Base64.getUrlDecoder().decode(value.trim()), StandardCharsets.UTF_8).trim();
        } catch (IllegalArgumentException ignored) {
            return "";
        }
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }
}

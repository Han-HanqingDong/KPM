package com.kozen.kpm.customer.portal.controller;

import com.kozen.kpm.common.api.ApiResponse;
import com.kozen.kpm.common.api.PageResult;
import com.kozen.kpm.customer.knowledge.dto.KnowledgeArticleDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalCodeRequest;
import com.kozen.kpm.customer.portal.dto.CustomerPortalCodeResponse;
import com.kozen.kpm.customer.portal.dto.CustomerPortalContactDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalDataDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalLoginRequest;
import com.kozen.kpm.customer.portal.dto.CustomerPortalLoginResponse;
import com.kozen.kpm.customer.portal.dto.CustomerPortalMaterialDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalMeDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalMessageDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalUnreadCountDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalUpdatedCountDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalTaskAttachmentRequest;
import com.kozen.kpm.customer.portal.dto.CustomerPortalTaskDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalTaskCommentPageDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalTaskCommentRequest;
import com.kozen.kpm.customer.portal.dto.CustomerPortalTaskRequest;
import com.kozen.kpm.customer.portal.dto.CustomerPortalTaskStatsDto;
import com.kozen.kpm.customer.portal.service.CustomerPortalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@RestController
@RequestMapping("/api/customer-portal")
@CrossOrigin(originPatterns = "*", exposedHeaders = "X-KPM-Refresh-Token")
@Tag(name = "客户门户", description = "客户联系人邮箱验证码登录、公开项目资料和客户任务进度")
public class CustomerPortalController {
    private static final String REFRESH_TOKEN_HEADER = "X-KPM-Refresh-Token";

    private final CustomerPortalService customerPortalService;

    public CustomerPortalController(CustomerPortalService customerPortalService) {
        this.customerPortalService = customerPortalService;
    }

    @PostMapping("/request-code")
    @Operation(summary = "发送客户门户验证码", description = "联系人邮箱必须存在于客户信息联系人列表中。")
    public ApiResponse<CustomerPortalCodeResponse> requestCode(
            @Valid @RequestBody CustomerPortalCodeRequest request,
            @RequestHeader(value = "X-Forwarded-For", required = false) String requestIp
    ) {
        return ApiResponse.ok(customerPortalService.requestCode(request, requestIp));
    }

    @PostMapping("/login")
    @Operation(summary = "客户门户验证码登录", description = "校验6位动态验证码，返回客户门户 token。")
    public ApiResponse<CustomerPortalLoginResponse> login(@Valid @RequestBody CustomerPortalLoginRequest request) {
        return ApiResponse.ok(customerPortalService.login(request));
    }

    @GetMapping("/me")
    @Operation(summary = "客户门户当前联系人", description = "返回当前客户联系人和客户信息。")
    public ApiResponse<CustomerPortalMeDto> me(@RequestHeader("Authorization") String authorization, HttpServletResponse response) {
        attachRefreshToken(authorization, response);
        return ApiResponse.ok(customerPortalService.me(authorization));
    }

    @GetMapping("/data")
    @Operation(summary = "客户门户首页数据", description = "返回当前客户关联项目、任务状态筛选项、公告和消息。资料和任务列表请使用分页接口查询。")
    public ApiResponse<CustomerPortalDataDto> data(@RequestHeader("Authorization") String authorization, HttpServletResponse response) {
        attachRefreshToken(authorization, response);
        return ApiResponse.ok(customerPortalService.data(authorization));
    }

    @GetMapping("/materials/page")
    @Operation(summary = "客户门户公开项目资料分页", description = "按当前客户隔离公开资料数据，支持项目筛选和资料名称模糊搜索。")
    public ApiResponse<PageResult<CustomerPortalMaterialDto>> materialsPage(@RequestHeader("Authorization") String authorization,
                                                                            @RequestParam(required = false) String projectId,
                                                                            @RequestParam(required = false) String keyword,
                                                                            @RequestParam(defaultValue = "1") Integer page,
                                                                            @RequestParam(defaultValue = "10") Integer pageSize,
                                                                            HttpServletResponse response) {
        attachRefreshToken(authorization, response);
        return ApiResponse.ok(customerPortalService.materialsPage(authorization, projectId, keyword, page, pageSize));
    }

    @GetMapping("/contacts")
    @Operation(summary = "客户门户联系人列表", description = "返回当前客户下可用于任务创建人筛选的联系人列表。")
    public ApiResponse<List<CustomerPortalContactDto>> contacts(@RequestHeader("Authorization") String authorization,
                                                                HttpServletResponse response) {
        attachRefreshToken(authorization, response);
        return ApiResponse.ok(customerPortalService.contacts(authorization));
    }

    @GetMapping("/messages")
    @Operation(summary = "客户门户消息列表", description = "查询当前客户联系人消息，支持只看未读。")
    public ApiResponse<List<CustomerPortalMessageDto>> messages(@RequestHeader("Authorization") String authorization,
                                                                 @RequestParam(defaultValue = "false") boolean unreadOnly,
                                                                 HttpServletResponse response) {
        attachRefreshToken(authorization, response);
        return ApiResponse.ok(customerPortalService.messages(authorization, unreadOnly));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "客户门户未读消息数量", description = "查询当前客户联系人未读消息数量。")
    public ApiResponse<CustomerPortalUnreadCountDto> unreadCount(@RequestHeader("Authorization") String authorization, HttpServletResponse response) {
        attachRefreshToken(authorization, response);
        return ApiResponse.ok(new CustomerPortalUnreadCountDto(customerPortalService.unreadCount(authorization)));
    }

    @PostMapping("/messages/{id}/read")
    @Operation(summary = "客户门户消息标记已读", description = "将当前客户联系人一条消息标记为已读。")
    public ApiResponse<Boolean> markMessageRead(@RequestHeader("Authorization") String authorization,
                                                @org.springframework.web.bind.annotation.PathVariable String id,
                                                HttpServletResponse response) {
        attachRefreshToken(authorization, response);
        return ApiResponse.ok(customerPortalService.markMessageRead(authorization, id));
    }

    @PostMapping("/messages/read-all")
    @Operation(summary = "客户门户消息一键已读", description = "将当前客户联系人所有未读消息标记为已读。")
    public ApiResponse<CustomerPortalUpdatedCountDto> markAllMessagesRead(@RequestHeader("Authorization") String authorization, HttpServletResponse response) {
        attachRefreshToken(authorization, response);
        return ApiResponse.ok(new CustomerPortalUpdatedCountDto(customerPortalService.markAllMessagesRead(authorization)));
    }

    @PostMapping("/tasks")
    @Operation(summary = "客户创建工单", description = "客户选择关联项目后创建工单，系统自动分配给该客户技术支持负责人并发送内部消息。")
    public ApiResponse<CustomerPortalTaskDto> createTask(@RequestHeader("Authorization") String authorization,
                                                         @Valid @RequestBody CustomerPortalTaskRequest request,
                                                         HttpServletResponse response) {
        attachRefreshToken(authorization, response);
        return ApiResponse.ok(customerPortalService.createTask(authorization, request));
    }

    @GetMapping("/tasks/page")
    @Operation(summary = "客户门户任务分页", description = "按当前客户隔离任务数据，支持项目、状态、创建人和分页筛选。")
    public ApiResponse<PageResult<CustomerPortalTaskDto>> tasksPage(@RequestHeader("Authorization") String authorization,
                                                                     @RequestParam(required = false) String projectId,
                                                                     @RequestParam(required = false) String status,
                                                                     @RequestParam(required = false) String creatorEmail,
                                                                     @RequestParam(defaultValue = "1") Integer page,
                                                                     @RequestParam(defaultValue = "10") Integer pageSize,
                                                                     HttpServletResponse response) {
        attachRefreshToken(authorization, response);
        return ApiResponse.ok(customerPortalService.tasksPage(authorization, projectId, status, creatorEmail, page, pageSize));
    }

    @GetMapping("/tasks/{id}")
    @Operation(summary = "客户门户任务详情", description = "查询当前客户可见的一条任务详情，包含任务级附件。留言请使用分页接口查询。")
    public ApiResponse<CustomerPortalTaskDto> task(@RequestHeader("Authorization") String authorization,
                                                   @org.springframework.web.bind.annotation.PathVariable String id,
                                                   HttpServletResponse response) {
        attachRefreshToken(authorization, response);
        return ApiResponse.ok(customerPortalService.task(authorization, id));
    }

    @PostMapping("/tasks/{id}/attachments")
    @Operation(summary = "客户门户任务附件绑定", description = "客户创建工单后，将文件服务上传结果绑定到该工单。")
    public ApiResponse<CustomerPortalTaskDto> addTaskAttachments(@RequestHeader("Authorization") String authorization,
                                                                 @org.springframework.web.bind.annotation.PathVariable String id,
                                                                 @Valid @RequestBody CustomerPortalTaskAttachmentRequest request,
                                                                 HttpServletResponse response) {
        attachRefreshToken(authorization, response);
        return ApiResponse.ok(customerPortalService.addTaskAttachments(authorization, id, request));
    }

    @GetMapping("/tasks/statuses")
    @Operation(summary = "客户门户任务状态筛选项", description = "返回当前客户任务中实际存在的状态，用于前端筛选。")
    public ApiResponse<List<String>> taskStatuses(@RequestHeader("Authorization") String authorization,
                                                  HttpServletResponse response) {
        attachRefreshToken(authorization, response);
        return ApiResponse.ok(customerPortalService.taskStatuses(authorization));
    }

    @GetMapping("/tasks/stats")
    @Operation(summary = "客户门户任务交付统计", description = "统计当前客户的任务总数、完成率、平均响应和完成耗时，支持按项目过滤。")
    public ApiResponse<CustomerPortalTaskStatsDto> taskStats(@RequestHeader("Authorization") String authorization,
                                                             @RequestParam(required = false) String projectId,
                                                             HttpServletResponse response) {
        attachRefreshToken(authorization, response);
        return ApiResponse.ok(customerPortalService.taskStats(authorization, projectId));
    }

    @GetMapping("/tasks/{id}/comments")
    @Operation(summary = "客户门户任务留言分页", description = "倒序分页查询当前客户可见的任务留言，每页默认10条。")
    public ApiResponse<CustomerPortalTaskCommentPageDto> taskComments(@RequestHeader("Authorization") String authorization,
                                                                       @org.springframework.web.bind.annotation.PathVariable String id,
                                                                       @RequestParam(defaultValue = "1") int page,
                                                                       @RequestParam(defaultValue = "10") int pageSize,
                                                                       HttpServletResponse response) {
        attachRefreshToken(authorization, response);
        return ApiResponse.ok(customerPortalService.taskComments(authorization, id, page, pageSize));
    }

    @PostMapping("/tasks/{id}/comments")
    @Operation(summary = "客户新增任务留言", description = "客户在门户中给自己的任务新增外部留言，Kozen 内部任务详情同步可见。")
    public ApiResponse<CustomerPortalTaskDto> addTaskComment(@RequestHeader("Authorization") String authorization,
                                                             @org.springframework.web.bind.annotation.PathVariable String id,
                                                             @Valid @RequestBody CustomerPortalTaskCommentRequest request,
                                                             HttpServletResponse response) {
        attachRefreshToken(authorization, response);
        return ApiResponse.ok(customerPortalService.addTaskComment(authorization, id, request));
    }

    @GetMapping("/knowledge/page")
    @Operation(summary = "客户门户知识库分页", description = "分页查询当前客户可见的已发布知识库文章。")
    public ApiResponse<PageResult<KnowledgeArticleDto>> knowledgePage(@RequestHeader("Authorization") String authorization,
                                                                       @RequestParam(required = false) String keyword,
                                                                       @RequestParam(defaultValue = "1") Integer page,
                                                                       @RequestParam(defaultValue = "10") Integer pageSize,
                                                                       HttpServletResponse response) {
        attachRefreshToken(authorization, response);
        return ApiResponse.ok(customerPortalService.knowledgePage(authorization, keyword, page, pageSize));
    }

    @GetMapping("/knowledge/{id}")
    @Operation(summary = "客户门户知识库详情", description = "查询当前客户可见的一篇已发布知识库文章。")
    public ApiResponse<KnowledgeArticleDto> knowledgeDetail(@RequestHeader("Authorization") String authorization,
                                                            @org.springframework.web.bind.annotation.PathVariable String id,
                                                            HttpServletResponse response) {
        attachRefreshToken(authorization, response);
        return ApiResponse.ok(customerPortalService.knowledgeDetail(authorization, id));
    }

    private void attachRefreshToken(String authorization, HttpServletResponse response) {
        response.setHeader(REFRESH_TOKEN_HEADER, customerPortalService.refreshToken(authorization));
    }
}

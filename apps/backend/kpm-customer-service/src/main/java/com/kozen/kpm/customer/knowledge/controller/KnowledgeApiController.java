package com.kozen.kpm.customer.knowledge.controller;

import com.kozen.kpm.common.api.ApiResponse;
import com.kozen.kpm.common.api.PageResult;
import com.kozen.kpm.customer.knowledge.dto.KnowledgeArticleDto;
import com.kozen.kpm.customer.knowledge.dto.KnowledgeArticleRequest;
import com.kozen.kpm.customer.knowledge.dto.KnowledgeArticleStatusRequest;
import com.kozen.kpm.customer.knowledge.service.KnowledgeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/knowledge")
@CrossOrigin(originPatterns = "*")
@Tag(name = "知识库管理", description = "内部知识库文章发布、编辑、附件与客户门户可见范围管理")
public class KnowledgeApiController {
    private final KnowledgeService knowledgeService;

    public KnowledgeApiController(KnowledgeService knowledgeService) {
        this.knowledgeService = knowledgeService;
    }

    @GetMapping("/page")
    @Operation(summary = "分页查询知识库文章", description = "内部用户可按关键字、状态、项目、客户和任务过滤知识库文章。")
    public ApiResponse<PageResult<KnowledgeArticleDto>> page(@RequestParam(required = false) String keyword,
                                                             @RequestParam(required = false) String status,
                                                             @RequestParam(required = false) String projectId,
                                                             @RequestParam(required = false) String customerId,
                                                             @RequestParam(required = false) String taskId,
                                                             @RequestParam(defaultValue = "1") Integer page,
                                                             @RequestParam(defaultValue = "10") Integer pageSize) {
        return ApiResponse.ok(knowledgeService.page(keyword, status, projectId, customerId, taskId, page, pageSize));
    }

    @GetMapping("/{id}")
    @Operation(summary = "查询知识库文章详情")
    public ApiResponse<KnowledgeArticleDto> detail(@PathVariable String id) {
        return ApiResponse.ok(knowledgeService.detail(id));
    }

    @PostMapping
    @Operation(summary = "新增知识库文章", description = "文章初始状态固定为待审核。")
    public ApiResponse<KnowledgeArticleDto> create(@Valid @RequestBody KnowledgeArticleRequest request,
                                                   @RequestHeader("X-KPM-Account") String operator) {
        return ApiResponse.ok(knowledgeService.create(request, operator));
    }

    @PutMapping("/{id}")
    @Operation(summary = "编辑知识库文章", description = "编辑文章内容、附件和关联范围，不直接改变审核状态。")
    public ApiResponse<KnowledgeArticleDto> update(@PathVariable String id,
                                                   @Valid @RequestBody KnowledgeArticleRequest request,
                                                   @RequestHeader("X-KPM-Account") String operator) {
        return ApiResponse.ok(knowledgeService.update(id, request, operator));
    }

    @PostMapping("/{id}/status")
    @Operation(summary = "修改知识库文章状态", description = "支持将文章发布为已发布，或回退到待审核。")
    public ApiResponse<KnowledgeArticleDto> updateStatus(@PathVariable String id,
                                                         @Valid @RequestBody KnowledgeArticleStatusRequest request,
                                                         @RequestHeader("X-KPM-Account") String operator) {
        return ApiResponse.ok(knowledgeService.updateStatus(id, request, operator));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除知识库文章", description = "逻辑删除知识库文章。")
    public ApiResponse<Boolean> delete(@PathVariable String id,
                                       @RequestHeader("X-KPM-Account") String operator) {
        return ApiResponse.ok(knowledgeService.delete(id, operator));
    }
}

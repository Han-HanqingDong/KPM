package com.kozen.kpm.task.controller;

import com.kozen.kpm.common.api.ApiResponse;
import com.kozen.kpm.common.api.PageResult;
import com.kozen.kpm.common.dto.FileMetadataRequest;
import com.kozen.kpm.task.dto.TaskCommentDto;
import com.kozen.kpm.task.dto.TaskCommentRequest;
import com.kozen.kpm.task.dto.TaskDto;
import com.kozen.kpm.task.dto.TaskRequest;
import com.kozen.kpm.task.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(originPatterns = "*")
@Tag(name = "任务管理", description = "任务增删改查、附件、评论和需求状态联动")
public class TaskApiController {
    private final TaskService taskService;
    public TaskApiController(TaskService taskService) { this.taskService = taskService; }

    @GetMapping
    @Operation(summary = "查询任务列表")
    public ApiResponse<List<TaskDto>> list(@RequestParam(required = false) String keyword, @RequestParam(required = false) String status, @RequestParam(required = false) String category) { return ApiResponse.ok(taskService.list(keyword, status, category)); }
    @GetMapping("/page")
    @Operation(summary = "分页查询任务列表", description = "分页、任务状态、分类、客户、项目与关键字过滤均在后端执行。")
    public ApiResponse<PageResult<TaskDto>> page(@RequestParam(required = false) String keyword,
                                                 @RequestParam(required = false) String status,
                                                 @RequestParam(required = false) String category,
                                                 @RequestParam(required = false) String customerId,
                                                 @RequestParam(required = false) String projectId,
                                                 @RequestParam(required = false) String id,
                                                 @RequestParam(required = false) String userId,
                                                 @RequestParam(required = false) String assignee,
                                                 @RequestParam(required = false) String scope,
                                                 @RequestParam(required = false) String statusScope,
                                                 @RequestParam(required = false) List<String> completedStatuses,
                                                 @RequestParam(defaultValue = "1") Integer page,
                                                 @RequestParam(defaultValue = "20") Integer pageSize) {
        return ApiResponse.ok(taskService.page(keyword, status, category, customerId, projectId, id, userId, assignee, scope, statusScope, completedStatuses, page, pageSize));
    }
    @GetMapping("/{id}")
    @Operation(summary = "查询任务详情")
    public ApiResponse<TaskDto> detail(@PathVariable String id) { return ApiResponse.ok(taskService.detail(id)); }
    @PostMapping
    @Operation(summary = "新增任务")
    public ApiResponse<TaskDto> create(@Valid @RequestBody TaskRequest request) { return ApiResponse.ok(taskService.create(request)); }
    @PutMapping("/{id}")
    @Operation(summary = "修改任务", description = "任务状态为已完成/已拒绝时，同步关联需求状态。")
    public ApiResponse<TaskDto> update(@PathVariable String id, @Valid @RequestBody TaskRequest request) { return ApiResponse.ok(taskService.update(id, request)); }
    @DeleteMapping("/{id}")
    @Operation(summary = "删除任务")
    public ApiResponse<Boolean> delete(@PathVariable String id) { return ApiResponse.ok(taskService.delete(id)); }
    @GetMapping("/{id}/comments/page")
    @Operation(summary = "分页查询任务评论", description = "按时间倒序返回任务评论，每次默认加载 10 条，用于详情页滚动加载。")
    public ApiResponse<PageResult<TaskCommentDto>> comments(@PathVariable String id,
                                                            @RequestParam(defaultValue = "1") Integer page,
                                                            @RequestParam(defaultValue = "10") Integer pageSize) {
        return ApiResponse.ok(taskService.comments(id, page, pageSize));
    }
    @PostMapping("/{id}/comments")
    @Operation(summary = "新增任务评论")
    public ApiResponse<TaskDto> addComment(@PathVariable String id, @Valid @RequestBody TaskCommentRequest request) { return ApiResponse.ok(taskService.addComment(id, request)); }
    @PostMapping("/{id}/attachments")
    @Operation(summary = "新增任务附件")
    public ApiResponse<TaskDto> addAttachment(@PathVariable String id, @Valid @RequestBody FileMetadataRequest request) { return ApiResponse.ok(taskService.addAttachment(id, request)); }
    @DeleteMapping("/{id}/attachments/{attachmentId}")
    @Operation(summary = "删除任务附件")
    public ApiResponse<TaskDto> deleteAttachment(@PathVariable String id, @PathVariable String attachmentId) { return ApiResponse.ok(taskService.deleteAttachment(id, attachmentId)); }
}

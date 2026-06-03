package com.kozen.kpm.task.controller;

import com.kozen.kpm.common.api.ApiResponse;
import com.kozen.kpm.common.dto.FileMetadataRequest;
import com.kozen.kpm.task.dto.TaskCommentRequest;
import com.kozen.kpm.task.dto.TaskRequest;
import com.kozen.kpm.task.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(originPatterns = "*")
@Tag(name = "任务管理", description = "任务增删改查、附件、评论和需求状态联动")
public class TaskApiController {
    private final TaskService taskService;
    public TaskApiController(TaskService taskService) { this.taskService = taskService; }

    @GetMapping
    @Operation(summary = "查询任务列表")
    public ApiResponse<List<Map<String, Object>>> list(@RequestParam(required = false) String keyword, @RequestParam(required = false) String status, @RequestParam(required = false) String category) { return ApiResponse.ok(taskService.list(keyword, status, category)); }
    @GetMapping("/{id}")
    @Operation(summary = "查询任务详情")
    public ApiResponse<Map<String, Object>> detail(@PathVariable String id) { return ApiResponse.ok(taskService.detail(id)); }
    @PostMapping
    @Operation(summary = "新增任务")
    public ApiResponse<Map<String, Object>> create(@Valid @RequestBody TaskRequest request) { return ApiResponse.ok(taskService.create(request)); }
    @PutMapping("/{id}")
    @Operation(summary = "修改任务", description = "任务状态为已完成/已拒绝时，同步关联需求状态。")
    public ApiResponse<Map<String, Object>> update(@PathVariable String id, @Valid @RequestBody TaskRequest request) { return ApiResponse.ok(taskService.update(id, request)); }
    @DeleteMapping("/{id}")
    @Operation(summary = "删除任务")
    public ApiResponse<Boolean> delete(@PathVariable String id) { return ApiResponse.ok(taskService.delete(id)); }
    @PostMapping("/{id}/comments")
    @Operation(summary = "新增任务评论")
    public ApiResponse<Map<String, Object>> addComment(@PathVariable String id, @Valid @RequestBody TaskCommentRequest request) { return ApiResponse.ok(taskService.addComment(id, request)); }
    @PostMapping("/{id}/attachments")
    @Operation(summary = "新增任务附件")
    public ApiResponse<Map<String, Object>> addAttachment(@PathVariable String id, @Valid @RequestBody FileMetadataRequest request) { return ApiResponse.ok(taskService.addAttachment(id, request)); }
}

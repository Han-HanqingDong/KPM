package com.kozen.kpm.resource.controller;

import com.kozen.kpm.common.api.ApiResponse;
import com.kozen.kpm.resource.dto.DepartmentRequest;
import com.kozen.kpm.resource.dto.EnumItemRequest;
import com.kozen.kpm.resource.dto.PrototypeStateRequest;
import com.kozen.kpm.resource.dto.RoleRequest;
import com.kozen.kpm.resource.dto.TaskStatusTransitionRequest;
import com.kozen.kpm.resource.dto.UserRequest;
import com.kozen.kpm.resource.service.ResourceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(originPatterns = "*")
@Tag(name = "资源管理", description = "用户、部门、角色、权限、系统枚举与原型试用状态")
public class ResourceApiController {
    private final ResourceService resourceService;

    public ResourceApiController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @GetMapping("/bootstrap")
    @Operation(summary = "获取资源启动数据", description = "返回用户、部门、角色、权限、枚举和任务状态流转。")
    public ApiResponse<Map<String, Object>> bootstrap() {
        return ApiResponse.ok(resourceService.bootstrap());
    }

    @GetMapping("/prototype-state")
    @Operation(summary = "获取原型试用状态", description = "用于试点阶段保存与恢复原型 UI 状态。正式接口联调完成后会逐步下线。")
    public ApiResponse<Object> prototypeState() {
        return ApiResponse.ok(resourceService.prototypeState());
    }

    @PostMapping("/prototype-state")
    @Operation(summary = "保存原型试用状态", description = "将当前原型 UI 状态持久化到 PostgreSQL。")
    public ApiResponse<Boolean> savePrototypeState(@RequestBody PrototypeStateRequest request) {
        return ApiResponse.ok(resourceService.savePrototypeState(request));
    }

    @GetMapping("/users")
    @Operation(summary = "查询用户列表")
    public ApiResponse<List<Map<String, Object>>> users() {
        return ApiResponse.ok(resourceService.users());
    }

    @PostMapping("/users")
    @Operation(summary = "新增用户")
    public ApiResponse<Map<String, Object>> createUser(@Valid @RequestBody UserRequest request) {
        return ApiResponse.ok(resourceService.createUser(request));
    }

    @PutMapping("/users/{id}")
    @Operation(summary = "修改用户")
    public ApiResponse<Map<String, Object>> updateUser(@PathVariable String id, @Valid @RequestBody UserRequest request) {
        return ApiResponse.ok(resourceService.updateUser(id, request));
    }

    @PostMapping("/users/{id}/reset-password")
    @Operation(summary = "重置用户密码", description = "管理员将用户密码重置为系统默认密码。")
    public ApiResponse<Map<String, Object>> resetUserPassword(@PathVariable String id) {
        return ApiResponse.ok(resourceService.resetUserPassword(id));
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "删除用户")
    public ApiResponse<Boolean> deleteUser(@PathVariable String id) {
        return ApiResponse.ok(resourceService.deleteUser(id));
    }

    @GetMapping("/departments")
    @Operation(summary = "查询部门列表", description = "部门为平铺结构，人数由用户-部门关系自动统计。")
    public ApiResponse<List<Map<String, Object>>> departments() {
        return ApiResponse.ok(resourceService.departments());
    }

    @PostMapping("/departments")
    @Operation(summary = "新增部门")
    public ApiResponse<Map<String, Object>> createDepartment(@Valid @RequestBody DepartmentRequest request) {
        return ApiResponse.ok(resourceService.createDepartment(request));
    }

    @PutMapping("/departments/{id}")
    @Operation(summary = "修改部门")
    public ApiResponse<Map<String, Object>> updateDepartment(@PathVariable String id, @Valid @RequestBody DepartmentRequest request) {
        return ApiResponse.ok(resourceService.updateDepartment(id, request));
    }

    @DeleteMapping("/departments/{id}")
    @Operation(summary = "删除部门")
    public ApiResponse<Boolean> deleteDepartment(@PathVariable String id) {
        return ApiResponse.ok(resourceService.deleteDepartment(id));
    }

    @GetMapping("/roles")
    @Operation(summary = "查询角色列表")
    public ApiResponse<List<Map<String, Object>>> roles() {
        return ApiResponse.ok(resourceService.roles());
    }

    @PostMapping("/roles")
    @Operation(summary = "新增角色")
    public ApiResponse<Map<String, Object>> createRole(@Valid @RequestBody RoleRequest request) {
        return ApiResponse.ok(resourceService.createRole(request));
    }

    @PutMapping("/roles/{id}")
    @Operation(summary = "修改角色")
    public ApiResponse<Map<String, Object>> updateRole(@PathVariable String id, @Valid @RequestBody RoleRequest request) {
        return ApiResponse.ok(resourceService.updateRole(id, request));
    }

    @DeleteMapping("/roles/{id}")
    @Operation(summary = "删除角色")
    public ApiResponse<Boolean> deleteRole(@PathVariable String id) {
        return ApiResponse.ok(resourceService.deleteRole(id));
    }

    @PostMapping("/enums")
    @Operation(summary = "新增枚举值")
    public ApiResponse<Map<String, Object>> createEnum(@Valid @RequestBody EnumItemRequest request) {
        return ApiResponse.ok(resourceService.createEnum(request));
    }

    @PutMapping("/enums/{id}")
    @Operation(summary = "修改枚举值")
    public ApiResponse<Map<String, Object>> updateEnum(@PathVariable String id, @Valid @RequestBody EnumItemRequest request) {
        return ApiResponse.ok(resourceService.updateEnum(id, request));
    }

    @DeleteMapping("/enums/{id}")
    @Operation(summary = "删除枚举值")
    public ApiResponse<Boolean> deleteEnum(@PathVariable String id) {
        return ApiResponse.ok(resourceService.deleteEnum(id));
    }

    @PostMapping("/task-status-transitions")
    @Operation(summary = "新增任务状态流转", description = "配置任务从一个状态允许流转到另一个状态。")
    public ApiResponse<Map<String, Object>> createTaskStatusTransition(@Valid @RequestBody TaskStatusTransitionRequest request) {
        return ApiResponse.ok(resourceService.createTaskStatusTransition(request));
    }

    @DeleteMapping("/task-status-transitions/{id}")
    @Operation(summary = "删除任务状态流转")
    public ApiResponse<Boolean> deleteTaskStatusTransition(@PathVariable String id) {
        return ApiResponse.ok(resourceService.deleteTaskStatusTransition(id));
    }
}

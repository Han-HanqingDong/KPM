package com.kozen.kpm.project.controller;

import com.kozen.kpm.common.api.ApiResponse;
import com.kozen.kpm.common.dto.FileMetadataRequest;
import com.kozen.kpm.project.dto.ArchiveProjectRequest;
import com.kozen.kpm.project.dto.LinkCustomerRequest;
import com.kozen.kpm.project.dto.ProcessTemplateRequest;
import com.kozen.kpm.project.dto.ProjectCustomerStatusRequest;
import com.kozen.kpm.project.dto.ProjectMembersRequest;
import com.kozen.kpm.project.dto.ProjectRequest;
import com.kozen.kpm.project.dto.RequirementRequest;
import com.kozen.kpm.project.dto.StageRecordRequest;
import com.kozen.kpm.project.dto.StageStatusRequest;
import com.kozen.kpm.project.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(originPatterns = "*")
@Tag(name = "项目管理", description = "项目、成员、阶段、资料、客户关联、客户需求与流程模板管理")
public class ProjectApiController {
    private final ProjectService projectService;

    public ProjectApiController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    @Operation(summary = "查询项目列表", description = "支持按关键字、可销售状态和归档状态过滤。")
    public ApiResponse<List<Map<String, Object>>> list(@RequestParam(required = false) String keyword,
                                                        @RequestParam(required = false) String salesability,
                                                        @RequestParam(required = false) Boolean archived) {
        return ApiResponse.ok(projectService.list(keyword, salesability, archived));
    }

    @GetMapping("/{id}")
    @Operation(summary = "查询项目详情", description = "返回项目成员、阶段、阶段资料、阶段记录、关联客户、客户需求与项目资料区。")
    public ApiResponse<Map<String, Object>> detail(@PathVariable String id) {
        return ApiResponse.ok(projectService.detail(id));
    }

    @PostMapping
    @Operation(summary = "新增项目", description = "新增项目、初始化项目成员和流程阶段；项目负责人会自动加入项目成员。")
    public ApiResponse<Map<String, Object>> create(@Valid @RequestBody ProjectRequest request) {
        return ApiResponse.ok(projectService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "修改项目", description = "修改项目基础信息；如请求中包含成员或阶段，则同步更新成员与阶段负责人。")
    public ApiResponse<Map<String, Object>> update(@PathVariable String id, @Valid @RequestBody ProjectRequest request) {
        return ApiResponse.ok(projectService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除项目", description = "删除项目及其从属成员、阶段、资料与需求。")
    public ApiResponse<Boolean> delete(@PathVariable String id) {
        return ApiResponse.ok(projectService.delete(id));
    }

    @PutMapping("/stages/{stageId}")
    @Operation(summary = "修改阶段状态", description = "阶段负责人维护阶段状态后，系统自动同步项目总体状态。")
    public ApiResponse<Map<String, Object>> updateStage(@PathVariable String stageId, @Valid @RequestBody StageStatusRequest request) {
        return ApiResponse.ok(projectService.updateStage(stageId, request));
    }

    @PutMapping("/{id}/members")
    @Operation(summary = "替换项目成员", description = "弹窗维护项目成员时保存完整成员列表。")
    public ApiResponse<Map<String, Object>> replaceMembers(@PathVariable String id, @Valid @RequestBody ProjectMembersRequest request) {
        return ApiResponse.ok(projectService.replaceMembers(id, request));
    }

    @PostMapping("/{projectId}/customers")
    @Operation(summary = "关联项目客户", description = "将客户加入项目，并设置客户在该项目下的状态。")
    public ApiResponse<Map<String, Object>> linkCustomer(@PathVariable String projectId, @Valid @RequestBody LinkCustomerRequest request) {
        return ApiResponse.ok(projectService.linkCustomer(projectId, request));
    }

    @PutMapping("/{projectId}/customers/{customerId}")
    @Operation(summary = "修改客户项目状态", description = "维护客户在某项目下的生命周期状态，例如商机发掘、样机测试、订单冲刺等。")
    public ApiResponse<Map<String, Object>> updateProjectCustomerStatus(@PathVariable String projectId,
                                                                        @PathVariable String customerId,
                                                                        @Valid @RequestBody ProjectCustomerStatusRequest request) {
        return ApiResponse.ok(projectService.updateProjectCustomerStatus(projectId, customerId, request));
    }

    @PostMapping("/stages/{stageId}/records")
    @Operation(summary = "新增阶段记录", description = "在阶段详情中新增类似论坛留言的阶段记录。")
    public ApiResponse<Map<String, Object>> addStageRecord(@PathVariable String stageId, @Valid @RequestBody StageRecordRequest request) {
        return ApiResponse.ok(projectService.addStageRecord(stageId, request));
    }

    @PostMapping("/stages/{stageId}/materials")
    @Operation(summary = "新增阶段资料", description = "上传或记录阶段资料，支持后续接入 OSS 文件存储。")
    public ApiResponse<Map<String, Object>> addStageMaterial(@PathVariable String stageId, @Valid @RequestBody FileMetadataRequest request) {
        return ApiResponse.ok(projectService.addStageMaterial(stageId, request));
    }

    @PostMapping("/stage-materials/{materialId}/publish")
    @Operation(summary = "发布阶段资料到项目资料区", description = "经过二次确认后，将阶段资料发布到项目资料区。")
    public ApiResponse<Map<String, Object>> publishStageMaterial(@PathVariable String materialId) {
        return ApiResponse.ok(projectService.publishStageMaterial(materialId));
    }

    @PostMapping("/{id}/archive")
    @Operation(summary = "归档或取消归档项目", description = "归档按钮需前端二次确认，后端记录归档状态。")
    public ApiResponse<Map<String, Object>> archive(@PathVariable String id, @Valid @RequestBody ArchiveProjectRequest request) {
        return ApiResponse.ok(projectService.archive(id, request));
    }

    @GetMapping("/{id}/requirements-overview")
    @Operation(summary = "查询项目需求纵览", description = "按需求标题汇总不同客户的共性需求，用于需求提取与抽象。")
    public ApiResponse<List<Map<String, Object>>> requirementOverview(@PathVariable String id) {
        return ApiResponse.ok(projectService.requirementOverview(id));
    }

    @PostMapping("/{projectId}/customers/{customerId}/requirements")
    @Operation(summary = "新增客户需求", description = "在客户-项目维度新增需求，并可自动创建关联任务。")
    public ApiResponse<Map<String, Object>> createRequirement(@PathVariable String projectId,
                                                              @PathVariable String customerId,
                                                              @Valid @RequestBody RequirementRequest request) {
        return ApiResponse.ok(projectService.createRequirement(projectId, customerId, request));
    }

    @PostMapping("/requirements/{id}/void")
    @Operation(summary = "作废需求", description = "将需求状态标记为已作废，保留历史记录。")
    public ApiResponse<Map<String, Object>> voidRequirement(@PathVariable String id) {
        return ApiResponse.ok(projectService.voidRequirement(id));
    }

    @DeleteMapping("/requirements/{id}")
    @Operation(summary = "删除需求", description = "删除指定需求记录。")
    public ApiResponse<Boolean> deleteRequirement(@PathVariable String id) {
        return ApiResponse.ok(projectService.deleteRequirement(id));
    }

    @GetMapping("/templates")
    @Operation(summary = "查询流程模板", description = "查询可配置的项目流程模板及阶段列表。")
    public ApiResponse<List<Map<String, Object>>> templates() {
        return ApiResponse.ok(projectService.templates());
    }

    @PostMapping("/templates")
    @Operation(summary = "新增流程模板", description = "新增流程模板并维护阶段枚举顺序。")
    public ApiResponse<Map<String, Object>> createTemplate(@Valid @RequestBody ProcessTemplateRequest request) {
        return ApiResponse.ok(projectService.createTemplate(request));
    }

    @PutMapping("/templates/{id}")
    @Operation(summary = "修改流程模板", description = "修改流程模板基础信息，并整体替换阶段列表。")
    public ApiResponse<Map<String, Object>> updateTemplate(@PathVariable String id, @Valid @RequestBody ProcessTemplateRequest request) {
        return ApiResponse.ok(projectService.updateTemplate(id, request));
    }

    @DeleteMapping("/templates/{id}")
    @Operation(summary = "删除流程模板", description = "删除指定流程模板及模板阶段。")
    public ApiResponse<Boolean> deleteTemplate(@PathVariable String id) {
        return ApiResponse.ok(projectService.deleteTemplate(id));
    }
}

package com.kozen.kpm.project.controller;

import com.kozen.kpm.common.api.ApiResponse;
import com.kozen.kpm.common.api.PageResult;
import com.kozen.kpm.common.dto.FileMetadataRequest;
import com.kozen.kpm.project.dto.ArchiveProjectRequest;
import com.kozen.kpm.project.dto.LinkCustomerRequest;
import com.kozen.kpm.project.dto.ProcessTemplateDto;
import com.kozen.kpm.project.dto.ProcessTemplateRequest;
import com.kozen.kpm.project.dto.ProjectCustomerStatusRequest;
import com.kozen.kpm.project.dto.ProjectDto;
import com.kozen.kpm.project.dto.ProjectMembersRequest;
import com.kozen.kpm.project.dto.ProjectRequest;
import com.kozen.kpm.project.dto.ProjectAnnouncementRequest;
import com.kozen.kpm.project.dto.ProjectSkuDto;
import com.kozen.kpm.project.dto.ProjectSkuRequest;
import com.kozen.kpm.project.dto.RequirementDto;
import com.kozen.kpm.project.dto.RequirementOverviewDto;
import com.kozen.kpm.project.dto.RequirementRequest;
import com.kozen.kpm.project.dto.StageRecordRequest;
import com.kozen.kpm.project.dto.StageAssigneesRequest;
import com.kozen.kpm.project.dto.StageStatusRequest;
import com.kozen.kpm.project.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;

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
    @Operation(summary = "查询项目列表", description = "支持按关键字和归档状态过滤；项目总体进度由阶段状态体现。")
    public ApiResponse<List<ProjectDto>> list(@RequestParam(required = false) String keyword,
                                                        @RequestParam(required = false) Boolean archived) {
        return ApiResponse.ok(projectService.list(keyword, archived));
    }

    @GetMapping("/page")
    @Operation(summary = "分页查询项目列表", description = "分页、关键字与归档状态过滤均在后端 SQL 执行，避免前端拉取全量项目。")
    public ApiResponse<PageResult<ProjectDto>> page(@RequestParam(required = false) String keyword,
                                                    @RequestParam(required = false) Boolean archived,
                                                    @RequestParam(defaultValue = "1") Integer page,
                                                    @RequestParam(defaultValue = "20") Integer pageSize) {
        return ApiResponse.ok(projectService.page(keyword, archived, page, pageSize));
    }

    @GetMapping("/{id}")
    @Operation(summary = "查询项目详情", description = "返回项目成员、阶段、阶段资料、阶段记录、关联客户、客户需求与项目资料区。")
    public ApiResponse<ProjectDto> detail(@PathVariable String id) {
        return ApiResponse.ok(projectService.detail(id));
    }

    @PostMapping
    @Operation(summary = "新增项目", description = "新增项目、初始化项目成员和流程阶段；项目负责人会自动加入项目成员。")
    public ApiResponse<ProjectDto> create(@Valid @RequestBody ProjectRequest request) {
        return ApiResponse.ok(projectService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "修改项目", description = "修改项目基础信息；如请求中包含成员或阶段，则同步更新成员与阶段负责人。")
    public ApiResponse<ProjectDto> update(@PathVariable String id, @Valid @RequestBody ProjectRequest request) {
        return ApiResponse.ok(projectService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除项目", description = "删除项目及其从属成员、阶段、资料与需求。")
    public ApiResponse<Boolean> delete(@PathVariable String id) {
        return ApiResponse.ok(projectService.delete(id));
    }

    @PutMapping("/stages/{stageId}")
    @Operation(summary = "修改阶段状态", description = "只有该阶段配置的负责人可以维护阶段状态；项目不再保存独立总体状态。")
    public ApiResponse<ProjectDto> updateStage(@PathVariable String stageId,
                                               @Valid @RequestBody StageStatusRequest request,
                                               @RequestHeader(value = "X-KPM-Account", required = false) String operatorAccount) {
        return ApiResponse.ok(projectService.updateStage(stageId, request, operatorAccount));
    }

    @PutMapping("/stages/{stageId}/assignees")
    @Operation(summary = "替换阶段负责人", description = "在项目详情或阶段详情中维护阶段负责人，负责人必须从已有用户中选择。")
    public ApiResponse<ProjectDto> replaceStageAssignees(@PathVariable String stageId, @Valid @RequestBody StageAssigneesRequest request) {
        return ApiResponse.ok(projectService.replaceStageAssignees(stageId, request));
    }

    @PutMapping("/{id}/members")
    @Operation(summary = "替换项目成员", description = "弹窗维护项目成员时保存完整成员列表。")
    public ApiResponse<ProjectDto> replaceMembers(@PathVariable String id, @Valid @RequestBody ProjectMembersRequest request) {
        return ApiResponse.ok(projectService.replaceMembers(id, request));
    }

    @GetMapping("/{id}/skus")
    @Operation(summary = "查询项目 SKU", description = "查询项目下可用于订单选择的 SKU 配置。")
    public ApiResponse<List<ProjectSkuDto>> skus(@PathVariable String id) {
        return ApiResponse.ok(projectService.skus(id));
    }

    @PostMapping("/{id}/skus")
    @Operation(summary = "新增项目 SKU", description = "维护项目下单时可选择的 SKU 主数据。")
    public ApiResponse<ProjectSkuDto> createSku(@PathVariable String id,
                                                      @Valid @RequestBody ProjectSkuRequest request,
                                                      @RequestHeader(value = "X-KPM-Account", required = false) String operator) {
        return ApiResponse.ok(projectService.createSku(id, request, operator));
    }

    @PutMapping("/{id}/skus/{skuId}")
    @Operation(summary = "修改项目 SKU", description = "修改整机料号、配置名称、内存类型或启用状态。")
    public ApiResponse<ProjectSkuDto> updateSku(@PathVariable String id,
                                                      @PathVariable String skuId,
                                                      @Valid @RequestBody ProjectSkuRequest request,
                                                      @RequestHeader(value = "X-KPM-Account", required = false) String operator) {
        return ApiResponse.ok(projectService.updateSku(id, skuId, request, operator));
    }

    @DeleteMapping("/{id}/skus/{skuId}")
    @Operation(summary = "删除项目 SKU", description = "逻辑删除项目 SKU；历史订单快照不受影响。")
    public ApiResponse<Boolean> deleteSku(@PathVariable String id,
                                          @PathVariable String skuId,
                                          @RequestHeader(value = "X-KPM-Account", required = false) String operator) {
        return ApiResponse.ok(projectService.deleteSku(id, skuId, operator));
    }

    @PostMapping("/{projectId}/customers")
    @Operation(summary = "关联项目客户", description = "将客户加入项目，并设置客户在该项目下的状态。")
    public ApiResponse<ProjectDto> linkCustomer(@PathVariable String projectId, @Valid @RequestBody LinkCustomerRequest request) {
        return ApiResponse.ok(projectService.linkCustomer(projectId, request));
    }

    @PutMapping("/{projectId}/customers/{customerId}")
    @Operation(summary = "修改客户项目状态", description = "维护客户在某项目下的生命周期状态，例如商机发掘、样机测试、订单冲刺等。")
    public ApiResponse<ProjectDto> updateProjectCustomerStatus(@PathVariable String projectId,
                                                                        @PathVariable String customerId,
                                                                        @Valid @RequestBody ProjectCustomerStatusRequest request) {
        return ApiResponse.ok(projectService.updateProjectCustomerStatus(projectId, customerId, request));
    }

    @PostMapping("/stages/{stageId}/records")
    @Operation(summary = "新增阶段记录", description = "在阶段详情中新增类似论坛留言的阶段记录。")
    public ApiResponse<ProjectDto> addStageRecord(@PathVariable String stageId, @Valid @RequestBody StageRecordRequest request) {
        return ApiResponse.ok(projectService.addStageRecord(stageId, request));
    }

    @PostMapping("/stages/{stageId}/materials")
    @Operation(summary = "新增阶段资料", description = "上传或记录阶段资料，支持后续接入 OSS 文件存储。")
    public ApiResponse<ProjectDto> addStageMaterial(@PathVariable String stageId, @Valid @RequestBody FileMetadataRequest request) {
        return ApiResponse.ok(projectService.addStageMaterial(stageId, request));
    }

    @PostMapping("/{id}/materials")
    @Operation(summary = "新增项目资料", description = "直接上传或记录项目资料区文件元数据。")
    public ApiResponse<ProjectDto> addProjectMaterial(@PathVariable String id, @Valid @RequestBody FileMetadataRequest request) {
        return ApiResponse.ok(projectService.addProjectMaterial(id, request));
    }

    @PostMapping("/{id}/materials/{materialId}/public")
    @Operation(summary = "公开项目资料给客户", description = "经过二次确认后，将项目资料标记为客户门户可见。")
    public ApiResponse<ProjectDto> publishProjectMaterialToCustomer(@PathVariable String id, @PathVariable String materialId) {
        return ApiResponse.ok(projectService.publishProjectMaterialToCustomer(id, materialId));
    }

    @PostMapping("/{id}/materials/{materialId}/retract")
    @Operation(summary = "下架客户可见项目资料", description = "将已公开的项目资料从客户门户下架，但保留项目资料记录。")
    public ApiResponse<ProjectDto> retractProjectMaterialFromCustomer(@PathVariable String id,
                                                                      @PathVariable String materialId,
                                                                      @RequestHeader(value = "X-KPM-Account", required = false) String operator) {
        return ApiResponse.ok(projectService.retractProjectMaterialFromCustomer(id, materialId, operator));
    }

    @DeleteMapping("/{id}/materials/{materialId}")
    @Operation(summary = "删除项目资料", description = "逻辑删除项目资料，若资料已公开则同步取消客户门户可见。")
    public ApiResponse<ProjectDto> deleteProjectMaterial(@PathVariable String id,
                                                         @PathVariable String materialId,
                                                         @RequestHeader(value = "X-KPM-Account", required = false) String operator) {
        return ApiResponse.ok(projectService.deleteProjectMaterial(id, materialId, operator));
    }

    @PostMapping("/stage-materials/{materialId}/publish")
    @Operation(summary = "发布阶段资料到项目资料区", description = "经过二次确认后，将阶段资料发布到项目资料区。")
    public ApiResponse<ProjectDto> publishStageMaterial(@PathVariable String materialId) {
        return ApiResponse.ok(projectService.publishStageMaterial(materialId));
    }

    @PostMapping("/{id}/announcements")
    @Operation(summary = "发布项目公告", description = "向项目关联客户发布公告；客户门户顶部滚动展示，并同步进入客户消息盒子。")
    public ApiResponse<ProjectDto> publishAnnouncement(@PathVariable String id,
                                                       @Valid @RequestBody ProjectAnnouncementRequest request,
                                                       @RequestHeader(value = "X-KPM-User-Name-Base64", required = false) String encodedPublisher,
                                                       @RequestHeader(value = "X-KPM-User", required = false) String publisher,
                                                       @RequestHeader(value = "X-KPM-Account", required = false) String publisherAccount) {
        return ApiResponse.ok(projectService.publishAnnouncement(id, request, resolvePublisher(encodedPublisher, publisher, publisherAccount)));
    }

    @PostMapping("/{id}/announcements/{announcementId}/retract")
    @Operation(summary = "撤回项目公告", description = "撤回后客户门户不再展示该公告，公告历史仍保留发布人与撤回信息。")
    public ApiResponse<ProjectDto> retractAnnouncement(@PathVariable String id,
                                                       @PathVariable String announcementId,
                                                       @RequestHeader(value = "X-KPM-User-Name-Base64", required = false) String encodedPublisher,
                                                       @RequestHeader(value = "X-KPM-User", required = false) String publisher,
                                                       @RequestHeader(value = "X-KPM-Account", required = false) String publisherAccount) {
        return ApiResponse.ok(projectService.retractAnnouncement(id, announcementId, resolvePublisher(encodedPublisher, publisher, publisherAccount)));
    }

    @PostMapping("/{id}/archive")
    @Operation(summary = "归档或取消归档项目", description = "归档按钮需前端二次确认，后端记录归档状态。")
    public ApiResponse<ProjectDto> archive(@PathVariable String id, @Valid @RequestBody ArchiveProjectRequest request) {
        return ApiResponse.ok(projectService.archive(id, request));
    }

    @GetMapping("/{id}/requirements-overview")
    @Operation(summary = "查询项目需求纵览", description = "按需求标题汇总不同客户的共性需求，用于需求提取与抽象。")
    public ApiResponse<List<RequirementOverviewDto>> requirementOverview(@PathVariable String id) {
        return ApiResponse.ok(projectService.requirementOverview(id));
    }

    @PostMapping("/{projectId}/customers/{customerId}/requirements")
    @Operation(summary = "新增客户需求", description = "在客户-项目维度新增需求，并可自动创建关联任务。")
    public ApiResponse<RequirementDto> createRequirement(@PathVariable String projectId,
                                                              @PathVariable String customerId,
                                                              @Valid @RequestBody RequirementRequest request) {
        return ApiResponse.ok(projectService.createRequirement(projectId, customerId, request));
    }

    @PostMapping("/requirements/{id}/void")
    @Operation(summary = "作废需求", description = "将需求状态标记为已作废，保留历史记录。")
    public ApiResponse<RequirementDto> voidRequirement(@PathVariable String id) {
        return ApiResponse.ok(projectService.voidRequirement(id));
    }

    @DeleteMapping("/requirements/{id}")
    @Operation(summary = "删除需求", description = "删除指定需求记录。")
    public ApiResponse<Boolean> deleteRequirement(@PathVariable String id) {
        return ApiResponse.ok(projectService.deleteRequirement(id));
    }

    @GetMapping("/templates")
    @Operation(summary = "查询流程模板", description = "查询可配置的项目流程模板及阶段列表。")
    public ApiResponse<List<ProcessTemplateDto>> templates() {
        return ApiResponse.ok(projectService.templates());
    }

    @PostMapping("/templates")
    @Operation(summary = "新增流程模板", description = "新增流程模板并维护阶段枚举顺序。")
    public ApiResponse<ProcessTemplateDto> createTemplate(@Valid @RequestBody ProcessTemplateRequest request) {
        return ApiResponse.ok(projectService.createTemplate(request));
    }

    @PutMapping("/templates/{id}")
    @Operation(summary = "修改流程模板", description = "修改流程模板基础信息，并整体替换阶段列表。")
    public ApiResponse<ProcessTemplateDto> updateTemplate(@PathVariable String id, @Valid @RequestBody ProcessTemplateRequest request) {
        return ApiResponse.ok(projectService.updateTemplate(id, request));
    }

    @DeleteMapping("/templates/{id}")
    @Operation(summary = "删除流程模板", description = "删除指定流程模板及模板阶段。")
    public ApiResponse<Boolean> deleteTemplate(@PathVariable String id) {
        return ApiResponse.ok(projectService.deleteTemplate(id));
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

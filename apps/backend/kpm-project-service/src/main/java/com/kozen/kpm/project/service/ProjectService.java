package com.kozen.kpm.project.service;

import com.kozen.kpm.common.dto.FileMetadataRequest;
import com.kozen.kpm.project.dto.ArchiveProjectRequest;
import com.kozen.kpm.project.dto.LinkCustomerRequest;
import com.kozen.kpm.project.dto.ProcessTemplateDto;
import com.kozen.kpm.project.dto.ProcessTemplateRequest;
import com.kozen.kpm.project.dto.ProjectCustomerStatusRequest;
import com.kozen.kpm.project.dto.ProjectDto;
import com.kozen.kpm.project.dto.ProjectMembersRequest;
import com.kozen.kpm.project.dto.ProjectRequest;
import com.kozen.kpm.project.dto.ProjectSkuDto;
import com.kozen.kpm.project.dto.ProjectSkuRequest;
import com.kozen.kpm.project.dto.RequirementDto;
import com.kozen.kpm.project.dto.RequirementOverviewDto;
import com.kozen.kpm.project.dto.RequirementRequest;
import com.kozen.kpm.project.dto.StageRecordRequest;
import com.kozen.kpm.project.dto.StageAssigneesRequest;
import com.kozen.kpm.project.dto.StageStatusRequest;

import java.util.List;

/**
 * Project domain service.
 * Responsible for project master data, project members, stages, stage materials,
 * stage records, project-customer links, requirements and process templates.
 */
public interface ProjectService {
    /** Query project list by keyword, salesability and archive status. */
    List<ProjectDto> list(String keyword, String salesability, Boolean archived);

    /** Load one project with members, stages, customers, requirements and materials. */
    ProjectDto detail(String id);

    /** Create a project, initialize members and project stages, then sync project status. */
    ProjectDto create(ProjectRequest request);

    /** Update project base data, optionally replacing members and stage assignees. */
    ProjectDto update(String id, ProjectRequest request);

    /** Delete one project by ID. */
    boolean delete(String id);

    /** Update stage status and sync the derived project status. */
    ProjectDto updateStage(String stageId, StageStatusRequest request);

    /** Replace all assignees of one project stage. */
    ProjectDto replaceStageAssignees(String stageId, StageAssigneesRequest request);

    /** Replace all project members. */
    ProjectDto replaceMembers(String id, ProjectMembersRequest request);

    /** Query project SKU list. */
    List<ProjectSkuDto> skus(String projectId);

    /** Create a project SKU. */
    ProjectSkuDto createSku(String projectId, ProjectSkuRequest request, String operator);

    /** Update a project SKU. */
    ProjectSkuDto updateSku(String projectId, String skuId, ProjectSkuRequest request, String operator);

    /** Logically delete a project SKU. */
    boolean deleteSku(String projectId, String skuId, String operator);

    /** Link or update a customer under the project. */
    ProjectDto linkCustomer(String projectId, LinkCustomerRequest request);

    /** Update a customer's project-specific lifecycle status. */
    ProjectDto updateProjectCustomerStatus(String projectId, String customerId, ProjectCustomerStatusRequest request);

    /** Add a forum-style stage record. */
    ProjectDto addStageRecord(String stageId, StageRecordRequest request);

    /** Add one stage material metadata record. */
    ProjectDto addStageMaterial(String stageId, FileMetadataRequest request);

    /** Publish a stage material to the project material area. */
    ProjectDto publishStageMaterial(String materialId);

    /** Archive or unarchive a project. */
    ProjectDto archive(String id, ArchiveProjectRequest request);

    /** Summarize common requirements across customers under one project. */
    List<RequirementOverviewDto> requirementOverview(String id);

    /** Create a requirement and optionally create a linked task. */
    RequirementDto createRequirement(String projectId, String customerId, RequirementRequest request);

    /** Mark a requirement as void. */
    RequirementDto voidRequirement(String id);

    /** Delete a requirement by ID. */
    boolean deleteRequirement(String id);

    /** Query all process templates with stages. */
    List<ProcessTemplateDto> templates();

    /** Create one process template. */
    ProcessTemplateDto createTemplate(ProcessTemplateRequest request);

    /** Update one process template and replace its stages. */
    ProcessTemplateDto updateTemplate(String id, ProcessTemplateRequest request);

    /** Delete one process template. */
    boolean deleteTemplate(String id);
}

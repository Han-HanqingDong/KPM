package com.kozen.kpm.project.service;

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

import java.util.List;
import java.util.Map;

/**
 * Project domain service.
 * Responsible for project master data, project members, stages, stage materials,
 * stage records, project-customer links, requirements and process templates.
 */
public interface ProjectService {
    /** Query project list by keyword, salesability and archive status. */
    List<Map<String, Object>> list(String keyword, String salesability, Boolean archived);

    /** Load one project with members, stages, customers, requirements and materials. */
    Map<String, Object> detail(String id);

    /** Create a project, initialize members and project stages, then sync project status. */
    Map<String, Object> create(ProjectRequest request);

    /** Update project base data, optionally replacing members and stage assignees. */
    Map<String, Object> update(String id, ProjectRequest request);

    /** Delete one project by ID. */
    boolean delete(String id);

    /** Update stage status and sync the derived project status. */
    Map<String, Object> updateStage(String stageId, StageStatusRequest request);

    /** Replace all project members. */
    Map<String, Object> replaceMembers(String id, ProjectMembersRequest request);

    /** Link or update a customer under the project. */
    Map<String, Object> linkCustomer(String projectId, LinkCustomerRequest request);

    /** Update a customer's project-specific lifecycle status. */
    Map<String, Object> updateProjectCustomerStatus(String projectId, String customerId, ProjectCustomerStatusRequest request);

    /** Add a forum-style stage record. */
    Map<String, Object> addStageRecord(String stageId, StageRecordRequest request);

    /** Add one stage material metadata record. */
    Map<String, Object> addStageMaterial(String stageId, FileMetadataRequest request);

    /** Publish a stage material to the project material area. */
    Map<String, Object> publishStageMaterial(String materialId);

    /** Archive or unarchive a project. */
    Map<String, Object> archive(String id, ArchiveProjectRequest request);

    /** Summarize common requirements across customers under one project. */
    List<Map<String, Object>> requirementOverview(String id);

    /** Create a requirement and optionally create a linked task. */
    Map<String, Object> createRequirement(String projectId, String customerId, RequirementRequest request);

    /** Mark a requirement as void. */
    Map<String, Object> voidRequirement(String id);

    /** Delete a requirement by ID. */
    boolean deleteRequirement(String id);

    /** Query all process templates with stages. */
    List<Map<String, Object>> templates();

    /** Create one process template. */
    Map<String, Object> createTemplate(ProcessTemplateRequest request);

    /** Update one process template and replace its stages. */
    Map<String, Object> updateTemplate(String id, ProcessTemplateRequest request);

    /** Delete one process template. */
    boolean deleteTemplate(String id);
}

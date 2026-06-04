package com.kozen.kpm.project.converter;

import com.kozen.kpm.common.util.JsonUtil;
import com.kozen.kpm.project.dto.ProcessTemplateDto;
import com.kozen.kpm.project.dto.ProjectCustomerDto;
import com.kozen.kpm.project.dto.ProjectDto;
import com.kozen.kpm.project.dto.ProjectFileDto;
import com.kozen.kpm.project.dto.ProjectMemberDto;
import com.kozen.kpm.project.dto.ProjectSkuDto;
import com.kozen.kpm.project.dto.ProjectStageDto;
import com.kozen.kpm.project.dto.RequirementDto;
import com.kozen.kpm.project.dto.RequirementOverviewDto;
import com.kozen.kpm.project.dto.StageAssigneeDto;
import com.kozen.kpm.project.dto.StageRecordDto;
import com.kozen.kpm.project.entity.ProcessTemplateEntity;
import com.kozen.kpm.project.entity.ProjectCustomerEntity;
import com.kozen.kpm.project.entity.ProjectEntity;
import com.kozen.kpm.project.entity.ProjectFileEntity;
import com.kozen.kpm.project.entity.ProjectMemberEntity;
import com.kozen.kpm.project.entity.ProjectSkuEntity;
import com.kozen.kpm.project.entity.ProjectStageEntity;
import com.kozen.kpm.project.entity.RequirementEntity;
import com.kozen.kpm.project.entity.RequirementOverviewEntity;
import com.kozen.kpm.project.entity.StageAssigneeEntity;
import com.kozen.kpm.project.entity.StageRecordEntity;
import org.springframework.stereotype.Component;

import java.util.List;

/** Converts Project persistence projections into API-facing DTOs. */
@Component
public class ProjectConverter {
    public ProjectDto toProjectDto(
            ProjectEntity project,
            String managerName,
            List<ProjectMemberEntity> members,
            List<ProjectSkuEntity> skus,
            List<ProjectStageDto> stages,
            List<ProjectCustomerDto> customers,
            List<ProjectFileEntity> projectMaterials
    ) {
        return new ProjectDto(
                project.getId(),
                project.getExternalName(),
                project.getInternalName(),
                project.getModelName(),
                project.getManagerUserId(),
                project.getManagerAccount(),
                managerName,
                project.getArchived(),
                project.getDescription(),
                project.getCreatedAt(),
                project.getUpdatedAt(),
                members.stream().map(this::toMemberDto).toList(),
                skus.stream().map(this::toSkuDto).toList(),
                stages,
                customers,
                projectMaterials.stream().map(this::toFileDto).toList(),
                projectMaterials.stream().map(this::toFileDto).toList()
        );
    }

    public ProjectStageDto toStageDto(ProjectStageEntity stage, List<StageAssigneeEntity> assignees, List<ProjectFileEntity> materials, List<StageRecordEntity> records) {
        return new ProjectStageDto(
                stage.getId(),
                stage.getProjectId(),
                stage.getStageName(),
                stage.getStageName(),
                stage.getStageOrder(),
                stage.getStatus(),
                assignees.stream().map(this::toAssigneeDto).toList(),
                materials.stream().map(this::toFileDto).toList(),
                records.stream().map(this::toRecordDto).toList()
        );
    }

    public ProjectCustomerDto toCustomerDto(ProjectCustomerEntity customer, List<RequirementEntity> requirements) {
        return new ProjectCustomerDto(
                customer.getId(),
                customer.getProjectStatus(),
                customer.getCustomerId(),
                customer.getCustomerName(),
                customer.getCustomerName(),
                customer.getRegion(),
                customer.getLevel(),
                customer.getCustomerStatus(),
                requirements.stream().map(this::toRequirementDto).toList()
        );
    }

    public ProjectMemberDto toMemberDto(ProjectMemberEntity member) {
        return new ProjectMemberDto(member.getId(), member.getUserId(), member.getUserAccount(), member.getUserAccount(), member.getUserName(), member.getUserName(), member.getRoleName(), member.getRoleName());
    }

    public ProjectSkuDto toSkuDto(ProjectSkuEntity sku) {
        return new ProjectSkuDto(sku.getId(), sku.getProjectId(), sku.getWholeMachinePartNumber(), sku.getConfigurationName(), sku.getMemoryType(), sku.getActive(), sku.getCreatedAt(), sku.getUpdatedAt());
    }

    public StageAssigneeDto toAssigneeDto(StageAssigneeEntity assignee) {
        return new StageAssigneeDto(assignee.getAssigneeType(), assignee.getAssigneeType(), assignee.getAssigneeName(), assignee.getAssigneeName(), assignee.getAccount(), assignee.getUserId());
    }

    public ProjectFileDto toFileDto(ProjectFileEntity file) {
        return new ProjectFileDto(
                file.getId(), file.getStageId(), file.getProjectId(), file.getSourceStage(), file.getStageName(), file.getFileName(), file.getFileType(), file.getFileSize(), file.getDescription(),
                file.getUploader(), file.getBucket(), file.getObjectKey(), file.getStorageUrl(), file.getStorageCategory(), file.getShareTarget(), file.getPublishedToProject(), file.getPublicVisible(), file.getUploadedAt(), file.getPublishedAt(), file.getPublicAt()
        );
    }

    public StageRecordDto toRecordDto(StageRecordEntity record) {
        Object attachments = record.getAttachments() == null ? List.of() : JsonUtil.fromJson(record.getAttachments());
        return new StageRecordDto(record.getId(), record.getStageId(), record.getAuthor(), record.getContent(), attachments, record.getCreatedAt());
    }

    public RequirementDto toRequirementDto(RequirementEntity requirement) {
        return new RequirementDto(
                requirement.getId(), requirement.getProjectId(), requirement.getCustomerId(), requirement.getCustomerName(), requirement.getTitle(), requirement.getUserStory(),
                requirement.getBusinessValue(), requirement.getAcceptance(), requirement.getPriority(), requirement.getStatus(), requirement.getProposer(), requirement.getCreator(),
                requirement.getCreatedDate(), requirement.getTaskId()
        );
    }

    public RequirementOverviewDto toRequirementOverviewDto(RequirementOverviewEntity overview) {
        return new RequirementOverviewDto(overview.getTitle(), overview.getCustomerCount(), overview.getCustomers(), overview.getPriority(), overview.getStatuses());
    }

    public ProcessTemplateDto toTemplateDto(ProcessTemplateEntity template, List<String> stages) {
        return new ProcessTemplateDto(template.getId(), template.getName(), template.getScope(), template.getStatus(), template.getUpdatedAt(), stages);
    }
}

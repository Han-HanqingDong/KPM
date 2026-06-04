package com.kozen.kpm.project.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ProjectDto(
        String id,
        String externalName,
        String internalName,
        String modelName,
        String managerUserId,
        String managerAccount,
        String managerName,
        Boolean archived,
        String description,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<ProjectMemberDto> members,
        List<ProjectSkuDto> skus,
        List<ProjectStageDto> stages,
        List<ProjectCustomerDto> projectCustomers,
        List<ProjectFileDto> projectMaterials,
        List<ProjectFileDto> materials
) {}

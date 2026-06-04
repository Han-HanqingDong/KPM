package com.kozen.kpm.customer.portal.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "客户门户项目 DTO")
public record CustomerPortalProjectDto(
        String projectId,
        String projectName,
        String internalName,
        String modelName,
        String projectStatus
) {}

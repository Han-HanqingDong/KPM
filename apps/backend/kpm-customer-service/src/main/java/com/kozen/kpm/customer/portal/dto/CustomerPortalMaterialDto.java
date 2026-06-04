package com.kozen.kpm.customer.portal.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "客户门户公开项目资料 DTO")
public record CustomerPortalMaterialDto(
        String id,
        String projectId,
        String projectName,
        String sourceStage,
        String fileName,
        String fileType,
        String fileSize,
        String description,
        String bucket,
        String objectKey,
        String storageUrl,
        String storageCategory,
        LocalDateTime publicAt
) {}

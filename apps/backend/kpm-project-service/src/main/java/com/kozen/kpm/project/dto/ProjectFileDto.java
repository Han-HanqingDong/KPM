package com.kozen.kpm.project.dto;

import java.time.LocalDateTime;

public record ProjectFileDto(
        String id,
        String stageId,
        String projectId,
        String sourceStage,
        String stageName,
        String fileName,
        String fileType,
        String fileSize,
        String description,
        String uploader,
        String bucket,
        String objectKey,
        String storageUrl,
        String storageCategory,
        String shareTarget,
        Boolean publishedToProject,
        Boolean publicVisible,
        LocalDateTime uploadedAt,
        LocalDateTime publishedAt,
        LocalDateTime publicAt
) {}

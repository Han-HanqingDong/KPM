package com.kozen.kpm.task.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "任务附件元数据")
public record TaskAttachmentDto(
        String id,
        String taskId,
        String fileName,
        String fileType,
        String fileSize,
        String uploader,
        String bucket,
        String objectKey,
        String storageUrl,
        String storageCategory,
        LocalDateTime uploadedAt
) {}

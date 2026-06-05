package com.kozen.kpm.customer.portal.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "客户门户任务附件 DTO")
public record CustomerPortalTaskAttachmentDto(
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
) {
}

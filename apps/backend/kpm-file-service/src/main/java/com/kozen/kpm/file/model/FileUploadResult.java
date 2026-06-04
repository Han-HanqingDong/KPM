package com.kozen.kpm.file.model;

public record FileUploadResult(
        String name,
        String fileName,
        String type,
        String fileType,
        String fileSize,
        String size,
        long bytes,
        String contentType,
        String uploader,
        String category,
        String bucket,
        String objectKey,
        String storageUrl,
        String uploadedAt
) {
}

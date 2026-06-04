package com.kozen.kpm.customer.portal.entity;

import java.time.LocalDateTime;

public class CustomerPortalMaterialEntity {
    private String id;
    private String projectId;
    private String projectName;
    private String sourceStage;
    private String fileName;
    private String fileType;
    private String fileSize;
    private String description;
    private String bucket;
    private String objectKey;
    private String storageUrl;
    private String storageCategory;
    private LocalDateTime publicAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }
    public String getSourceStage() { return sourceStage; }
    public void setSourceStage(String sourceStage) { this.sourceStage = sourceStage; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    public String getFileSize() { return fileSize; }
    public void setFileSize(String fileSize) { this.fileSize = fileSize; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getBucket() { return bucket; }
    public void setBucket(String bucket) { this.bucket = bucket; }
    public String getObjectKey() { return objectKey; }
    public void setObjectKey(String objectKey) { this.objectKey = objectKey; }
    public String getStorageUrl() { return storageUrl; }
    public void setStorageUrl(String storageUrl) { this.storageUrl = storageUrl; }
    public String getStorageCategory() { return storageCategory; }
    public void setStorageCategory(String storageCategory) { this.storageCategory = storageCategory; }
    public LocalDateTime getPublicAt() { return publicAt; }
    public void setPublicAt(LocalDateTime publicAt) { this.publicAt = publicAt; }
}

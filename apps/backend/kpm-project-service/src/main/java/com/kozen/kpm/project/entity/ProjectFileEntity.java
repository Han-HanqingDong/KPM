package com.kozen.kpm.project.entity;

import java.time.LocalDateTime;

/** Persistence projection for projectfile data. */
public class ProjectFileEntity {
    private String id;
    private String stageId;
    private String projectId;
    private String sourceStage;
    private String stageName;
    private String fileName;
    private String fileType;
    private String fileSize;
    private String description;
    private String uploader;
    private String bucket;
    private String objectKey;
    private String storageUrl;
    private String storageCategory;
    private String shareTarget;
    private Boolean publishedToProject;
    private Boolean publicVisible;
    private LocalDateTime uploadedAt;
    private LocalDateTime publishedAt;
    private LocalDateTime publicAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getStageId() { return stageId; }
    public void setStageId(String stageId) { this.stageId = stageId; }
    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    public String getSourceStage() { return sourceStage; }
    public void setSourceStage(String sourceStage) { this.sourceStage = sourceStage; }
    public String getStageName() { return stageName; }
    public void setStageName(String stageName) { this.stageName = stageName; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    public String getFileSize() { return fileSize; }
    public void setFileSize(String fileSize) { this.fileSize = fileSize; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getUploader() { return uploader; }
    public void setUploader(String uploader) { this.uploader = uploader; }
    public String getBucket() { return bucket; }
    public void setBucket(String bucket) { this.bucket = bucket; }
    public String getObjectKey() { return objectKey; }
    public void setObjectKey(String objectKey) { this.objectKey = objectKey; }
    public String getStorageUrl() { return storageUrl; }
    public void setStorageUrl(String storageUrl) { this.storageUrl = storageUrl; }
    public String getStorageCategory() { return storageCategory; }
    public void setStorageCategory(String storageCategory) { this.storageCategory = storageCategory; }
    public String getShareTarget() { return shareTarget; }
    public void setShareTarget(String shareTarget) { this.shareTarget = shareTarget; }
    public Boolean getPublishedToProject() { return publishedToProject; }
    public void setPublishedToProject(Boolean publishedToProject) { this.publishedToProject = publishedToProject; }
    public Boolean getPublicVisible() { return publicVisible; }
    public void setPublicVisible(Boolean publicVisible) { this.publicVisible = publicVisible; }
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }
    public LocalDateTime getPublicAt() { return publicAt; }
    public void setPublicAt(LocalDateTime publicAt) { this.publicAt = publicAt; }
}

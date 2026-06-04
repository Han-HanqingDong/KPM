package com.kozen.kpm.project.entity;

import java.time.LocalDateTime;

/** Persistence projection for project data. */
public class ProjectEntity {
    private String id;
    private String externalName;
    private String internalName;
    private String modelName;
    private String managerUserId;
    private String managerAccount;
    private Boolean archived;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getExternalName() { return externalName; }
    public void setExternalName(String externalName) { this.externalName = externalName; }
    public String getInternalName() { return internalName; }
    public void setInternalName(String internalName) { this.internalName = internalName; }
    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }
    public String getManagerUserId() { return managerUserId; }
    public void setManagerUserId(String managerUserId) { this.managerUserId = managerUserId; }
    public String getManagerAccount() { return managerAccount; }
    public void setManagerAccount(String managerAccount) { this.managerAccount = managerAccount; }
    public Boolean getArchived() { return archived; }
    public void setArchived(Boolean archived) { this.archived = archived; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

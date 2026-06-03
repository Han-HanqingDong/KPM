package com.kozen.kpm.task.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

/** Persistence projection for task list and detail queries. */
public class TaskEntity {
    private String id;
    private String title;
    private String description;
    private String projectId;
    private String stageId;
    private String customerId;
    private String projectName;
    private String stageName;
    private String customerName;
    private String category;
    private String status;
    private String priority;
    private String creatorUserId;
    private String creator;
    private LocalDate expectedCompletionAt;
    private LocalDate dueDate;
    private String source;
    private Boolean blocked;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    public String getStageId() { return stageId; }
    public void setStageId(String stageId) { this.stageId = stageId; }
    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }
    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }
    public String getStageName() { return stageName; }
    public void setStageName(String stageName) { this.stageName = stageName; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getCreatorUserId() { return creatorUserId; }
    public void setCreatorUserId(String creatorUserId) { this.creatorUserId = creatorUserId; }
    public String getCreator() { return creator; }
    public void setCreator(String creator) { this.creator = creator; }
    public LocalDate getExpectedCompletionAt() { return expectedCompletionAt; }
    public void setExpectedCompletionAt(LocalDate expectedCompletionAt) { this.expectedCompletionAt = expectedCompletionAt; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public Boolean getBlocked() { return blocked; }
    public void setBlocked(Boolean blocked) { this.blocked = blocked; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

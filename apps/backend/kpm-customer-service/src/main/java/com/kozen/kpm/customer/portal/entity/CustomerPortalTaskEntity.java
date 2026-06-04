package com.kozen.kpm.customer.portal.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class CustomerPortalTaskEntity {
    private String id;
    private String taskNo;
    private String title;
    private String description;
    private String projectId;
    private String projectName;
    private String category;
    private String status;
    private String priority;
    private LocalDate expectedCompletionAt;
    private Boolean blocked;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer commentCount;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTaskNo() { return taskNo; }
    public void setTaskNo(String taskNo) { this.taskNo = taskNo; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public LocalDate getExpectedCompletionAt() { return expectedCompletionAt; }
    public void setExpectedCompletionAt(LocalDate expectedCompletionAt) { this.expectedCompletionAt = expectedCompletionAt; }
    public Boolean getBlocked() { return blocked; }
    public void setBlocked(Boolean blocked) { this.blocked = blocked; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public Integer getCommentCount() { return commentCount; }
    public void setCommentCount(Integer commentCount) { this.commentCount = commentCount; }
}

package com.kozen.kpm.customer.knowledge.entity;

import java.time.LocalDateTime;

public class KnowledgeArticleEntity {
    private String id;
    private String title;
    private String symptom;
    private String rootCause;
    private String solution;
    private String workaround;
    private String attachments;
    private String status;
    private String authorUserId;
    private String authorName;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String projectIds;
    private String projectNames;
    private String projectScopes;
    private String customerIds;
    private String customerNames;
    private String customerScopes;
    private String taskIds;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSymptom() { return symptom; }
    public void setSymptom(String symptom) { this.symptom = symptom; }
    public String getRootCause() { return rootCause; }
    public void setRootCause(String rootCause) { this.rootCause = rootCause; }
    public String getSolution() { return solution; }
    public void setSolution(String solution) { this.solution = solution; }
    public String getWorkaround() { return workaround; }
    public void setWorkaround(String workaround) { this.workaround = workaround; }
    public String getAttachments() { return attachments; }
    public void setAttachments(String attachments) { this.attachments = attachments; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getAuthorUserId() { return authorUserId; }
    public void setAuthorUserId(String authorUserId) { this.authorUserId = authorUserId; }
    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public String getProjectIds() { return projectIds; }
    public void setProjectIds(String projectIds) { this.projectIds = projectIds; }
    public String getProjectNames() { return projectNames; }
    public void setProjectNames(String projectNames) { this.projectNames = projectNames; }
    public String getProjectScopes() { return projectScopes; }
    public void setProjectScopes(String projectScopes) { this.projectScopes = projectScopes; }
    public String getCustomerIds() { return customerIds; }
    public void setCustomerIds(String customerIds) { this.customerIds = customerIds; }
    public String getCustomerNames() { return customerNames; }
    public void setCustomerNames(String customerNames) { this.customerNames = customerNames; }
    public String getCustomerScopes() { return customerScopes; }
    public void setCustomerScopes(String customerScopes) { this.customerScopes = customerScopes; }
    public String getTaskIds() { return taskIds; }
    public void setTaskIds(String taskIds) { this.taskIds = taskIds; }
}

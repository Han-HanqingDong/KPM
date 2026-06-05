package com.kozen.kpm.project.entity;

import java.time.LocalDateTime;

/** Persistence projection for project announcement history. */
public class ProjectAnnouncementEntity {
    private String id;
    private String projectId;
    private String announcementType;
    private String title;
    private String content;
    private String publisher;
    private LocalDateTime publishedAt;
    private String announcementStatus;
    private LocalDateTime retractedAt;
    private String retractedBy;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    public String getAnnouncementType() { return announcementType; }
    public void setAnnouncementType(String announcementType) { this.announcementType = announcementType; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getPublisher() { return publisher; }
    public void setPublisher(String publisher) { this.publisher = publisher; }
    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }
    public String getAnnouncementStatus() { return announcementStatus; }
    public void setAnnouncementStatus(String announcementStatus) { this.announcementStatus = announcementStatus; }
    public LocalDateTime getRetractedAt() { return retractedAt; }
    public void setRetractedAt(LocalDateTime retractedAt) { this.retractedAt = retractedAt; }
    public String getRetractedBy() { return retractedBy; }
    public void setRetractedBy(String retractedBy) { this.retractedBy = retractedBy; }
}

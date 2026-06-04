package com.kozen.kpm.task.entity;

import java.time.LocalDateTime;

/** Persistence entity for one task discussion message. */
public class TaskCommentEntity {
    private String id;
    private String taskId;
    private String author;
    private String commentType;
    private String content;
    private String attachments;
    private LocalDateTime createdAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTaskId() { return taskId; }
    public void setTaskId(String taskId) { this.taskId = taskId; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getCommentType() { return commentType; }
    public void setCommentType(String commentType) { this.commentType = commentType; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getAttachments() { return attachments; }
    public void setAttachments(String attachments) { this.attachments = attachments; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

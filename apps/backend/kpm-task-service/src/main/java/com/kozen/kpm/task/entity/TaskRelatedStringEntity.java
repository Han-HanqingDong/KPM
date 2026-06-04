package com.kozen.kpm.task.entity;

/**
 * Lightweight task relation projection used for batch loading list-page
 * decorations such as assignee names and participant ids.
 */
public class TaskRelatedStringEntity {
    private String taskId;
    private String value;

    public String getTaskId() { return taskId; }
    public void setTaskId(String taskId) { this.taskId = taskId; }
    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }
}

package com.kozen.kpm.resource.entity;

/** Persistence entity for a task status transition rule. */
public class TaskStatusTransitionEntity {
    private String id;
    private String fromStatus;
    private String toStatus;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getFromStatus() { return fromStatus; }
    public void setFromStatus(String fromStatus) { this.fromStatus = fromStatus; }
    public String getToStatus() { return toStatus; }
    public void setToStatus(String toStatus) { this.toStatus = toStatus; }
}

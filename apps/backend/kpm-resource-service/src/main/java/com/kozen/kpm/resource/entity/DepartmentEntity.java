package com.kozen.kpm.resource.entity;

/** Persistence projection for department management. */
public class DepartmentEntity {
    private String id;
    private String name;
    private String status;
    private Integer userCount;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getUserCount() { return userCount; }
    public void setUserCount(Integer userCount) { this.userCount = userCount; }
}

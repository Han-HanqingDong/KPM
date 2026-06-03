package com.kozen.kpm.resource.entity;

/** Persistence entity for one role. */
public class RoleEntity {
    private String id;
    private String name;
    private String roleType;
    private String status;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getRoleType() { return roleType; }
    public void setRoleType(String roleType) { this.roleType = roleType; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}

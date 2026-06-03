package com.kozen.kpm.resource.entity;

/** Persistence entity for generated menu/button permissions. */
public class PermissionEntity {
    private String id;
    private String code;
    private String name;
    private String permissionType;
    private String target;
    private String location;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPermissionType() { return permissionType; }
    public void setPermissionType(String permissionType) { this.permissionType = permissionType; }
    public String getTarget() { return target; }
    public void setTarget(String target) { this.target = target; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}

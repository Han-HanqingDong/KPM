package com.kozen.kpm.customer.portal.entity;

public class CustomerPortalProjectEntity {
    private String projectId;
    private String projectName;
    private String internalName;
    private String modelName;
    private String projectStatus;

    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }
    public String getInternalName() { return internalName; }
    public void setInternalName(String internalName) { this.internalName = internalName; }
    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }
    public String getProjectStatus() { return projectStatus; }
    public void setProjectStatus(String projectStatus) { this.projectStatus = projectStatus; }
}

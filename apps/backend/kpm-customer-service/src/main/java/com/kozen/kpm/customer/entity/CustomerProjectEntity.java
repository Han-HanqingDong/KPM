package com.kozen.kpm.customer.entity;

/** Persistence projection for customerproject data. */
public class CustomerProjectEntity {
    private String id;
    private String projectStatus;
    private String projectId;
    private String externalName;
    private String internalName;
    private String modelName;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getProjectStatus() { return projectStatus; }
    public void setProjectStatus(String projectStatus) { this.projectStatus = projectStatus; }
    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    public String getExternalName() { return externalName; }
    public void setExternalName(String externalName) { this.externalName = externalName; }
    public String getInternalName() { return internalName; }
    public void setInternalName(String internalName) { this.internalName = internalName; }
    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }
}

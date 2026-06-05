package com.kozen.kpm.customer.portal.entity;

public class CustomerPortalProjectTaskStatsEntity {
    private String projectId;
    private String projectName;
    private Long totalTasks;
    private Long completedTasks;
    private Long openTasks;
    private Double avgResponseHours;
    private Double avgCompletionHours;

    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }
    public Long getTotalTasks() { return totalTasks; }
    public void setTotalTasks(Long totalTasks) { this.totalTasks = totalTasks; }
    public Long getCompletedTasks() { return completedTasks; }
    public void setCompletedTasks(Long completedTasks) { this.completedTasks = completedTasks; }
    public Long getOpenTasks() { return openTasks; }
    public void setOpenTasks(Long openTasks) { this.openTasks = openTasks; }
    public Double getAvgResponseHours() { return avgResponseHours; }
    public void setAvgResponseHours(Double avgResponseHours) { this.avgResponseHours = avgResponseHours; }
    public Double getAvgCompletionHours() { return avgCompletionHours; }
    public void setAvgCompletionHours(Double avgCompletionHours) { this.avgCompletionHours = avgCompletionHours; }
}

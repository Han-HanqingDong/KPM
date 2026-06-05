package com.kozen.kpm.customer.portal.entity;

public class CustomerPortalTaskStatsEntity {
    private Long totalTasks;
    private Long completedTasks;
    private Long openTasks;
    private Double avgResponseHours;
    private Double avgCompletionHours;

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

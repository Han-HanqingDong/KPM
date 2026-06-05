package com.kozen.kpm.customer.portal.entity;

public class CustomerPortalTaskCategoryStatsEntity {
    private String category;
    private String labelZh;
    private String labelEn;
    private String shortLabelZh;
    private String shortLabelEn;
    private Long totalTasks;

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getLabelZh() { return labelZh; }
    public void setLabelZh(String labelZh) { this.labelZh = labelZh; }
    public String getLabelEn() { return labelEn; }
    public void setLabelEn(String labelEn) { this.labelEn = labelEn; }
    public String getShortLabelZh() { return shortLabelZh; }
    public void setShortLabelZh(String shortLabelZh) { this.shortLabelZh = shortLabelZh; }
    public String getShortLabelEn() { return shortLabelEn; }
    public void setShortLabelEn(String shortLabelEn) { this.shortLabelEn = shortLabelEn; }
    public Long getTotalTasks() { return totalTasks; }
    public void setTotalTasks(Long totalTasks) { this.totalTasks = totalTasks; }
}

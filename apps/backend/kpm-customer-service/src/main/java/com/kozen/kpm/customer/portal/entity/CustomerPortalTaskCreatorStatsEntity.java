package com.kozen.kpm.customer.portal.entity;

public class CustomerPortalTaskCreatorStatsEntity {
    private String contactEmail;
    private String contactName;
    private Long submittedTasks;

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
    public String getContactName() { return contactName; }
    public void setContactName(String contactName) { this.contactName = contactName; }
    public Long getSubmittedTasks() { return submittedTasks; }
    public void setSubmittedTasks(Long submittedTasks) { this.submittedTasks = submittedTasks; }
}

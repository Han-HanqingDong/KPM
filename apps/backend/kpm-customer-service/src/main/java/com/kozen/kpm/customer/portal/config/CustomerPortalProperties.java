package com.kozen.kpm.customer.portal.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "kpm.customer-portal")
public class CustomerPortalProperties {
    private long codeTtlSeconds = 600;
    private long tokenTtlSeconds = 28_800;
    private boolean otpDebugEnabled = true;
    private boolean mailEnabled = false;
    private String mailFrom = "noreply@kozen.example";

    public long getCodeTtlSeconds() { return codeTtlSeconds; }
    public void setCodeTtlSeconds(long codeTtlSeconds) { this.codeTtlSeconds = codeTtlSeconds; }
    public long getTokenTtlSeconds() { return tokenTtlSeconds; }
    public void setTokenTtlSeconds(long tokenTtlSeconds) { this.tokenTtlSeconds = tokenTtlSeconds; }
    public boolean isOtpDebugEnabled() { return otpDebugEnabled; }
    public void setOtpDebugEnabled(boolean otpDebugEnabled) { this.otpDebugEnabled = otpDebugEnabled; }
    public boolean isMailEnabled() { return mailEnabled; }
    public void setMailEnabled(boolean mailEnabled) { this.mailEnabled = mailEnabled; }
    public String getMailFrom() { return mailFrom; }
    public void setMailFrom(String mailFrom) { this.mailFrom = mailFrom; }
}

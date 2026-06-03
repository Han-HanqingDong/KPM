package com.kozen.kpm.iam.entity;

/**
 * Database entity for one KPM login account.
 *
 * <p>This class mirrors columns from {@code kpm_users}. It intentionally stays separate from
 * response DTOs so password hash and persistence details never leak to the frontend boundary.</p>
 */
public class UserAccountEntity {
    private String id;
    private String account;
    private String email;
    private String name;
    private String passwordHash;
    private String status;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean enabled() {
        return "启用".equals(status);
    }
}

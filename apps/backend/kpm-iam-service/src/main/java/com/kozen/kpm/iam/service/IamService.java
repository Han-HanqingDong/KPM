package com.kozen.kpm.iam.service;

import com.kozen.kpm.iam.dto.ChangePasswordRequest;
import com.kozen.kpm.iam.dto.AuthenticatedUserDto;
import com.kozen.kpm.iam.dto.LoginResponseDto;
import com.kozen.kpm.iam.dto.LoginRequest;

/**
 * IAM domain service.
 * Responsible for login verification and current-user authorization data aggregation.
 */
public interface IamService {
    /** Verify account/password and return a development token plus user profile. */
    LoginResponseDto login(LoginRequest request);

    /** Load one user by account with departments, roles and effective permissions. */
    AuthenticatedUserDto me(String account);

    /** Change current user's password after verifying the old password. */
    boolean changePassword(ChangePasswordRequest request);
}

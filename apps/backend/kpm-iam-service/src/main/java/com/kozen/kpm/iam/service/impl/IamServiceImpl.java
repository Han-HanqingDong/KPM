package com.kozen.kpm.iam.service.impl;

import com.kozen.kpm.common.auth.AuthTokenUtil;
import com.kozen.kpm.common.util.ValidationUtil;
import com.kozen.kpm.iam.converter.IamUserConverter;
import com.kozen.kpm.iam.dto.AuthenticatedUserDto;
import com.kozen.kpm.iam.dto.ChangePasswordRequest;
import com.kozen.kpm.iam.dto.LoginRequest;
import com.kozen.kpm.iam.dto.LoginResponseDto;
import com.kozen.kpm.iam.entity.UserAccountEntity;
import com.kozen.kpm.iam.mapper.IamMapper;
import com.kozen.kpm.iam.service.IamService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Default IAM service implementation.
 *
 * <p>The service layer owns authentication rules and user permission aggregation. It deliberately
 * returns DTOs instead of raw maps so controller responses stay stable and persistence details such
 * as password hashes never cross the API boundary.</p>
 */
@Service
public class IamServiceImpl implements IamService {
    private final IamMapper iamMapper;
    private final IamUserConverter iamUserConverter;
    private final String tokenSecret;
    private final long tokenTtlSeconds;

    public IamServiceImpl(
            IamMapper iamMapper,
            IamUserConverter iamUserConverter,
            @Value("${kpm.auth.token-secret:" + AuthTokenUtil.DEFAULT_SECRET + "}") String tokenSecret,
            @Value("${kpm.auth.token-ttl-seconds:28800}") long tokenTtlSeconds
    ) {
        this.iamMapper = iamMapper;
        this.iamUserConverter = iamUserConverter;
        this.tokenSecret = tokenSecret;
        this.tokenTtlSeconds = tokenTtlSeconds;
    }

    @Override
    public LoginResponseDto login(LoginRequest request) {
        String account = ValidationUtil.requireEmail(request.account(), "登录邮箱");
        String password = ValidationUtil.requireText(request.password(), "密码", 128);
        UserAccountEntity user = findLoginUser(account);
        if (!passwordMatches(user.getPasswordHash(), password) || !user.enabled()) {
            throw new IllegalArgumentException("账号或密码不正确");
        }

        AuthenticatedUserDto authenticatedUser = enrichUser(user);
        String token = AuthTokenUtil.issue(
                account,
                authenticatedUser.name(),
                tokenTtlSeconds,
                tokenSecret
        );
        return new LoginResponseDto(token, "Bearer", tokenTtlSeconds, authenticatedUser);
    }

    @Override
    public AuthenticatedUserDto me(String account) {
        ValidationUtil.requireEmail(account, "登录邮箱");
        List<UserAccountEntity> users = iamMapper.findUser(account);
        if (users.isEmpty()) {
            throw new IllegalArgumentException("用户不存在");
        }
        return enrichUser(users.getFirst());
    }

    @Override
    public boolean changePassword(ChangePasswordRequest request) {
        String account = ValidationUtil.requireEmail(request.account(), "登录邮箱");
        String oldPassword = ValidationUtil.requireText(request.oldPassword(), "原密码", 128);
        String newPassword = ValidationUtil.requireText(request.newPassword(), "新密码", 128);
        UserAccountEntity user = findLoginUser(account);
        if (!passwordMatches(user.getPasswordHash(), oldPassword)) {
            throw new IllegalArgumentException("原密码不正确");
        }
        iamMapper.updatePassword(user.getId(), "{noop}" + newPassword);
        return true;
    }

    private UserAccountEntity findLoginUser(String account) {
        List<UserAccountEntity> users = iamMapper.findUserForLogin(account);
        if (users.isEmpty()) {
            throw new IllegalArgumentException("账号或密码不正确");
        }
        return users.getFirst();
    }

    private AuthenticatedUserDto enrichUser(UserAccountEntity user) {
        String userId = user.getId();
        return iamUserConverter.toAuthenticatedUser(
                user,
                iamMapper.departments(userId),
                iamMapper.roles(userId),
                iamMapper.permissions(userId)
        );
    }

    private boolean passwordMatches(String storedHash, String password) {
        return storedHash != null && storedHash.endsWith(password);
    }
}

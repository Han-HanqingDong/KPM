package com.kozen.kpm.iam.service.impl;

import com.kozen.kpm.common.auth.AuthTokenUtil;
import com.kozen.kpm.common.util.ValidationUtil;
import com.kozen.kpm.iam.dto.ChangePasswordRequest;
import com.kozen.kpm.iam.dto.LoginRequest;
import com.kozen.kpm.iam.mapper.IamMapper;
import com.kozen.kpm.iam.service.IamService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Default IAM service implementation. */
@Service
public class IamServiceImpl implements IamService {
    private final IamMapper iamMapper;
    private final String tokenSecret;
    private final long tokenTtlSeconds;

    public IamServiceImpl(
            IamMapper iamMapper,
            @Value("${kpm.auth.token-secret:" + AuthTokenUtil.DEFAULT_SECRET + "}") String tokenSecret,
            @Value("${kpm.auth.token-ttl-seconds:28800}") long tokenTtlSeconds
    ) {
        this.iamMapper = iamMapper;
        this.tokenSecret = tokenSecret;
        this.tokenTtlSeconds = tokenTtlSeconds;
    }

    @Override
    public Map<String, Object> login(LoginRequest request) {
        String account = ValidationUtil.requireEmail(request.account(), "登录邮箱");
        String password = ValidationUtil.requireText(request.password(), "密码", 128);
        List<Map<String, Object>> users = iamMapper.findUserForLogin(account);
        if (users.isEmpty() || !String.valueOf(users.getFirst().get("passwordHash")).endsWith(password) || !"启用".equals(users.getFirst().get("status"))) {
            throw new IllegalArgumentException("账号或密码不正确");
        }
        Map<String, Object> user = enrichUser(users.getFirst());
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("token", AuthTokenUtil.issue(account, String.valueOf(user.get("name")), tokenTtlSeconds, tokenSecret));
        data.put("tokenType", "Bearer");
        data.put("expiresIn", tokenTtlSeconds);
        data.put("user", user);
        return data;
    }

    @Override
    public Map<String, Object> me(String account) {
        ValidationUtil.requireEmail(account, "登录邮箱");
        List<Map<String, Object>> users = iamMapper.findUser(account);
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
        List<Map<String, Object>> users = iamMapper.findUserForLogin(account);
        if (users.isEmpty() || !passwordMatches(String.valueOf(users.getFirst().get("passwordHash")), oldPassword)) {
            throw new IllegalArgumentException("原密码不正确");
        }
        iamMapper.updatePassword(String.valueOf(users.getFirst().get("id")), "{noop}" + newPassword);
        return true;
    }

    private Map<String, Object> enrichUser(Map<String, Object> user) {
        String userId = String.valueOf(user.get("id"));
        user.remove("passwordHash");
        user.put("departments", iamMapper.departments(userId));
        user.put("roles", iamMapper.roles(userId));
        user.put("permissions", iamMapper.permissions(userId));
        return user;
    }

    private boolean passwordMatches(String storedHash, String password) {
        return storedHash != null && storedHash.endsWith(password);
    }
}

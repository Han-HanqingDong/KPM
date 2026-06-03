package com.kozen.kpm.resource.service.impl;

import com.kozen.kpm.common.util.IdUtil;
import com.kozen.kpm.common.util.JsonUtil;
import com.kozen.kpm.resource.dto.DepartmentRequest;
import com.kozen.kpm.resource.dto.EnumItemRequest;
import com.kozen.kpm.resource.dto.PrototypeStateRequest;
import com.kozen.kpm.resource.dto.RoleRequest;
import com.kozen.kpm.resource.dto.TaskStatusTransitionRequest;
import com.kozen.kpm.resource.dto.UserRequest;
import com.kozen.kpm.resource.mapper.ResourceMapper;
import com.kozen.kpm.resource.service.ResourceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Default resource service implementation.
 */
@Service
public class ResourceServiceImpl implements ResourceService {
    private static final String DEFAULT_INITIAL_PASSWORD = "123456";

    private final ResourceMapper resourceMapper;

    public ResourceServiceImpl(ResourceMapper resourceMapper) {
        this.resourceMapper = resourceMapper;
    }

    @Override
    public Map<String, Object> bootstrap() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("users", users());
        data.put("departments", departments());
        data.put("roles", roles());
        data.put("permissions", resourceMapper.permissions());
        data.put("enumItems", resourceMapper.enumItems());
        data.put("taskStatusTransitions", resourceMapper.taskStatusTransitions());
        return data;
    }

    @Override
    public Object prototypeState() {
        List<String> rows = resourceMapper.prototypeSnapshots();
        return rows.isEmpty() ? Map.of() : JsonUtil.fromJson(rows.getFirst());
    }

    @Override
    public boolean savePrototypeState(PrototypeStateRequest request) {
        Object state = request == null || request.state() == null ? Map.of() : request.state();
        String updatedBy = request == null || request.updatedBy() == null || request.updatedBy().isBlank() ? "prototype" : request.updatedBy().trim();
        resourceMapper.upsertPrototypeSnapshot(JsonUtil.toJson(state), updatedBy);
        return true;
    }

    @Override
    public List<Map<String, Object>> users() {
        List<Map<String, Object>> rows = resourceMapper.users();
        rows.forEach(this::enrichUser);
        return rows;
    }

    @Override
    @Transactional
    public Map<String, Object> createUser(UserRequest request) {
        String id = id("user", request.loginAccount());
        resourceMapper.insertUser(id, request);
        replaceUserRelations(id, request);
        Map<String, Object> user = getUser(id);
        user.put("defaultPassword", DEFAULT_INITIAL_PASSWORD);
        return user;
    }

    @Override
    @Transactional
    public Map<String, Object> updateUser(String id, UserRequest request) {
        resourceMapper.updateUser(id, request);
        replaceUserRelations(id, request);
        return getUser(id);
    }

    @Override
    public Map<String, Object> resetUserPassword(String id) {
        resourceMapper.resetUserPassword(id, "{noop}" + DEFAULT_INITIAL_PASSWORD);
        Map<String, Object> result = getUser(id);
        result.put("defaultPassword", DEFAULT_INITIAL_PASSWORD);
        return result;
    }

    @Override
    public boolean deleteUser(String id) {
        resourceMapper.deleteUser(id);
        return true;
    }

    @Override
    public List<Map<String, Object>> departments() {
        return resourceMapper.departments();
    }

    @Override
    public Map<String, Object> createDepartment(DepartmentRequest request) {
        String id = id("dept", request.name());
        resourceMapper.insertDepartment(id, request);
        return resourceMapper.department(id);
    }

    @Override
    public Map<String, Object> updateDepartment(String id, DepartmentRequest request) {
        resourceMapper.updateDepartment(id, request);
        return resourceMapper.department(id);
    }

    @Override
    public boolean deleteDepartment(String id) {
        resourceMapper.deleteDepartment(id);
        return true;
    }

    @Override
    public List<Map<String, Object>> roles() {
        List<Map<String, Object>> rows = resourceMapper.roles();
        rows.forEach(row -> row.put("permissions", resourceMapper.rolePermissions(String.valueOf(row.get("id")))));
        return rows;
    }

    @Override
    @Transactional
    public Map<String, Object> createRole(RoleRequest request) {
        String id = id("role", request.name());
        resourceMapper.insertRole(id, request);
        replaceRolePermissions(id, request);
        return resourceMapper.role(id);
    }

    @Override
    @Transactional
    public Map<String, Object> updateRole(String id, RoleRequest request) {
        resourceMapper.updateRole(id, request);
        replaceRolePermissions(id, request);
        return resourceMapper.role(id);
    }

    @Override
    public boolean deleteRole(String id) {
        resourceMapper.deleteRole(id);
        return true;
    }

    @Override
    public Map<String, Object> createEnum(EnumItemRequest request) {
        String id = id("enum", request.enumType() + "-" + request.normalizedValue());
        resourceMapper.insertEnum(id, request);
        return resourceMapper.enumItem(id);
    }

    @Override
    public Map<String, Object> updateEnum(String id, EnumItemRequest request) {
        resourceMapper.updateEnum(id, request);
        return resourceMapper.enumItem(id);
    }

    @Override
    public boolean deleteEnum(String id) {
        resourceMapper.deleteEnum(id);
        return true;
    }

    @Override
    public Map<String, Object> createTaskStatusTransition(TaskStatusTransitionRequest request) {
        if (request.fromStatus().equals(request.toStatus())) {
            throw new IllegalArgumentException("起始状态和目标状态不能相同");
        }
        List<String> existingIds = resourceMapper.taskStatusTransitionIdsByPair(request.fromStatus(), request.toStatus());
        if (!existingIds.isEmpty()) {
            return resourceMapper.taskStatusTransition(existingIds.getFirst());
        }
        String id = id("tr-task", request.fromStatus() + "-" + request.toStatus());
        resourceMapper.insertTaskStatusTransition(id, request.fromStatus(), request.toStatus());
        return resourceMapper.taskStatusTransition(id);
    }

    @Override
    public boolean deleteTaskStatusTransition(String id) {
        resourceMapper.deleteTaskStatusTransition(id);
        return true;
    }

    private void enrichUser(Map<String, Object> user) {
        String id = String.valueOf(user.get("id"));
        user.put("departments", resourceMapper.userDepartments(id));
        user.put("globalRoles", resourceMapper.userRoles(id));
        user.put("directPermissions", resourceMapper.userDirectPermissions(id));
    }

    private Map<String, Object> getUser(String id) {
        Map<String, Object> user = resourceMapper.user(id);
        enrichUser(user);
        return user;
    }

    private void replaceUserRelations(String userId, UserRequest request) {
        resourceMapper.deleteUserDepartments(userId);
        for (String name : request.safeDepartments()) {
            List<String> ids = resourceMapper.departmentIdsByName(name);
            if (!ids.isEmpty()) {
                resourceMapper.insertUserDepartment(userId, ids.getFirst());
            }
        }
        resourceMapper.deleteUserRoles(userId);
        for (String name : request.safeGlobalRoles()) {
            List<String> ids = resourceMapper.roleIdsByName(name);
            if (!ids.isEmpty()) {
                resourceMapper.insertUserRole(userId, ids.getFirst());
            }
        }
        resourceMapper.deleteUserPermissions(userId);
        for (String code : request.safeDirectPermissions()) {
            List<String> ids = resourceMapper.permissionIdsByCode(code);
            if (!ids.isEmpty()) {
                resourceMapper.insertUserPermission(userId, ids.getFirst());
            }
        }
    }

    private void replaceRolePermissions(String roleId, RoleRequest request) {
        resourceMapper.deleteRolePermissions(roleId);
        for (String code : request.safePermissions()) {
            List<String> ids = resourceMapper.permissionIdsByCode(code);
            if (!ids.isEmpty()) {
                resourceMapper.insertRolePermission(roleId, ids.getFirst());
            }
        }
    }

    private String id(String prefix, Object seed) {
        return prefix + "-" + IdUtil.slug(String.valueOf(seed), prefix) + "-" + Long.toString(System.currentTimeMillis(), 36);
    }
}

package com.kozen.kpm.resource.service.impl;

import com.kozen.kpm.common.cache.RedisJsonCache;
import com.kozen.kpm.common.util.IdUtil;
import com.kozen.kpm.resource.config.ResourceCacheProperties;
import com.kozen.kpm.resource.converter.ResourceConverter;
import com.kozen.kpm.resource.dto.DepartmentDto;
import com.kozen.kpm.resource.dto.DepartmentRequest;
import com.kozen.kpm.resource.dto.EnumItemDto;
import com.kozen.kpm.resource.dto.EnumItemRequest;
import com.kozen.kpm.resource.dto.ResourceBootstrapDto;
import com.kozen.kpm.resource.dto.RoleDto;
import com.kozen.kpm.resource.dto.RoleRequest;
import com.kozen.kpm.resource.dto.TaskStatusTransitionDto;
import com.kozen.kpm.resource.dto.TaskStatusTransitionRequest;
import com.kozen.kpm.resource.dto.UserRequest;
import com.kozen.kpm.resource.dto.UserResourceDto;
import com.kozen.kpm.resource.entity.RoleEntity;
import com.kozen.kpm.resource.entity.UserResourceEntity;
import com.kozen.kpm.resource.mapper.ResourceMapper;
import com.kozen.kpm.resource.service.ResourceService;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Default resource service implementation.
 *
 * <p>This class keeps resource-management business rules in one place and returns typed DTOs to
 * controllers. Mapper entities are converted before crossing the API boundary, which makes the
 * service easier to refactor and safer for Swagger/API consumers.</p>
 */
@Service
public class ResourceServiceImpl implements ResourceService {
    private static final String DEFAULT_INITIAL_PASSWORD = "123456";
    private static final String BOOTSTRAP_CACHE_KEY = "kpm:cache:resource:bootstrap:v1";

    private final ResourceMapper resourceMapper;
    private final ResourceConverter resourceConverter;
    private final ResourceCacheProperties cacheProperties;
    private final RedisJsonCache redisCache;

    public ResourceServiceImpl(
            ResourceMapper resourceMapper,
            ResourceConverter resourceConverter,
            ResourceCacheProperties cacheProperties,
            StringRedisTemplate redisTemplate
    ) {
        this.resourceMapper = resourceMapper;
        this.resourceConverter = resourceConverter;
        this.cacheProperties = cacheProperties;
        this.redisCache = RedisJsonCache.withDefaultMapper(redisTemplate);
    }

    @Override
    public ResourceBootstrapDto bootstrap() {
        return redisCache.get(BOOTSTRAP_CACHE_KEY, ResourceBootstrapDto.class,
                cacheProperties.bootstrapTtl(),
                cacheProperties.bootstrapJitter(),
                () -> new ResourceBootstrapDto(
                users(),
                departments(),
                roles(),
                resourceMapper.permissions().stream().map(resourceConverter::toPermissionDto).toList(),
                resourceMapper.enumItems().stream().map(resourceConverter::toEnumItemDto).toList(),
                resourceMapper.taskStatusTransitions().stream().map(resourceConverter::toTaskStatusTransitionDto).toList()
        ));
    }

    @Override
    public List<UserResourceDto> users() {
        return resourceMapper.users().stream()
                .map(user -> enrichUser(user, null))
                .toList();
    }

    @Override
    @Transactional
    public UserResourceDto createUser(UserRequest request) {
        String id = id("user", request.loginAccount());
        resourceMapper.insertUser(id, request);
        replaceUserRelations(id, request);
        evictBootstrap();
        return getUser(id, DEFAULT_INITIAL_PASSWORD);
    }

    @Override
    @Transactional
    public UserResourceDto updateUser(String id, UserRequest request) {
        resourceMapper.updateUser(id, request);
        replaceUserRelations(id, request);
        evictBootstrap();
        return getUser(id, null);
    }

    @Override
    public UserResourceDto resetUserPassword(String id) {
        resourceMapper.resetUserPassword(id, "{noop}" + DEFAULT_INITIAL_PASSWORD);
        evictBootstrap();
        return getUser(id, DEFAULT_INITIAL_PASSWORD);
    }

    @Override
    public boolean deleteUser(String id) {
        resourceMapper.deleteUser(id);
        evictBootstrap();
        return true;
    }

    @Override
    public List<DepartmentDto> departments() {
        return resourceMapper.departments().stream()
                .map(resourceConverter::toDepartmentDto)
                .toList();
    }

    @Override
    public DepartmentDto createDepartment(DepartmentRequest request) {
        String id = id("dept", request.name());
        resourceMapper.insertDepartment(id, request);
        evictBootstrap();
        return resourceConverter.toDepartmentDto(resourceMapper.department(id));
    }

    @Override
    public DepartmentDto updateDepartment(String id, DepartmentRequest request) {
        resourceMapper.updateDepartment(id, request);
        evictBootstrap();
        return resourceConverter.toDepartmentDto(resourceMapper.department(id));
    }

    @Override
    public boolean deleteDepartment(String id) {
        resourceMapper.deleteDepartment(id);
        evictBootstrap();
        return true;
    }

    @Override
    public List<RoleDto> roles() {
        return resourceMapper.roles().stream()
                .map(this::enrichRole)
                .toList();
    }

    @Override
    @Transactional
    public RoleDto createRole(RoleRequest request) {
        String id = id("role", request.name());
        resourceMapper.insertRole(id, request);
        replaceRolePermissions(id, request);
        evictBootstrap();
        return getRole(id);
    }

    @Override
    @Transactional
    public RoleDto updateRole(String id, RoleRequest request) {
        resourceMapper.updateRole(id, request);
        replaceRolePermissions(id, request);
        evictBootstrap();
        return getRole(id);
    }

    @Override
    public boolean deleteRole(String id) {
        resourceMapper.deleteRole(id);
        evictBootstrap();
        return true;
    }

    @Override
    public EnumItemDto createEnum(EnumItemRequest request) {
        String id = id("enum", request.enumType() + "-" + request.normalizedValue());
        resourceMapper.insertEnum(id, request);
        evictBootstrap();
        return resourceConverter.toEnumItemDto(resourceMapper.enumItem(id));
    }

    @Override
    public EnumItemDto updateEnum(String id, EnumItemRequest request) {
        resourceMapper.updateEnum(id, request);
        evictBootstrap();
        return resourceConverter.toEnumItemDto(resourceMapper.enumItem(id));
    }

    @Override
    public boolean deleteEnum(String id) {
        resourceMapper.deleteEnum(id);
        evictBootstrap();
        return true;
    }

    @Override
    public TaskStatusTransitionDto createTaskStatusTransition(TaskStatusTransitionRequest request) {
        if (request.fromStatus().equals(request.toStatus())) {
            throw new IllegalArgumentException("起始状态和目标状态不能相同");
        }
        List<String> existingIds = resourceMapper.taskStatusTransitionIdsByPair(request.fromStatus(), request.toStatus());
        String transitionId = existingIds.isEmpty()
                ? createTaskStatusTransitionRow(request)
                : existingIds.getFirst();
        evictBootstrap();
        return resourceConverter.toTaskStatusTransitionDto(resourceMapper.taskStatusTransition(transitionId));
    }

    @Override
    public boolean deleteTaskStatusTransition(String id) {
        resourceMapper.deleteTaskStatusTransition(id);
        evictBootstrap();
        return true;
    }

    private void evictBootstrap() {
        redisCache.evict(BOOTSTRAP_CACHE_KEY);
    }

    private String createTaskStatusTransitionRow(TaskStatusTransitionRequest request) {
        String id = id("tr-task", request.fromStatus() + "-" + request.toStatus());
        resourceMapper.insertTaskStatusTransition(id, request.fromStatus(), request.toStatus());
        return id;
    }

    private UserResourceDto enrichUser(UserResourceEntity user, String defaultPassword) {
        String id = user.getId();
        return resourceConverter.toUserDto(
                user,
                resourceMapper.userDepartments(id),
                resourceMapper.userRoles(id),
                resourceMapper.userDirectPermissions(id),
                defaultPassword
        );
    }

    private UserResourceDto getUser(String id, String defaultPassword) {
        UserResourceEntity user = resourceMapper.user(id);
        if (user == null) {
            throw new IllegalArgumentException("用户不存在");
        }
        return enrichUser(user, defaultPassword);
    }

    private RoleDto enrichRole(RoleEntity role) {
        return resourceConverter.toRoleDto(role, resourceMapper.rolePermissions(role.getId()));
    }

    private RoleDto getRole(String id) {
        RoleEntity role = resourceMapper.role(id);
        if (role == null) {
            throw new IllegalArgumentException("角色不存在");
        }
        return enrichRole(role);
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
        return IdUtil.numericId();
    }
}

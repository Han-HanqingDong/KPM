package com.kozen.kpm.resource.service;

import com.kozen.kpm.resource.dto.DepartmentDto;
import com.kozen.kpm.resource.dto.DepartmentRequest;
import com.kozen.kpm.resource.dto.EnumItemDto;
import com.kozen.kpm.resource.dto.EnumItemRequest;
import com.kozen.kpm.resource.dto.PrototypeStateRequest;
import com.kozen.kpm.resource.dto.ResourceBootstrapDto;
import com.kozen.kpm.resource.dto.RoleDto;
import com.kozen.kpm.resource.dto.RoleRequest;
import com.kozen.kpm.resource.dto.TaskStatusTransitionDto;
import com.kozen.kpm.resource.dto.TaskStatusTransitionRequest;
import com.kozen.kpm.resource.dto.UserRequest;
import com.kozen.kpm.resource.dto.UserResourceDto;

import java.util.List;

/**
 * Resource domain service.
 * Responsible for users, departments, roles, permissions, enums, task-status transitions,
 * and current prototype pilot-state persistence.
 */
public interface ResourceService {
    /** Load all resource data required by the frontend bootstrap process. */
    ResourceBootstrapDto bootstrap();

    /** Load persisted prototype state for pilot validation. */
    Object prototypeState();

    /** Save current prototype UI state to PostgreSQL for pilot validation. */
    boolean savePrototypeState(PrototypeStateRequest request);

    /** Query users with departments, roles and direct permissions. */
    List<UserResourceDto> users();

    /** Create one user and return the created user plus default password. */
    UserResourceDto createUser(UserRequest request);

    /** Update one user. */
    UserResourceDto updateUser(String id, UserRequest request);

    /** Reset one user's password to the configured default password. */
    UserResourceDto resetUserPassword(String id);

    /** Delete one user. */
    boolean deleteUser(String id);

    /** Query flat department list. */
    List<DepartmentDto> departments();

    /** Create one department. */
    DepartmentDto createDepartment(DepartmentRequest request);

    /** Update one department. */
    DepartmentDto updateDepartment(String id, DepartmentRequest request);

    /** Delete one department. */
    boolean deleteDepartment(String id);

    /** Query roles with permission code list. */
    List<RoleDto> roles();

    /** Create one role and configure permissions. */
    RoleDto createRole(RoleRequest request);

    /** Update one role and configure permissions. */
    RoleDto updateRole(String id, RoleRequest request);

    /** Delete one role. */
    boolean deleteRole(String id);

    /** Create one enum item. */
    EnumItemDto createEnum(EnumItemRequest request);

    /** Update one enum item. */
    EnumItemDto updateEnum(String id, EnumItemRequest request);

    /** Delete one enum item. */
    boolean deleteEnum(String id);

    /** Create one task status transition rule. */
    TaskStatusTransitionDto createTaskStatusTransition(TaskStatusTransitionRequest request);

    /** Delete one task status transition rule. */
    boolean deleteTaskStatusTransition(String id);
}

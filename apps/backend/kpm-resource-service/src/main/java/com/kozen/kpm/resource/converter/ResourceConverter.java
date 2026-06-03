package com.kozen.kpm.resource.converter;

import com.kozen.kpm.resource.dto.DepartmentDto;
import com.kozen.kpm.resource.dto.EnumItemDto;
import com.kozen.kpm.resource.dto.PermissionDto;
import com.kozen.kpm.resource.dto.RoleDto;
import com.kozen.kpm.resource.dto.TaskStatusTransitionDto;
import com.kozen.kpm.resource.dto.UserResourceDto;
import com.kozen.kpm.resource.entity.DepartmentEntity;
import com.kozen.kpm.resource.entity.EnumItemEntity;
import com.kozen.kpm.resource.entity.PermissionEntity;
import com.kozen.kpm.resource.entity.RoleEntity;
import com.kozen.kpm.resource.entity.TaskStatusTransitionEntity;
import com.kozen.kpm.resource.entity.UserResourceEntity;
import org.springframework.stereotype.Component;

import java.util.List;

/** Converts resource persistence projections into stable API DTOs. */
@Component
public class ResourceConverter {
    public UserResourceDto toUserDto(
            UserResourceEntity user,
            List<String> departments,
            List<String> globalRoles,
            List<String> directPermissions,
            String defaultPassword
    ) {
        return new UserResourceDto(
                user.getId(),
                user.getAccount(),
                user.getEmail(),
                user.getName(),
                user.getStatus(),
                user.getCreatedAt(),
                List.copyOf(departments),
                List.copyOf(globalRoles),
                List.copyOf(directPermissions),
                defaultPassword
        );
    }

    public DepartmentDto toDepartmentDto(DepartmentEntity department) {
        return new DepartmentDto(department.getId(), department.getName(), department.getStatus(), department.getUserCount());
    }

    public RoleDto toRoleDto(RoleEntity role, List<String> permissions) {
        return new RoleDto(role.getId(), role.getName(), role.getRoleType(), role.getStatus(), List.copyOf(permissions));
    }

    public PermissionDto toPermissionDto(PermissionEntity permission) {
        return new PermissionDto(permission.getId(), permission.getCode(), permission.getName(), permission.getPermissionType(), permission.getTarget(), permission.getLocation());
    }

    public EnumItemDto toEnumItemDto(EnumItemEntity item) {
        return new EnumItemDto(item.getId(), item.getEnumType(), item.getName(), item.getValue(), item.getSemantic(), item.getActive(), item.getSortOrder());
    }

    public TaskStatusTransitionDto toTaskStatusTransitionDto(TaskStatusTransitionEntity transition) {
        return new TaskStatusTransitionDto(transition.getId(), transition.getFromStatus(), transition.getToStatus());
    }
}

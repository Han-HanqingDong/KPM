package com.kozen.kpm.iam.converter;

import com.kozen.kpm.iam.dto.AuthenticatedUserDto;
import com.kozen.kpm.iam.entity.UserAccountEntity;
import org.springframework.stereotype.Component;

import java.util.List;

/** Converts IAM persistence entities into API-facing DTOs. */
@Component
public class IamUserConverter {
    public AuthenticatedUserDto toAuthenticatedUser(
            UserAccountEntity user,
            List<String> departments,
            List<String> roles,
            List<String> permissions
    ) {
        return new AuthenticatedUserDto(
                user.getId(),
                user.getAccount(),
                user.getEmail(),
                user.getName(),
                user.getStatus(),
                List.copyOf(departments),
                List.copyOf(roles),
                List.copyOf(permissions)
        );
    }
}

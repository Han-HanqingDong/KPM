package com.kozen.kpm.notification.converter;

import com.kozen.kpm.notification.dto.InternalMessageDto;
import com.kozen.kpm.notification.entity.InternalMessageEntity;
import org.springframework.stereotype.Component;

@Component
public class NotificationConverter {
    public InternalMessageDto toInternalMessageDto(InternalMessageEntity entity) {
        boolean read = Boolean.TRUE.equals(entity.getReadFlag());
        return new InternalMessageDto(
                value(entity.getId()),
                value(entity.getTitle()),
                value(entity.getContent()),
                blankToDefault(entity.getMessageType(), "system"),
                read,
                entity.getCreatedAt() == null ? "" : entity.getCreatedAt().toString(),
                entity.getReadAt() == null ? null : entity.getReadAt().toString()
        );
    }

    private String value(String value) {
        return value == null ? "" : value;
    }

    private String blankToDefault(String value, String defaultValue) {
        return value == null || value.isBlank() ? defaultValue : value;
    }
}

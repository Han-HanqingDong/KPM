package com.kozen.kpm.notification.converter;

import com.kozen.kpm.notification.dto.InternalMessageDto;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class NotificationConverter {
    public InternalMessageDto toInternalMessageDto(Map<String, Object> row) {
        boolean read = Boolean.TRUE.equals(row.get("readFlag"));
        return new InternalMessageDto(
                stringValue(row.get("id")),
                stringValue(row.get("title")),
                stringValue(row.get("content")),
                stringValue(row.getOrDefault("messageType", "system")),
                read,
                read ? "READ" : "UNREAD",
                stringValue(row.get("createdAt")),
                nullableString(row.get("readAt"))
        );
    }

    private String stringValue(Object value) {
        return value == null ? "" : String.valueOf(value);
    }

    private String nullableString(Object value) {
        return value == null ? null : String.valueOf(value);
    }
}

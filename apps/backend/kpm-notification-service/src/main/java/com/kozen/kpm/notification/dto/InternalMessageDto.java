package com.kozen.kpm.notification.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "内部消息展示 DTO")
public record InternalMessageDto(
        @Schema(description = "消息ID") String id,
        @Schema(description = "消息标题") String title,
        @Schema(description = "消息内容") String content,
        @Schema(description = "消息类型") String messageType,
        @Schema(description = "是否已读") boolean read,
        @Schema(description = "消息状态：READ/UNREAD") String status,
        @Schema(description = "创建时间") String createdAt,
        @Schema(description = "阅读时间") String readAt
) {
}

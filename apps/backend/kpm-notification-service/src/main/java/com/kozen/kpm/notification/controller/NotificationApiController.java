package com.kozen.kpm.notification.controller;

import com.kozen.kpm.common.api.ApiResponse;
import com.kozen.kpm.common.api.PageResult;
import com.kozen.kpm.notification.dto.InternalMessageDto;
import com.kozen.kpm.notification.dto.NotificationSettingsDto;
import com.kozen.kpm.notification.dto.UnreadCountDto;
import com.kozen.kpm.notification.dto.UpdatedCountDto;
import com.kozen.kpm.notification.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(originPatterns = "*")
@Tag(name = "消息通知", description = "内部消息、未读数量和前端刷新配置")
public class NotificationApiController {
    private final NotificationService notificationService;

    public NotificationApiController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/settings")
    @Operation(summary = "消息刷新配置", description = "返回前端轮询内部消息的建议刷新间隔。")
    public ApiResponse<NotificationSettingsDto> settings() {
        return ApiResponse.ok(notificationService.settings());
    }

    @GetMapping("/messages")
    @Operation(summary = "内部消息列表", description = "查询当前登录用户的内部消息，支持只看未读。")
    public ApiResponse<List<InternalMessageDto>> messages(
            @RequestHeader("X-KPM-Account") String account,
            @RequestParam(defaultValue = "false") boolean unreadOnly
    ) {
        return ApiResponse.ok(notificationService.messages(account, unreadOnly));
    }

    @GetMapping("/messages/page")
    @Operation(summary = "分页查询内部消息", description = "分页和未读过滤在后端执行，消息盒子无需拉取全量消息。")
    public ApiResponse<PageResult<InternalMessageDto>> messagesPage(
            @RequestHeader("X-KPM-Account") String account,
            @RequestParam(defaultValue = "false") boolean unreadOnly,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer pageSize
    ) {
        return ApiResponse.ok(notificationService.messagesPage(account, unreadOnly, page, pageSize));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "未读消息数量", description = "查询当前登录用户未读内部消息数量。")
    public ApiResponse<UnreadCountDto> unreadCount(@RequestHeader("X-KPM-Account") String account) {
        return ApiResponse.ok(new UnreadCountDto(notificationService.unreadCount(account)));
    }

    @PostMapping("/messages/{id}/read")
    @Operation(summary = "标记已读", description = "将当前用户的一条内部消息标记为已读。")
    public ApiResponse<Boolean> markRead(@RequestHeader("X-KPM-Account") String account, @PathVariable String id) {
        return ApiResponse.ok(notificationService.markRead(account, id));
    }

    @PostMapping("/messages/read-all")
    @Operation(summary = "一键已读", description = "将当前用户所有未读内部消息标记为已读，并返回本次处理数量。")
    public ApiResponse<UpdatedCountDto> markAllRead(@RequestHeader("X-KPM-Account") String account) {
        return ApiResponse.ok(new UpdatedCountDto(notificationService.markAllRead(account)));
    }
}

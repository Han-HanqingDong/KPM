package com.kozen.kpm.notification.service;

import com.kozen.kpm.common.api.PageResult;
import com.kozen.kpm.notification.dto.InternalMessageDto;
import com.kozen.kpm.notification.dto.NotificationSettingsDto;

import java.util.List;

public interface NotificationService {
    void processPendingEvents();

    /**
     * Query internal messages for the current account.
     *
     * @param account current login account from token/header context
     * @param unreadOnly true to return unread messages only
     * @return internal messages with explicit read status for frontend rendering
     */
    List<InternalMessageDto> messages(String account, boolean unreadOnly);

    /** Query internal messages by page for the current account. */
    PageResult<InternalMessageDto> messagesPage(String account, boolean unreadOnly, Integer page, Integer pageSize);

    int unreadCount(String account);

    /** Mark one internal message as read for the current account. */
    boolean markRead(String account, String messageId);

    /** Mark all unread internal messages as read for the current account. */
    int markAllRead(String account);

    /** Query frontend notification polling settings. */
    NotificationSettingsDto settings();
}

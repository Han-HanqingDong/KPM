package com.kozen.kpm.notification.service.impl;

import com.kozen.kpm.common.util.IdUtil;
import com.kozen.kpm.common.util.JsonUtil;
import com.kozen.kpm.notification.config.NotificationProperties;
import com.kozen.kpm.notification.converter.NotificationConverter;
import com.kozen.kpm.notification.dto.InternalMessageDto;
import com.kozen.kpm.notification.mapper.NotificationMapper;
import com.kozen.kpm.notification.service.NotificationService;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class NotificationServiceImpl implements NotificationService {
    private final NotificationMapper notificationMapper;
    private final NotificationProperties properties;
    private final NotificationConverter notificationConverter;
    private final JavaMailSender mailSender;

    public NotificationServiceImpl(NotificationMapper notificationMapper, NotificationProperties properties, NotificationConverter notificationConverter, ObjectProvider<JavaMailSender> mailSenderProvider) {
        this.notificationMapper = notificationMapper;
        this.properties = properties;
        this.notificationConverter = notificationConverter;
        this.mailSender = mailSenderProvider.getIfAvailable();
    }

    @Override
    @Scheduled(fixedDelayString = "${kpm.notification.processor-interval-ms:15000}")
    public void processPendingEvents() {
        for (Map<String, Object> event : notificationMapper.pendingEvents(50)) {
            List<String> recipients = recipientIds(event.get("recipientUserIds"));
            for (String recipientId : recipients) {
                notificationMapper.insertMessage(
                        IdUtil.nanoId("msg"),
                        recipientId,
                        event.get("title"),
                        event.get("content"),
                        event.getOrDefault("eventType", "system")
                );
                sendMailIfEnabled(recipientId, String.valueOf(event.get("title")), String.valueOf(event.get("content")));
            }
            notificationMapper.markEventProcessed(String.valueOf(event.get("id")));
        }
    }

    @Override
    public List<InternalMessageDto> messages(String account, boolean unreadOnly) {
        return notificationMapper.messages(currentUserId(account), unreadOnly).stream()
                .map(notificationConverter::toInternalMessageDto)
                .toList();
    }

    @Override
    public int unreadCount(String account) {
        Integer count = notificationMapper.unreadCount(currentUserId(account));
        return count == null ? 0 : count;
    }

    @Override
    public boolean markRead(String account, String messageId) {
        return notificationMapper.markRead(messageId, currentUserId(account)) > 0;
    }

    @Override
    public int markAllRead(String account) {
        return notificationMapper.markAllRead(currentUserId(account));
    }

    @Override
    public Map<String, Object> settings() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("refreshIntervalSeconds", properties.getRefreshIntervalSeconds());
        data.put("mailEnabled", properties.isMailEnabled());
        return data;
    }

    @SuppressWarnings("unchecked")
    private List<String> recipientIds(Object raw) {
        if (raw == null) return List.of();
        Object parsed = raw instanceof String text ? JsonUtil.fromJson(text) : raw;
        if (parsed instanceof Collection<?> collection) {
            return collection.stream().map(String::valueOf).filter(value -> !value.isBlank()).distinct().toList();
        }
        return List.of();
    }

    private String currentUserId(String account) {
        List<Map<String, Object>> users = notificationMapper.userByAccount(account);
        if (users.isEmpty()) {
            throw new IllegalArgumentException("用户不存在");
        }
        return String.valueOf(users.getFirst().get("id"));
    }

    private void sendMailIfEnabled(String recipientUserId, String title, String content) {
        if (!properties.isMailEnabled() || mailSender == null) return;
        try {
            Map<String, Object> user = notificationMapper.userById(recipientUserId);
            String email = String.valueOf(user.getOrDefault("email", ""));
            if (email.isBlank() || "null".equals(email)) return;
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(properties.getMailFrom());
            message.setTo(email);
            message.setSubject(title);
            message.setText(content);
            mailSender.send(message);
        } catch (Exception ignored) {
            // Mail failures should not block internal messages; production can add retry/dead-letter logic.
        }
    }
}

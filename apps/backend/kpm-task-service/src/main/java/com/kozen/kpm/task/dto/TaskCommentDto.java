package com.kozen.kpm.task.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "任务评论/留言")
public record TaskCommentDto(String id, String taskId, String author, String content, String attachments, LocalDateTime createdAt) {}

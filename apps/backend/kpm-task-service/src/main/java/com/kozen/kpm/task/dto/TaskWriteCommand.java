package com.kozen.kpm.task.dto;

/**
 * Internal persistence command assembled after request validation and user lookup.
 * It keeps Mapper parameters typed without exposing persistence-only fields to clients.
 */
public record TaskWriteCommand(
        String id,
        String title,
        String description,
        String projectId,
        String stageId,
        String customerId,
        String category,
        String status,
        String priority,
        String creatorUserId,
        String creatorName,
        String expectedCompletionAt,
        String dueDate,
        String source,
        Boolean blocked
) {
    public static TaskWriteCommand from(
            String id,
            TaskRequest request,
            String projectId,
            String stageId,
            String customerId,
            String creatorUserId,
            String creatorName
    ) {
        return new TaskWriteCommand(
                id,
                request.title(),
                request.description(),
                projectId,
                stageId,
                customerId,
                request.category(),
                request.status(),
                request.priority(),
                creatorUserId,
                creatorName,
                request.normalizedExpectedCompletionAt(),
                request.normalizedDueDate(),
                request.normalizedSource(),
                request.normalizedBlocked()
        );
    }
}

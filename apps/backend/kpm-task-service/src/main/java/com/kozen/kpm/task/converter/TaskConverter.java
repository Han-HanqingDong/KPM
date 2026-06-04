package com.kozen.kpm.task.converter;

import com.kozen.kpm.common.util.JsonUtil;
import com.kozen.kpm.task.dto.TaskAttachmentDto;
import com.kozen.kpm.task.dto.TaskCommentDto;
import com.kozen.kpm.task.dto.TaskDto;
import com.kozen.kpm.task.entity.TaskAttachmentEntity;
import com.kozen.kpm.task.entity.TaskCommentEntity;
import com.kozen.kpm.task.entity.TaskEntity;
import org.springframework.stereotype.Component;

import java.util.List;

/** Converts task persistence projections into API-facing DTOs. */
@Component
public class TaskConverter {
    public TaskDto toTaskDto(
            TaskEntity task,
            List<String> assignees,
            List<String> participants,
            List<TaskAttachmentEntity> attachments,
            List<TaskCommentEntity> comments
    ) {
        return new TaskDto(
                task.getId(),
                task.getTaskNo(),
                task.getTitle(),
                task.getDescription(),
                task.getProjectId(),
                task.getStageId(),
                task.getCustomerId(),
                task.getProjectName(),
                task.getStageName(),
                task.getCustomerName(),
                task.getCategory(),
                task.getStatus(),
                task.getPriority(),
                task.getCreatorUserId(),
                task.getCreator(),
                task.getExpectedCompletionAt(),
                task.getDueDate(),
                task.getSource(),
                task.getBlocked(),
                task.getCreatedAt(),
                task.getUpdatedAt(),
                List.copyOf(assignees),
                List.copyOf(participants),
                attachments.stream().map(this::toAttachmentDto).toList(),
                comments.stream().map(this::toCommentDto).toList()
        );
    }

    public TaskAttachmentDto toAttachmentDto(TaskAttachmentEntity attachment) {
        return new TaskAttachmentDto(
                attachment.getId(),
                attachment.getTaskId(),
                attachment.getFileName(),
                attachment.getFileType(),
                attachment.getFileSize(),
                attachment.getUploader(),
                attachment.getBucket(),
                attachment.getObjectKey(),
                attachment.getStorageUrl(),
                attachment.getStorageCategory(),
                attachment.getUploadedAt()
        );
    }

    public TaskCommentDto toCommentDto(TaskCommentEntity comment) {
        return new TaskCommentDto(
                comment.getId(),
                comment.getTaskId(),
                comment.getAuthor(),
                comment.getContent(),
                comment.getAttachments() == null ? List.of() : JsonUtil.fromJson(comment.getAttachments()),
                comment.getCreatedAt()
        );
    }
}

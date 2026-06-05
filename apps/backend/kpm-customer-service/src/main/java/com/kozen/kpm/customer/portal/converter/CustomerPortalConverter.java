package com.kozen.kpm.customer.portal.converter;

import com.kozen.kpm.common.util.JsonUtil;
import com.kozen.kpm.customer.portal.dto.CustomerPortalMaterialDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalAnnouncementDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalContactDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalMessageDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalMeDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalProjectDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalProjectTaskStatsDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalTaskAttachmentDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalTaskCategoryStatsDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalTaskCreatorStatsDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalTaskStatsDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalTaskDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalTaskCommentDto;
import com.kozen.kpm.customer.portal.entity.CustomerPortalContactEntity;
import com.kozen.kpm.customer.portal.entity.CustomerPortalMaterialEntity;
import com.kozen.kpm.customer.portal.entity.CustomerPortalAnnouncementEntity;
import com.kozen.kpm.customer.portal.entity.CustomerPortalMessageEntity;
import com.kozen.kpm.customer.portal.entity.CustomerPortalProjectEntity;
import com.kozen.kpm.customer.portal.entity.CustomerPortalProjectTaskStatsEntity;
import com.kozen.kpm.customer.portal.entity.CustomerPortalTaskAttachmentEntity;
import com.kozen.kpm.customer.portal.entity.CustomerPortalTaskCategoryStatsEntity;
import com.kozen.kpm.customer.portal.entity.CustomerPortalTaskCreatorStatsEntity;
import com.kozen.kpm.customer.portal.entity.CustomerPortalTaskEntity;
import com.kozen.kpm.customer.portal.entity.CustomerPortalTaskStatsEntity;
import com.kozen.kpm.customer.portal.entity.CustomerPortalTaskCommentEntity;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CustomerPortalConverter {
    public CustomerPortalMeDto toMeDto(CustomerPortalContactEntity entity) {
        return new CustomerPortalMeDto(entity.getCustomerId(), entity.getCustomerName(), entity.getCustomerShortName(), entity.getContactId(), entity.getContactName(), entity.getEmail());
    }

    public CustomerPortalProjectDto toProjectDto(CustomerPortalProjectEntity entity) {
        return new CustomerPortalProjectDto(entity.getProjectId(), entity.getProjectName(), entity.getInternalName(), entity.getModelName(), entity.getProjectStatus());
    }

    public CustomerPortalMaterialDto toMaterialDto(CustomerPortalMaterialEntity entity) {
        return new CustomerPortalMaterialDto(entity.getId(), entity.getProjectId(), entity.getProjectName(), entity.getSourceStage(), entity.getFileName(), entity.getFileType(), entity.getFileSize(), entity.getDescription(), entity.getBucket(), entity.getObjectKey(), entity.getStorageUrl(), entity.getStorageCategory(), entity.getPublicAt());
    }

    public CustomerPortalTaskDto toTaskDto(CustomerPortalTaskEntity entity) {
        return toTaskDto(entity, List.of(), List.of());
    }

    public CustomerPortalTaskDto toTaskDto(CustomerPortalTaskEntity entity, List<CustomerPortalTaskCommentEntity> comments) {
        return toTaskDto(entity, List.of(), comments);
    }

    public CustomerPortalTaskDto toTaskDto(CustomerPortalTaskEntity entity, List<CustomerPortalTaskAttachmentEntity> attachments, List<CustomerPortalTaskCommentEntity> comments) {
        int commentCount = entity.getCommentCount() == null ? comments.size() : entity.getCommentCount();
        return new CustomerPortalTaskDto(
                entity.getId(),
                entity.getTaskNo(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getProjectId(),
                entity.getProjectName(),
                entity.getCategory(),
                entity.getCategoryLabelZh(),
                entity.getCategoryLabelEn(),
                entity.getCategoryShortLabelZh(),
                entity.getCategoryShortLabelEn(),
                entity.getStatus(),
                entity.getPriority(),
                entity.getCreator(),
                entity.getExpectedCompletionAt(),
                entity.getBlocked(),
                entity.getCreatedAt(),
                entity.getUpdatedAt(),
                commentCount,
                attachments.stream().map(this::toTaskAttachmentDto).toList(),
                comments.stream().map(this::toTaskCommentDto).toList()
        );
    }

    public CustomerPortalTaskAttachmentDto toTaskAttachmentDto(CustomerPortalTaskAttachmentEntity entity) {
        return new CustomerPortalTaskAttachmentDto(entity.getId(), entity.getTaskId(), entity.getFileName(), entity.getFileType(), entity.getFileSize(), entity.getUploader(), entity.getBucket(), entity.getObjectKey(), entity.getStorageUrl(), entity.getStorageCategory(), entity.getUploadedAt());
    }

    public CustomerPortalTaskCommentDto toTaskCommentDto(CustomerPortalTaskCommentEntity entity) {
        Object attachments = entity.getAttachments() == null ? List.of() : JsonUtil.fromJson(entity.getAttachments());
        return new CustomerPortalTaskCommentDto(entity.getId(), entity.getTaskId(), entity.getAuthor(), entity.getContent(), attachments, entity.getCreatedAt());
    }

    public CustomerPortalAnnouncementDto toAnnouncementDto(CustomerPortalAnnouncementEntity entity) {
        return new CustomerPortalAnnouncementDto(entity.getId(), entity.getProjectId(), entity.getProjectName(), entity.getAnnouncementType(), entity.getTitle(), entity.getContent(), entity.getPublisher(), entity.getPublishedAt());
    }

    public CustomerPortalMessageDto toMessageDto(CustomerPortalMessageEntity entity) {
        return new CustomerPortalMessageDto(entity.getId(), entity.getTitle(), entity.getContent(), entity.getMessageType(), entity.getProjectId(), entity.getProjectName(), entity.getTaskId(), entity.getAnnouncementId(), entity.getReadFlag(), entity.getCreatedAt(), entity.getReadAt());
    }

    public CustomerPortalContactDto toContactDto(CustomerPortalContactEntity entity) {
        return new CustomerPortalContactDto(entity.getContactId(), entity.getContactName(), entity.getEmail());
    }

    public CustomerPortalTaskStatsDto toTaskStatsDto(CustomerPortalTaskStatsEntity entity, List<CustomerPortalProjectTaskStatsEntity> projectRows, List<CustomerPortalTaskCreatorStatsEntity> creatorRows, List<CustomerPortalTaskCategoryStatsEntity> categoryRows) {
        long total = value(entity == null ? null : entity.getTotalTasks());
        long completed = value(entity == null ? null : entity.getCompletedTasks());
        long open = value(entity == null ? null : entity.getOpenTasks());
        double completionRate = total == 0 ? 0 : completed * 100.0 / total;
        return new CustomerPortalTaskStatsDto(
                total,
                completed,
                open,
                round(completionRate),
                round(entity == null ? null : entity.getAvgResponseHours()),
                round(entity == null ? null : entity.getAvgCompletionHours()),
                projectRows.stream().map(this::toProjectTaskStatsDto).toList(),
                creatorRows.stream().map(this::toTaskCreatorStatsDto).toList(),
                categoryRows.stream().map(this::toTaskCategoryStatsDto).toList()
        );
    }

    private CustomerPortalProjectTaskStatsDto toProjectTaskStatsDto(CustomerPortalProjectTaskStatsEntity entity) {
        return new CustomerPortalProjectTaskStatsDto(
                entity.getProjectId(),
                entity.getProjectName(),
                value(entity.getTotalTasks()),
                value(entity.getCompletedTasks()),
                value(entity.getOpenTasks()),
                round(entity.getAvgResponseHours()),
                round(entity.getAvgCompletionHours())
        );
    }

    private CustomerPortalTaskCreatorStatsDto toTaskCreatorStatsDto(CustomerPortalTaskCreatorStatsEntity entity) {
        return new CustomerPortalTaskCreatorStatsDto(
                entity.getContactEmail(),
                entity.getContactName(),
                value(entity.getSubmittedTasks())
        );
    }

    private CustomerPortalTaskCategoryStatsDto toTaskCategoryStatsDto(CustomerPortalTaskCategoryStatsEntity entity) {
        return new CustomerPortalTaskCategoryStatsDto(
                entity.getCategory(),
                entity.getLabelZh(),
                entity.getLabelEn(),
                entity.getShortLabelZh(),
                entity.getShortLabelEn(),
                value(entity.getTotalTasks())
        );
    }

    private long value(Long value) {
        return value == null ? 0 : value;
    }

    private double round(Double value) {
        if (value == null || !Double.isFinite(value)) return 0;
        return Math.round(value * 10.0) / 10.0;
    }
}

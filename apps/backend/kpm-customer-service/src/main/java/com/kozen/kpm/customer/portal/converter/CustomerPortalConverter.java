package com.kozen.kpm.customer.portal.converter;

import com.kozen.kpm.common.util.JsonUtil;
import com.kozen.kpm.customer.portal.dto.CustomerPortalMaterialDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalAnnouncementDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalMessageDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalMeDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalProjectDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalTaskDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalTaskCommentDto;
import com.kozen.kpm.customer.portal.entity.CustomerPortalContactEntity;
import com.kozen.kpm.customer.portal.entity.CustomerPortalMaterialEntity;
import com.kozen.kpm.customer.portal.entity.CustomerPortalAnnouncementEntity;
import com.kozen.kpm.customer.portal.entity.CustomerPortalMessageEntity;
import com.kozen.kpm.customer.portal.entity.CustomerPortalProjectEntity;
import com.kozen.kpm.customer.portal.entity.CustomerPortalTaskEntity;
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
        return toTaskDto(entity, List.of());
    }

    public CustomerPortalTaskDto toTaskDto(CustomerPortalTaskEntity entity, List<CustomerPortalTaskCommentEntity> comments) {
        int commentCount = entity.getCommentCount() == null ? comments.size() : entity.getCommentCount();
        return new CustomerPortalTaskDto(entity.getId(), entity.getTaskNo(), entity.getTitle(), entity.getDescription(), entity.getProjectId(), entity.getProjectName(), entity.getCategory(), entity.getStatus(), entity.getPriority(), entity.getExpectedCompletionAt(), entity.getBlocked(), entity.getCreatedAt(), entity.getUpdatedAt(), commentCount, comments.stream().map(this::toTaskCommentDto).toList());
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
}

package com.kozen.kpm.customer.converter;

import com.kozen.kpm.common.util.JsonUtil;
import com.kozen.kpm.customer.dto.CustomerContactDTO;
import com.kozen.kpm.customer.dto.CustomerDto;
import com.kozen.kpm.customer.dto.CustomerFollowupDto;
import com.kozen.kpm.customer.dto.CustomerMaterialDto;
import com.kozen.kpm.customer.dto.CustomerProjectDto;
import com.kozen.kpm.customer.entity.CustomerContactEntity;
import com.kozen.kpm.customer.entity.CustomerEntity;
import com.kozen.kpm.customer.entity.CustomerFollowupEntity;
import com.kozen.kpm.customer.entity.CustomerMaterialEntity;
import com.kozen.kpm.customer.entity.CustomerProjectEntity;
import org.springframework.stereotype.Component;

import java.util.List;

/** Converts customer persistence projections into API-facing DTOs. */
@Component
public class CustomerConverter {
    public CustomerDto toDto(
            CustomerEntity customer,
            List<String> salesOwners,
            List<String> supportOwners,
            List<CustomerContactEntity> contacts,
            List<CustomerMaterialEntity> materials,
            List<CustomerFollowupEntity> followups,
            List<CustomerProjectEntity> projects
    ) {
        return new CustomerDto(
                customer.getId(), customer.getName(), customer.getShortName(), customer.getRegion(), customer.getAddress(), customer.getLevel(), customer.getStatus(), customer.getCreatedAt(), customer.getUpdatedAt(),
                salesOwners, supportOwners,
                contacts.stream().map(this::toContactDto).toList(),
                materials.stream().map(this::toMaterialDto).toList(),
                followups.stream().map(this::toFollowupDto).toList(),
                projects.stream().map(this::toProjectDto).toList()
        );
    }

    public CustomerDto toSummaryDto(CustomerEntity customer, List<String> salesOwners, List<String> supportOwners) {
        return new CustomerDto(
                customer.getId(),
                customer.getName(),
                customer.getShortName(),
                customer.getRegion(),
                customer.getAddress(),
                customer.getLevel(),
                customer.getStatus(),
                customer.getCreatedAt(),
                customer.getUpdatedAt(),
                salesOwners,
                supportOwners,
                List.of(),
                List.of(),
                List.of(),
                List.of()
        );
    }

    public CustomerContactDTO toContactDto(CustomerContactEntity entity) {
        return new CustomerContactDTO(entity.id(), entity.customerId(), entity.name(), entity.title(), entity.phone(), entity.email(), entity.remark());
    }

    public CustomerMaterialDto toMaterialDto(CustomerMaterialEntity entity) {
        return new CustomerMaterialDto(entity.getId(), entity.getCustomerId(), entity.getFileName(), entity.getFileType(), entity.getFileSize(), entity.getUploader(), entity.getBucket(), entity.getObjectKey(), entity.getStorageUrl(), entity.getStorageCategory(), entity.getUploadedAt());
    }

    public CustomerFollowupDto toFollowupDto(CustomerFollowupEntity entity) {
        Object attachments = entity.getAttachments() == null ? List.of() : JsonUtil.fromJson(entity.getAttachments());
        return new CustomerFollowupDto(entity.getId(), entity.getCustomerId(), entity.getAuthor(), entity.getContent(), attachments, entity.getCreatedAt());
    }

    public CustomerProjectDto toProjectDto(CustomerProjectEntity entity) {
        return new CustomerProjectDto(entity.getId(), entity.getProjectStatus(), entity.getProjectId(), entity.getExternalName(), entity.getExternalName(), entity.getInternalName(), entity.getModelName());
    }
}

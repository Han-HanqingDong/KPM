package com.kozen.kpm.customer.portal.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "客户门户首页数据")
public record CustomerPortalDataDto(
        CustomerPortalMeDto user,
        List<CustomerPortalProjectDto> projects,
        List<CustomerPortalMaterialDto> materials,
        List<CustomerPortalTaskDto> tasks,
        List<CustomerPortalAnnouncementDto> announcements,
        List<CustomerPortalMessageDto> messages,
        int unreadCount
) {}

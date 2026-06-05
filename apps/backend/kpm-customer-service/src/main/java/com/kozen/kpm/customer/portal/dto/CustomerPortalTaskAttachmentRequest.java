package com.kozen.kpm.customer.portal.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;
import java.util.Map;

@Schema(description = "客户门户任务附件绑定请求")
public record CustomerPortalTaskAttachmentRequest(
        @NotEmpty(message = "附件不能为空")
        @Schema(description = "文件服务返回的附件元数据列表") List<Map<String, Object>> attachments
) {
    public List<Map<String, Object>> safeAttachments() {
        return attachments == null ? List.of() : attachments;
    }
}

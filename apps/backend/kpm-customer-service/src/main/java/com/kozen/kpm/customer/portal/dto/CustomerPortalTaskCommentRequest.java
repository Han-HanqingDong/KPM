package com.kozen.kpm.customer.portal.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;

import java.util.List;

@Schema(description = "客户门户新增任务留言请求")
public record CustomerPortalTaskCommentRequest(
        @Size(max = 2000, message = "留言内容不能超过2000个字符")
        String content,
        @Size(max = 20, message = "留言附件不能超过20个")
        List<Object> attachments
) {
    public List<Object> safeAttachments() { return attachments == null ? List.of() : attachments; }
}

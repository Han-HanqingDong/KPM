package com.kozen.kpm.customer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;

import java.util.List;

@Schema(description = "客户跟进记录保存请求")
public record CustomerFollowupRequest(
        @Size(max = 64, message = "作者不能超过64个字符")
        String author,
        @Size(max = 2000, message = "跟进内容不能超过2000个字符")
        String content,
        @Size(max = 20, message = "跟进附件不能超过20个")
        List<Object> attachments
) {
    public List<Object> safeAttachments() { return attachments == null ? List.of() : attachments; }
}

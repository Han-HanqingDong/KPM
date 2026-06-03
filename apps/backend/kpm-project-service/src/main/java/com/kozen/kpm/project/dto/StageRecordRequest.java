package com.kozen.kpm.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record StageRecordRequest(
        @NotBlank(message = "留言人不能为空") @Size(max = 60, message = "留言人不能超过60个字符") String author,
        @Size(max = 2000, message = "阶段留言内容不能超过2000个字符") String content,
        @Size(max = 20, message = "阶段留言附件不能超过20个") List<Object> attachments
) {
    public List<Object> safeAttachments() { return attachments == null ? List.of() : attachments; }
}

package com.kozen.kpm.task.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

@Schema(description = "任务评论保存请求")
public record TaskCommentRequest(
        @NotBlank(message = "作者不能为空")
        @Size(max = 64, message = "作者不能超过64个字符")
        String author,
        @Pattern(regexp = "^$|internal|external", message = "留言类型只能是 internal 或 external")
        String commentType,
        @Size(max = 2000, message = "评论内容不能超过2000个字符")
        String content,
        @Size(max = 20, message = "评论附件不能超过20个")
        List<Object> attachments
) {
    public List<Object> safeAttachments() { return attachments == null ? List.of() : attachments; }
    public String normalizedCommentType() {
        return "external".equalsIgnoreCase(commentType == null ? "" : commentType.trim()) ? "external" : "internal";
    }
    public boolean external() { return "external".equals(normalizedCommentType()); }
}

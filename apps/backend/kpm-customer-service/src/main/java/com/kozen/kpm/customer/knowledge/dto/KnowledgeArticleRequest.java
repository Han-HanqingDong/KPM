package com.kozen.kpm.customer.knowledge.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.Map;

public record KnowledgeArticleRequest(
        @NotBlank(message = "请输入标题") @Size(max = 180, message = "标题不能超过180个字符") String title,
        @NotBlank(message = "请输入现象") @Size(max = 4000, message = "现象不能超过4000个字符") String symptom,
        @NotBlank(message = "请输入根因") @Size(max = 4000, message = "根因不能超过4000个字符") String rootCause,
        @Size(max = 6000, message = "解决方案不能超过6000个字符") String solution,
        @Size(max = 6000, message = "临时替代方案不能超过6000个字符") String workaround,
        List<Map<String, Object>> attachments,
        List<String> projectIds,
        String projectScope,
        List<String> customerIds,
        String customerScope,
        List<String> taskIds
) {
    public List<Map<String, Object>> safeAttachments() { return attachments == null ? List.of() : attachments; }
    public List<String> safeProjectIds() { return projectIds == null ? List.of() : projectIds.stream().filter(v -> v != null && !v.isBlank()).distinct().toList(); }
    public List<String> safeCustomerIds() { return customerIds == null ? List.of() : customerIds.stream().filter(v -> v != null && !v.isBlank()).distinct().toList(); }
    public List<String> safeTaskIds() { return taskIds == null ? List.of() : taskIds.stream().filter(v -> v != null && !v.isBlank()).distinct().toList(); }
}

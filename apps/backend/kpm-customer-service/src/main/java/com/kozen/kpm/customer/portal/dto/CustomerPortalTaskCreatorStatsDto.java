package com.kozen.kpm.customer.portal.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "客户门户联系人提交任务统计")
public record CustomerPortalTaskCreatorStatsDto(
        @Schema(description = "联系人邮箱") String contactEmail,
        @Schema(description = "联系人姓名") String contactName,
        @Schema(description = "提交任务数量") long submittedTasks
) {
}

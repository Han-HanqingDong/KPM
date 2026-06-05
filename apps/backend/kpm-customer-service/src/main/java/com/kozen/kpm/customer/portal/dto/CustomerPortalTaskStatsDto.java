package com.kozen.kpm.customer.portal.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "客户门户任务交付能力统计")
public record CustomerPortalTaskStatsDto(
        @Schema(description = "任务总数") long totalTasks,
        @Schema(description = "已完成任务数") long completedTasks,
        @Schema(description = "未完成任务数") long openTasks,
        @Schema(description = "完成率，0-100") double completionRate,
        @Schema(description = "平均首次响应小时数，仅统计已有 Kozen 外部回复的任务") double avgResponseHours,
        @Schema(description = "平均完成小时数，仅统计已完成任务") double avgCompletionHours,
        @Schema(description = "项目维度统计") List<CustomerPortalProjectTaskStatsDto> projects,
        @Schema(description = "客户联系人提交任务统计") List<CustomerPortalTaskCreatorStatsDto> creators,
        @Schema(description = "任务分类统计") List<CustomerPortalTaskCategoryStatsDto> categories
) {
}

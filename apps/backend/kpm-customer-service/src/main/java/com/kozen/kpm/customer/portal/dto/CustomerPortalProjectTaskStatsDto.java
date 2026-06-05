package com.kozen.kpm.customer.portal.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "客户门户项目维度任务统计")
public record CustomerPortalProjectTaskStatsDto(
        @Schema(description = "项目ID") String projectId,
        @Schema(description = "项目名称") String projectName,
        @Schema(description = "任务总数") long totalTasks,
        @Schema(description = "已完成任务数") long completedTasks,
        @Schema(description = "未完成任务数") long openTasks,
        @Schema(description = "平均首次响应小时数，仅统计已有 Kozen 外部回复的任务") double avgResponseHours,
        @Schema(description = "平均完成小时数，仅统计已完成任务") double avgCompletionHours
) {
}

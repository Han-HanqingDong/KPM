package com.kozen.kpm.customer.portal.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "客户门户任务分类统计")
public record CustomerPortalTaskCategoryStatsDto(
        @Schema(description = "任务分类业务值") String category,
        @Schema(description = "中文显示") String labelZh,
        @Schema(description = "英文显示") String labelEn,
        @Schema(description = "中文短标签") String shortLabelZh,
        @Schema(description = "英文短标签") String shortLabelEn,
        @Schema(description = "任务数量") long totalTasks
) {}

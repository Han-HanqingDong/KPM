package com.kozen.kpm.project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "项目公告发布请求")
public record ProjectAnnouncementRequest(
        @Size(max = 60, message = "公告类型不能超过60个字符")
        String announcementType,
        @NotBlank(message = "公告标题不能为空")
        @Size(max = 120, message = "公告标题不能超过120个字符")
        String title,
        @NotBlank(message = "公告内容不能为空")
        @Size(max = 3000, message = "公告内容不能超过3000个字符")
        String content
) {}

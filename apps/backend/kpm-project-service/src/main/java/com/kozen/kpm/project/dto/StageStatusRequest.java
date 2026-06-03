package com.kozen.kpm.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record StageStatusRequest(
        @NotBlank(message = "阶段状态不能为空")
        @Size(max = 40, message = "阶段状态不能超过40个字符")
        String status
) {}

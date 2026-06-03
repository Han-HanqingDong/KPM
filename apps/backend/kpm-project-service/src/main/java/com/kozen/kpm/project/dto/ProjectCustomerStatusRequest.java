package com.kozen.kpm.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProjectCustomerStatusRequest(
        @NotBlank(message = "客户项目状态不能为空")
        @Size(max = 60, message = "客户项目状态不能超过60个字符")
        String projectStatus
) {}

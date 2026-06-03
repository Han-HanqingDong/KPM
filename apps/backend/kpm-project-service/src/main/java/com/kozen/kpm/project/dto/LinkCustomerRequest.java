package com.kozen.kpm.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LinkCustomerRequest(
        @NotBlank(message = "客户ID不能为空") @Size(max = 80, message = "客户ID不能超过80个字符") String customerId,
        @Size(max = 60, message = "客户项目状态不能超过60个字符") String projectStatus
) {
}

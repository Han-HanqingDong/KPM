package com.kozen.kpm.resource.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "原型试用状态保存请求")
public record PrototypeStateRequest(
        @Schema(description = "前端原型状态对象") Object state,
        @Schema(description = "更新人") String updatedBy
) {}

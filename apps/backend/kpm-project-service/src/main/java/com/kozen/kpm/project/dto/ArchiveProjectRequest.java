package com.kozen.kpm.project.dto;

import jakarta.validation.constraints.NotNull;

public record ArchiveProjectRequest(@NotNull(message = "归档状态不能为空") Boolean archived) {}

package com.kozen.kpm.project.dto;

/** Typed persistence command for creating/updating project base information. */
public record ProjectWriteCommand(
        String id,
        String externalName,
        String internalName,
        String modelName,
        String managerUserId,
        String managerAccount,
        String description
) {}

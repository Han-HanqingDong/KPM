package com.kozen.kpm.project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

@Schema(description = "项目保存请求")
public record ProjectRequest(
        @NotBlank(message = "项目对外名称不能为空") @Size(max = 120, message = "项目对外名称不能超过120个字符") String externalName,
        @NotBlank(message = "项目内部名称不能为空") @Size(max = 120, message = "项目内部名称不能超过120个字符") String internalName,
        @NotBlank(message = "Model名称不能为空") @Size(max = 120, message = "Model名称不能超过120个字符") String modelName,
        @NotBlank(message = "项目负责人不能为空") @Size(max = 128, message = "项目负责人账号不能超过128个字符") String managerAccount,
        @Size(max = 2000, message = "项目描述不能超过2000个字符") String description,
        @Valid @Size(max = 200, message = "项目成员不能超过200项") List<ProjectMemberRequest> members,
        @Valid @Size(max = 80, message = "项目阶段不能超过80项") List<ProjectStageRequest> stages
) {
    public List<ProjectMemberRequest> safeMembers() { return members == null ? List.of() : members; }
    public List<ProjectStageRequest> safeStages() { return stages == null ? List.of() : stages; }
}

package com.kozen.kpm.file.controller;

import com.kozen.kpm.common.api.ApiResponse;
import com.kozen.kpm.file.model.DownloadUrlResult;
import com.kozen.kpm.file.model.FileUploadResult;
import com.kozen.kpm.file.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@Validated
@Tag(name = "文件服务", description = "负责 KPM 文件上传、OSS 存储和临时下载链接生成。")
@RequestMapping("/api/files")
public class FileApiController {
    private final FileStorageService fileStorageService;

    public FileApiController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "上传文件到 OSS", description = "按业务分类上传文件到 OSS，并返回业务服务可保存的文件元数据。")
    public ApiResponse<FileUploadResult> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "general") String category,
            @RequestParam(required = false) String businessId,
            @RequestParam @NotBlank String uploader
    ) throws IOException {
        return ApiResponse.ok(fileStorageService.upload(file, category, businessId, uploader));
    }

    @GetMapping("/download-url")
    @Operation(summary = "生成文件下载链接", description = "根据 OSS objectKey 生成短期有效的签名下载链接。")
    public ApiResponse<DownloadUrlResult> downloadUrl(
            @RequestParam @NotBlank String objectKey,
            @RequestParam(required = false) String fileName
    ) {
        return ApiResponse.ok(fileStorageService.createDownloadUrl(objectKey, fileName));
    }

    @GetMapping("/oss/status")
    @Operation(summary = "查看 OSS 配置状态", description = "返回 OSS 是否启用、Bucket、根路径等非敏感状态，不返回 AccessKey Secret。")
    public ApiResponse<Map<String, Object>> ossStatus() {
        return ApiResponse.ok(fileStorageService.status());
    }
}

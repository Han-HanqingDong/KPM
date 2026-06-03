package com.kozen.kpm.common.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.LinkedHashMap;
import java.util.Map;

@Schema(description = "文件元数据保存请求。文件实际内容由文件服务上传到 OSS。")
public record FileMetadataRequest(
        @NotBlank(message = "文件名不能为空")
        @Size(max = 255, message = "文件名不能超过255个字符")
        String fileName,
        @Size(max = 64, message = "文件类型不能超过64个字符")
        String fileType,
        @Size(max = 64, message = "文件大小不能超过64个字符")
        String fileSize,
        @NotBlank(message = "上传人不能为空")
        @Size(max = 64, message = "上传人不能超过64个字符")
        String uploader,
        @NotBlank(message = "Bucket不能为空")
        @Size(max = 128, message = "Bucket不能超过128个字符")
        String bucket,
        @NotBlank(message = "对象路径不能为空")
        @Size(max = 512, message = "对象路径不能超过512个字符")
        String objectKey,
        @NotBlank(message = "存储地址不能为空")
        @Size(max = 1024, message = "存储地址不能超过1024个字符")
        String storageUrl,
        @Size(max = 80, message = "文件分类不能超过80个字符")
        String category,
        @Size(max = 80, message = "文件分类不能超过80个字符")
        String storageCategory
) {
    public Map<String, Object> toMap() {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("fileName", fileName);
        map.put("fileType", fileType);
        map.put("fileSize", fileSize);
        map.put("uploader", uploader);
        map.put("bucket", bucket);
        map.put("objectKey", objectKey);
        map.put("storageUrl", storageUrl);
        map.put("category", category == null ? storageCategory : category);
        map.put("storageCategory", storageCategory == null ? category : storageCategory);
        return map;
    }
}

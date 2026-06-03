package com.kozen.kpm.file.service.impl;

import com.aliyun.oss.HttpMethod;
import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.aliyun.oss.model.GeneratePresignedUrlRequest;
import com.aliyun.oss.model.ObjectMetadata;
import com.aliyun.oss.model.ResponseHeaderOverrides;
import com.kozen.kpm.common.util.ValidationUtil;
import com.kozen.kpm.file.config.OssProperties;
import com.kozen.kpm.file.model.DownloadUrlResult;
import com.kozen.kpm.file.model.FileUploadResult;
import com.kozen.kpm.file.service.FileStorageService;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.net.URL;
import java.net.URLEncoder;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

@Service
public class AliyunOssFileStorageService implements FileStorageService {
    private static final DateTimeFormatter DATE_PATH_FORMATTER = DateTimeFormatter.ofPattern("yyyy/MM/dd");
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final Environment environment;

    public AliyunOssFileStorageService(Environment environment) {
        this.environment = environment;
    }

    @Override
    public FileUploadResult upload(MultipartFile file, String category, String businessId, String uploader) throws IOException {
        validateUpload(file, category, businessId, uploader);
        OssProperties oss = currentOssProperties();
        ensureReady(oss);
        String originalName = safeOriginalName(file.getOriginalFilename());
        String objectKey = buildObjectKey(oss, category, businessId, originalName);
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        if (file.getContentType() != null && !file.getContentType().isBlank()) {
            metadata.setContentType(file.getContentType());
        }
        metadata.addUserMetadata("original-name-b64", metadataValue(originalName));
        metadata.addUserMetadata("category", normalizeCategory(category));
        metadata.addUserMetadata("uploader-b64", metadataValue(uploader));

        OSS ossClient = createClient(oss);
        try {
            ossClient.putObject(oss.getBucket(), objectKey, file.getInputStream(), metadata);
        } finally {
            ossClient.shutdown();
        }

        String fileType = fileTypeLabel(originalName, file.getContentType());
        return new FileUploadResult(
                originalName,
                originalName,
                fileType,
                fileType,
                humanFileSize(file.getSize()),
                file.getSize(),
                file.getContentType() == null ? "application/octet-stream" : file.getContentType(),
                uploader,
                normalizeCategory(category),
                oss.getBucket(),
                objectKey,
                "oss://" + oss.getBucket() + "/" + objectKey,
                LocalDateTime.now().format(DATETIME_FORMATTER)
        );
    }

    @Override
    public DownloadUrlResult createDownloadUrl(String objectKey, String fileName) {
        OssProperties oss = currentOssProperties();
        ensureReady(oss);
        if (objectKey == null || objectKey.isBlank()) {
            throw new IllegalArgumentException("objectKey is required");
        }
        ValidationUtil.optionalText(objectKey, "objectKey", 512);
        ValidationUtil.optionalText(fileName, "文件名", 255);
        long expiresInSeconds = Math.max(60, oss.getDownloadUrlExpirationSeconds());
        Date expiration = new Date(System.currentTimeMillis() + expiresInSeconds * 1000);
        GeneratePresignedUrlRequest request = new GeneratePresignedUrlRequest(oss.getBucket(), objectKey, HttpMethod.GET);
        request.setExpiration(expiration);
        ResponseHeaderOverrides responseHeaders = new ResponseHeaderOverrides();
        responseHeaders.setContentDisposition(contentDisposition(downloadFileName(objectKey, fileName)));
        request.setResponseHeaders(responseHeaders);

        OSS ossClient = createClient(oss);
        try {
            URL signedUrl = ossClient.generatePresignedUrl(request);
            return new DownloadUrlResult(oss.getBucket(), objectKey, signedUrl.toString(), expiresInSeconds);
        } finally {
            ossClient.shutdown();
        }
    }

    @Override
    public Map<String, Object> status() {
        OssProperties oss = currentOssProperties();
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("enabled", oss.isEnabled());
        status.put("ready", oss.ready());
        status.put("endpoint", oss.getEndpoint());
        status.put("bucket", oss.getBucket());
        status.put("rootPrefix", oss.normalizedRootPrefix());
        status.put("accessKeyConfigured", hasText(oss.getAccessKeyId()) && hasText(oss.getAccessKeySecret()));
        status.put("downloadUrlExpirationSeconds", oss.getDownloadUrlExpirationSeconds());
        status.put("categories", categoryPaths());
        return status;
    }

    private OssProperties currentOssProperties() {
        OssProperties oss = new OssProperties();
        oss.setEnabled(environment.getProperty("kpm.oss.enabled", Boolean.class, false));
        oss.setEndpoint(environment.getProperty("kpm.oss.endpoint", ""));
        oss.setBucket(environment.getProperty("kpm.oss.bucket", ""));
        oss.setRootPrefix(environment.getProperty("kpm.oss.root-prefix", "KPM/"));
        oss.setAccessKeyId(environment.getProperty("kpm.oss.access-key-id", ""));
        oss.setAccessKeySecret(environment.getProperty("kpm.oss.access-key-secret", ""));
        oss.setDownloadUrlExpirationSeconds(environment.getProperty("kpm.oss.download-url-expiration-seconds", Long.class, 900L));
        return oss;
    }

    private OSS createClient(OssProperties oss) {
        return new OSSClientBuilder().build(oss.getEndpoint(), oss.getAccessKeyId(), oss.getAccessKeySecret());
    }

    private void ensureReady(OssProperties oss) {
        if (!oss.ready()) {
            throw new IllegalStateException("OSS storage is not ready. Please set kpm.oss.enabled=true and configure endpoint, bucket, access-key-id and access-key-secret in Nacos.");
        }
    }

    private void validateUpload(MultipartFile file, String category, String businessId, String uploader) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("上传文件不能为空");
        }
        if (file.getSize() > 500L * 1024 * 1024) {
            throw new IllegalArgumentException("单个上传文件不能超过500MB");
        }
        ValidationUtil.optionalText(file.getOriginalFilename(), "文件名", 255);
        ValidationUtil.optionalText(category, "文件分类", 80);
        ValidationUtil.optionalText(businessId, "业务ID", 120);
        ValidationUtil.requireText(uploader, "上传人", 60);
    }

    private String buildObjectKey(OssProperties oss, String category, String businessId, String originalName) {
        String categoryPath = categoryPath(category);
        String businessSegment = safePathSegment(businessId == null || businessId.isBlank() ? "general" : businessId);
        String dateSegment = LocalDate.now().format(DATE_PATH_FORMATTER);
        String uniqueName = UUID.randomUUID() + "-" + safeOriginalName(originalName);
        return oss.normalizedRootPrefix() + categoryPath + "/" + businessSegment + "/" + dateSegment + "/" + uniqueName;
    }

    private static boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private static String normalizeCategory(String category) {
        return category == null || category.isBlank() ? "general" : category.trim().toLowerCase(Locale.ROOT);
    }

    private static String categoryPath(String category) {
        return categoryPaths().getOrDefault(normalizeCategory(category), "general");
    }

    private static Map<String, String> categoryPaths() {
        Map<String, String> paths = new LinkedHashMap<>();
        paths.put("project-stage-materials", "project/stage-materials");
        paths.put("project-materials", "project/materials");
        paths.put("stage-record-attachments", "project/stage-record-attachments");
        paths.put("customer-materials", "customer/materials");
        paths.put("customer-followup-attachments", "customer/followup-attachments");
        paths.put("task-attachments", "task/attachments");
        paths.put("task-comment-attachments", "task/comment-attachments");
        paths.put("general", "general");
        return paths;
    }

    private static String downloadFileName(String objectKey, String fileName) {
        String candidate = fileName == null || fileName.isBlank() ? objectKey.substring(objectKey.lastIndexOf('/') + 1) : fileName.trim();
        return safeOriginalName(candidate);
    }

    private static String contentDisposition(String fileName) {
        String asciiFallback = fileName.replaceAll("[^A-Za-z0-9._-]", "_");
        if (asciiFallback.isBlank()) asciiFallback = "download";
        String encoded = URLEncoder.encode(fileName, StandardCharsets.UTF_8).replace("+", "%20");
        return "attachment; filename=\"" + asciiFallback + "\"; filename*=UTF-8''" + encoded;
    }

    private static String safeOriginalName(String fileName) {
        String value = fileName == null || fileName.isBlank() ? "unnamed-file" : fileName.trim();
        value = value.replace('\\', '-').replace('/', '-');
        value = value.replaceAll("[\\p{Cntrl}]", "");
        return value.length() > 180 ? value.substring(value.length() - 180) : value;
    }

    private static String safePathSegment(String value) {
        String safe = value.trim().replace('\\', '-').replace('/', '-').replaceAll("[^\\p{L}\\p{N}_.-]", "-");
        safe = safe.replaceAll("-+", "-").replaceAll("^-|-$", "");
        return safe.isBlank() ? "general" : safe;
    }

    private static String metadataValue(String value) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }

    private static String humanFileSize(long bytes) {
        if (bytes < 1024) return bytes + " B";
        double kb = bytes / 1024.0;
        if (kb < 1024) return String.format(Locale.US, "%.1f KB", kb);
        double mb = kb / 1024.0;
        if (mb < 1024) return String.format(Locale.US, "%.1f MB", mb);
        return String.format(Locale.US, "%.1f GB", mb / 1024.0);
    }

    private static String fileTypeLabel(String fileName, String contentType) {
        String lowerName = fileName == null ? "" : fileName.toLowerCase(Locale.ROOT);
        String lowerContentType = contentType == null ? "" : contentType.toLowerCase(Locale.ROOT);
        if (lowerContentType.startsWith("image/") || lowerName.matches(".*\\.(png|jpg|jpeg|gif|webp|svg)$")) return "图片";
        if (lowerContentType.startsWith("video/") || lowerName.matches(".*\\.(mp4|mov|avi|mkv|webm)$")) return "视频";
        if (lowerName.endsWith(".pdf")) return "PDF";
        if (lowerName.matches(".*\\.(doc|docx)$")) return "Word";
        if (lowerName.matches(".*\\.(xls|xlsx|csv)$")) return "表格";
        if (lowerName.matches(".*\\.(ppt|pptx)$")) return "演示文稿";
        return "文件";
    }
}

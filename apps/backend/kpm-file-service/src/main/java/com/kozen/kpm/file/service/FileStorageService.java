package com.kozen.kpm.file.service;

import com.kozen.kpm.file.model.DownloadUrlResult;
import com.kozen.kpm.file.model.FileUploadResult;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

/**
 * Handles physical file storage. Business services only keep file metadata and
 * references, while this service owns OSS object keys, signed download URLs and
 * storage-category path rules.
 */
public interface FileStorageService {
    /** Upload one file to the configured object storage and return metadata for business persistence. */
    FileUploadResult upload(MultipartFile file, String category, String businessId, String uploader) throws IOException;

    /** Generate a short-lived download URL for an existing OSS object key. */
    DownloadUrlResult createDownloadUrl(String objectKey, String fileName);

    /** Return a safe status view without exposing access secrets. */
    Map<String, Object> status();
}

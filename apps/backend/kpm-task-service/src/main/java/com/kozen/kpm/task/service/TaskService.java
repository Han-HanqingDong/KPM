package com.kozen.kpm.task.service;

import com.kozen.kpm.common.api.PageResult;
import com.kozen.kpm.common.dto.FileMetadataRequest;
import com.kozen.kpm.task.dto.TaskCommentDto;
import com.kozen.kpm.task.dto.TaskCommentRequest;
import com.kozen.kpm.task.dto.TaskDto;
import com.kozen.kpm.task.dto.TaskRequest;

import java.util.List;

/**
 * Task domain service.
 * Responsible for task CRUD, assignee/participant maintenance,
 * attachments, comments and requirement-status synchronization.
 */
public interface TaskService {
    /** Query task list by optional keyword/status/category filters. */
    List<TaskDto> list(String keyword, String status, String category);
    /** Query task list by page with keyword/status/category/customer/project filters in SQL. */
    PageResult<TaskDto> page(String keyword, String status, String category, String customerId, String projectId, String id, String userId, String assigneeScope, String relationScope, String statusScope, List<String> completedStatuses, Integer page, Integer pageSize);
    /** Load one task detail. */
    TaskDto detail(String id);
    /** Create one task. */
    TaskDto create(TaskRequest request);
    /** Update one task and sync linked requirement status if needed. */
    TaskDto update(String id, TaskRequest request);
    /** Delete one task. */
    boolean delete(String id);
    /** Query comments by page in newest-first order. */
    PageResult<TaskCommentDto> comments(String id, Integer page, Integer pageSize);
    /** Add one task comment. */
    TaskDto addComment(String id, TaskCommentRequest request);
    /** Add one task attachment record. */
    TaskDto addAttachment(String id, FileMetadataRequest request);
    /** Logically delete one task attachment record. */
    TaskDto deleteAttachment(String id, String attachmentId);
}

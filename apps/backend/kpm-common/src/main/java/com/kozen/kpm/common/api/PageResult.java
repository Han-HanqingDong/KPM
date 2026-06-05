package com.kozen.kpm.common.api;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

/**
 * Common paged API response body.
 *
 * <p>List pages should prefer this structure instead of returning all rows and
 * letting the frontend paginate in memory. It keeps query conditions inside the
 * database, protects the browser from large payloads and gives the UI enough
 * metadata for controlled pagination.</p>
 */
@Schema(description = "分页查询结果")
public record PageResult<T>(
        @Schema(description = "当前页数据") List<T> items,
        @Schema(description = "总记录数") long total,
        @Schema(description = "当前页码，从1开始") int page,
        @Schema(description = "每页条数") int pageSize,
        @Schema(description = "总页数") long totalPages,
        @Schema(description = "是否还有下一页") boolean hasNext
) {
    public static <T> PageResult<T> of(List<T> items, long total, int page, int pageSize) {
        int safePageSize = Math.max(1, pageSize);
        int safePage = Math.max(1, page);
        long pages = total <= 0 ? 0 : (total + safePageSize - 1) / safePageSize;
        return new PageResult<>(
                items == null ? List.of() : List.copyOf(items),
                Math.max(0, total),
                safePage,
                safePageSize,
                pages,
                pages > safePage
        );
    }
}

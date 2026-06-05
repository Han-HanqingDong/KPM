package com.kozen.kpm.common.util;

/**
 * Shared pagination parameter normalization.
 *
 * <p>The cap prevents accidental huge requests such as {@code pageSize=100000}
 * from creating database and JVM pressure. Services can still expose separate
 * export endpoints later if full data export is required.</p>
 */
public final class PageParamUtil {
    public static final int DEFAULT_PAGE = 1;
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MAX_PAGE_SIZE = 100;

    private PageParamUtil() {
    }

    public static int page(Integer page) {
        return page == null || page < 1 ? DEFAULT_PAGE : page;
    }

    public static int pageSize(Integer pageSize) {
        if (pageSize == null || pageSize < 1) {
            return DEFAULT_PAGE_SIZE;
        }
        return Math.min(pageSize, MAX_PAGE_SIZE);
    }

    public static int offset(int page, int pageSize) {
        return Math.max(0, (page(page) - 1) * pageSize(pageSize));
    }
}

package com.kozen.kpm.common.util;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * Small validation helper for the current Map-shaped API payloads.
 *
 * The pilot backend still accepts flexible Map payloads so that the prototype can
 * iterate quickly. All write services must validate and normalize values here
 * before they reach mapper/SQL code.
 */
public final class ValidationUtil {
    private static final Pattern EMAIL = Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    private static final Pattern ACCOUNT = Pattern.compile("^[A-Za-z0-9._%+@-]{3,128}$");

    private ValidationUtil() {}

    public static String requireText(Map<String, Object> body, String key, String label, int maxLength) {
        return requireText(value(body, key), label, maxLength);
    }

    public static String requireText(Object value, String label, int maxLength) {
        String text = text(value);
        if (text.isBlank()) throw invalid(label + "不能为空");
        if (text.length() > maxLength) throw invalid(label + "不能超过" + maxLength + "个字符");
        return text;
    }

    public static String optionalText(Map<String, Object> body, String key, String label, int maxLength) {
        return optionalText(value(body, key), label, maxLength);
    }

    public static String optionalText(Object value, String label, int maxLength) {
        String text = text(value);
        if (text.length() > maxLength) throw invalid(label + "不能超过" + maxLength + "个字符");
        return text;
    }

    public static String requireAccount(Map<String, Object> body, String key, String label) {
        String account = requireText(body, key, label, 128);
        if (!ACCOUNT.matcher(account).matches()) {
            throw invalid(label + "只能包含英文字母、数字、点、下划线、中划线或邮箱符号，长度 3-128 位");
        }
        return account;
    }


    public static String requireEmail(Map<String, Object> body, String key, String label) {
        return requireEmail(value(body, key), label);
    }

    public static String requireEmail(Object value, String label) {
        String email = requireText(value, label, 128);
        if (!EMAIL.matcher(email).matches()) throw invalid(label + "格式不正确");
        return email;
    }

    public static String optionalEmail(Map<String, Object> body, String key, String label) {
        String email = optionalText(body, key, label, 128);
        if (!email.isBlank() && !EMAIL.matcher(email).matches()) throw invalid(label + "格式不正确");
        return email;
    }

    public static String optionalPhone(Map<String, Object> body, String key, String label) {
        String phone = optionalText(body, key, label, 32);
        if (!phone.isBlank() && phone.length() < 4) throw invalid(label + "长度不能少于4个字符");
        return phone;
    }

    public static int positiveInt(Map<String, Object> body, String key, String label, int max) {
        int number;
        try {
            number = Integer.parseInt(String.valueOf(value(body, key)));
        } catch (Exception e) {
            throw invalid(label + "必须是整数");
        }
        if (number <= 0) throw invalid(label + "必须大于0");
        if (number > max) throw invalid(label + "不能超过" + max);
        return number;
    }

    public static BigDecimal nonNegativeDecimal(Map<String, Object> body, String key, String label) {
        BigDecimal number;
        try {
            Object raw = value(body, key);
            if (raw == null || String.valueOf(raw).isBlank()) return BigDecimal.ZERO;
            number = new BigDecimal(String.valueOf(raw));
        } catch (Exception e) {
            throw invalid(label + "必须是数字");
        }
        if (number.compareTo(BigDecimal.ZERO) < 0) throw invalid(label + "不能小于0");
        if (number.compareTo(new BigDecimal("999999999999.99")) > 0) throw invalid(label + "金额过大");
        return number;
    }

    public static String requireDate(Map<String, Object> body, String key, String label) {
        String date = requireText(body, key, label, 10);
        try {
            LocalDate.parse(date);
            return date;
        } catch (DateTimeParseException e) {
            throw invalid(label + "必须是 YYYY-MM-DD 格式");
        }
    }

    public static String optionalDate(Map<String, Object> body, String key, String label) {
        String date = optionalText(body, key, label, 10);
        if (date.isBlank()) return date;
        try {
            LocalDate.parse(date);
            return date;
        } catch (DateTimeParseException e) {
            throw invalid(label + "必须是 YYYY-MM-DD 格式");
        }
    }

    public static void optionalJsonArrayLike(Map<String, Object> body, String key, String label, int maxItems) {
        Object value = value(body, key);
        if (value == null) return;
        if (value instanceof Collection<?> collection && collection.size() > maxItems) {
            throw invalid(label + "不能超过" + maxItems + "项");
        }
    }

    public static void maxList(Map<String, Object> body, String key, String label, int maxItems) {
        Object value = value(body, key);
        if (value == null) return;
        if (!(value instanceof Collection<?> collection)) throw invalid(label + "格式不正确");
        if (collection.size() > maxItems) throw invalid(label + "不能超过" + maxItems + "项");
        for (Object item : collection) {
            if (item instanceof Map<?, ?>) continue;
            optionalText(item, label + "项", 128);
        }
    }

    public static void requireKnownValue(Map<String, Object> body, String key, String label, List<String> allowed) {
        String text = requireText(body, key, label, 64);
        if (!allowed.contains(text)) throw invalid(label + "不在允许范围内");
    }

    public static void validateFileMeta(Map<String, Object> body) {
        requireText(body, "fileName", "文件名", 255);
        optionalText(body, "fileType", "文件类型", 64);
        optionalText(body, "fileSize", "文件大小", 64);
        optionalText(body, "uploader", "上传人", 64);
        optionalText(body, "bucket", "Bucket", 128);
        optionalText(body, "objectKey", "对象路径", 512);
        optionalText(body, "storageUrl", "存储地址", 1024);
        optionalText(body, "category", "文件分类", 80);
        optionalText(body, "storageCategory", "文件分类", 80);
    }

    private static Object value(Map<String, Object> body, String key) {
        return body == null ? null : body.get(key);
    }

    private static String text(Object value) {
        return value == null ? "" : String.valueOf(value).trim();
    }

    private static IllegalArgumentException invalid(String message) {
        return new IllegalArgumentException(message);
    }
}

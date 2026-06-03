package com.kozen.kpm.common.mybatis;

import org.apache.ibatis.reflection.MetaObject;
import org.apache.ibatis.reflection.wrapper.MapWrapper;

import java.util.Map;

/**
 * MyBatis map result wrapper that keeps legacy API responses in camelCase.
 *
 * <p>The old JdbcTemplate mapper camelized every query result. MyBatis returns map keys based on
 * column labels by default, so this wrapper applies the same underscore-to-camel behavior for
 * map-shaped read models while we gradually introduce explicit response DTOs.</p>
 */
public class CamelCaseMapWrapper extends MapWrapper {
    public CamelCaseMapWrapper(MetaObject metaObject, Map<String, Object> map) {
        super(metaObject, map);
    }

    @Override
    public String findProperty(String name, boolean useCamelCaseMapping) {
        if (!useCamelCaseMapping || name == null) {
            return name;
        }
        return underlineToCamel(name);
    }

    private String underlineToCamel(String value) {
        StringBuilder result = new StringBuilder(value.length());
        boolean upperNext = false;
        for (char ch : value.toCharArray()) {
            if (ch == '_') {
                upperNext = true;
                continue;
            }
            result.append(upperNext ? Character.toUpperCase(ch) : ch);
            upperNext = false;
        }
        return result.toString();
    }
}

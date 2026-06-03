package com.kozen.kpm.analytics.service.impl;

import com.kozen.kpm.analytics.config.GeocodingProperties;
import com.kozen.kpm.analytics.mapper.AnalyticsMapper;
import com.kozen.kpm.analytics.service.AnalyticsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Default analytics read-service implementation. */
@Service
public class AnalyticsServiceImpl implements AnalyticsService {
    private final AnalyticsMapper analyticsMapper;
    private final GeoCoordinateResolver geoCoordinateResolver;

    public AnalyticsServiceImpl(AnalyticsMapper analyticsMapper, GeocodingProperties geocodingProperties) {
        this.analyticsMapper = analyticsMapper;
        this.geoCoordinateResolver = new GeoCoordinateResolver(analyticsMapper, geocodingProperties);
    }

    @Override
    public Map<String, Object> dashboard() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("projectCount", analyticsMapper.projectCount());
        data.put("activeProjectCount", analyticsMapper.activeProjectCount());
        data.put("customerCount", analyticsMapper.customerCount());
        data.put("openTaskCount", analyticsMapper.openTaskCount());
        return data;
    }

    @Override
    public List<Map<String, Object>> orderStats(String targetCurrency) {
        double eurToUsd = 1.08;
        double cnyToUsd = 0.14;
        double usdToCny = 7.2;
        List<Map<String, Object>> rows = analyticsMapper.orderStats();
        for (Map<String, Object> row : rows) {
            double amount = Double.parseDouble(String.valueOf(row.get("amount")));
            String currency = String.valueOf(row.get("currency"));
            double usd = switch (currency) { case "EUR" -> amount * eurToUsd; case "CNY" -> amount * cnyToUsd; default -> amount; };
            row.put("targetCurrency", targetCurrency);
            row.put("convertedAmount", "CNY".equals(targetCurrency) ? Math.round(usd * usdToCny * 100.0) / 100.0 : Math.round(usd * 100.0) / 100.0);
        }
        return rows;
    }

    @Override
    @Transactional
    public List<Map<String, Object>> resourceMap() {
        List<Map<String, Object>> rows = analyticsMapper.resourceMap();
        rows.forEach(this::enrichGeoCoordinate);
        return rows;
    }

    private void enrichGeoCoordinate(Map<String, Object> row) {
        String address = text(row.get("address"));
        String region = text(row.get("region"));
        geoCoordinateResolver.resolve(address, region).ifPresentOrElse(point -> {
            row.put("latitude", point.latitude());
            row.put("longitude", point.longitude());
            row.put("geocodedAddress", point.displayName());
            row.put("geocodeProvider", point.provider());
            row.put("geoPrecision", point.precision());
            row.put("geocodeQuery", point.query());
        }, () -> {
            row.put("latitude", null);
            row.put("longitude", null);
            row.put("geocodedAddress", null);
            row.put("geocodeProvider", "unresolved");
            row.put("geoPrecision", "unresolved");
            row.put("geocodeQuery", address == null || address.isBlank() ? region : address);
        });
    }

    private String text(Object value) {
        return value == null ? "" : String.valueOf(value);
    }

    @Override
    public List<Map<String, Object>> support(String customerId) {
        String cid = customerId == null || customerId.isBlank() ? "" : customerId;
        return analyticsMapper.support(cid);
    }

    @Override
    public List<Map<String, Object>> activity() {
        List<Map<String, Object>> rows = analyticsMapper.activity();
        rows.forEach(row -> row.put("activityStatus", classify(row)));
        return rows;
    }

    private String classify(Map<String, Object> row) {
        if ("已停用".equals(row.get("status"))) return "遗弃";
        if (row.get("lastOrderDate") != null || Integer.parseInt(String.valueOf(row.get("openTaskCount"))) > 0) return "活跃";
        if (row.get("lastFollowupAt") == null) return "停滞";
        return "观察";
    }
}

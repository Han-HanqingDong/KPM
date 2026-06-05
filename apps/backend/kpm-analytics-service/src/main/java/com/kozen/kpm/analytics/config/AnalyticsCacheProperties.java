package com.kozen.kpm.analytics.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.time.Duration;

/** Redis cache settings for analytics read models. */
@Component
@ConfigurationProperties(prefix = "kpm.cache.analytics")
public class AnalyticsCacheProperties {
    private long dashboardTtlSeconds = 30;
    private long dashboardJitterSeconds = 10;
    private long orderStatsTtlSeconds = 90;
    private long orderStatsJitterSeconds = 30;
    private long resourceMapTtlSeconds = 600;
    private long resourceMapJitterSeconds = 120;
    private long supportStatsTtlSeconds = 60;
    private long supportStatsJitterSeconds = 20;
    private long activityTtlSeconds = 180;
    private long activityJitterSeconds = 45;

    public Duration dashboardTtl() {
        return seconds(dashboardTtlSeconds, 1);
    }

    public Duration dashboardJitter() {
        return seconds(dashboardJitterSeconds, 0);
    }

    public Duration orderStatsTtl() {
        return seconds(orderStatsTtlSeconds, 1);
    }

    public Duration orderStatsJitter() {
        return seconds(orderStatsJitterSeconds, 0);
    }

    public Duration resourceMapTtl() {
        return seconds(resourceMapTtlSeconds, 1);
    }

    public Duration resourceMapJitter() {
        return seconds(resourceMapJitterSeconds, 0);
    }

    public Duration supportStatsTtl() {
        return seconds(supportStatsTtlSeconds, 1);
    }

    public Duration supportStatsJitter() {
        return seconds(supportStatsJitterSeconds, 0);
    }

    public Duration activityTtl() {
        return seconds(activityTtlSeconds, 1);
    }

    public Duration activityJitter() {
        return seconds(activityJitterSeconds, 0);
    }

    private Duration seconds(long value, long min) {
        return Duration.ofSeconds(Math.max(min, value));
    }

    public long getDashboardTtlSeconds() {
        return dashboardTtlSeconds;
    }

    public void setDashboardTtlSeconds(long dashboardTtlSeconds) {
        this.dashboardTtlSeconds = dashboardTtlSeconds;
    }

    public long getDashboardJitterSeconds() {
        return dashboardJitterSeconds;
    }

    public void setDashboardJitterSeconds(long dashboardJitterSeconds) {
        this.dashboardJitterSeconds = dashboardJitterSeconds;
    }

    public long getOrderStatsTtlSeconds() {
        return orderStatsTtlSeconds;
    }

    public void setOrderStatsTtlSeconds(long orderStatsTtlSeconds) {
        this.orderStatsTtlSeconds = orderStatsTtlSeconds;
    }

    public long getOrderStatsJitterSeconds() {
        return orderStatsJitterSeconds;
    }

    public void setOrderStatsJitterSeconds(long orderStatsJitterSeconds) {
        this.orderStatsJitterSeconds = orderStatsJitterSeconds;
    }

    public long getResourceMapTtlSeconds() {
        return resourceMapTtlSeconds;
    }

    public void setResourceMapTtlSeconds(long resourceMapTtlSeconds) {
        this.resourceMapTtlSeconds = resourceMapTtlSeconds;
    }

    public long getResourceMapJitterSeconds() {
        return resourceMapJitterSeconds;
    }

    public void setResourceMapJitterSeconds(long resourceMapJitterSeconds) {
        this.resourceMapJitterSeconds = resourceMapJitterSeconds;
    }

    public long getSupportStatsTtlSeconds() {
        return supportStatsTtlSeconds;
    }

    public void setSupportStatsTtlSeconds(long supportStatsTtlSeconds) {
        this.supportStatsTtlSeconds = supportStatsTtlSeconds;
    }

    public long getSupportStatsJitterSeconds() {
        return supportStatsJitterSeconds;
    }

    public void setSupportStatsJitterSeconds(long supportStatsJitterSeconds) {
        this.supportStatsJitterSeconds = supportStatsJitterSeconds;
    }

    public long getActivityTtlSeconds() {
        return activityTtlSeconds;
    }

    public void setActivityTtlSeconds(long activityTtlSeconds) {
        this.activityTtlSeconds = activityTtlSeconds;
    }

    public long getActivityJitterSeconds() {
        return activityJitterSeconds;
    }

    public void setActivityJitterSeconds(long activityJitterSeconds) {
        this.activityJitterSeconds = activityJitterSeconds;
    }
}

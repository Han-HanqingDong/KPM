package com.kozen.kpm.resource.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.time.Duration;

/** Redis cache settings for resource metadata. */
@Component
@ConfigurationProperties(prefix = "kpm.cache.resource")
public class ResourceCacheProperties {
    private long bootstrapTtlSeconds = 60;
    private long bootstrapJitterSeconds = 20;

    public Duration bootstrapTtl() {
        return Duration.ofSeconds(Math.max(1, bootstrapTtlSeconds));
    }

    public Duration bootstrapJitter() {
        return Duration.ofSeconds(Math.max(0, bootstrapJitterSeconds));
    }

    public long getBootstrapTtlSeconds() {
        return bootstrapTtlSeconds;
    }

    public void setBootstrapTtlSeconds(long bootstrapTtlSeconds) {
        this.bootstrapTtlSeconds = bootstrapTtlSeconds;
    }

    public long getBootstrapJitterSeconds() {
        return bootstrapJitterSeconds;
    }

    public void setBootstrapJitterSeconds(long bootstrapJitterSeconds) {
        this.bootstrapJitterSeconds = bootstrapJitterSeconds;
    }
}

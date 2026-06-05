package com.kozen.kpm.common.cache;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.function.Supplier;

/**
 * Redis backed JSON cache for read-mostly data.
 *
 * <p>The cache intentionally stores plain JSON strings instead of Java serialized objects so cached
 * values remain observable in Redis CLI and safe across JVM/package refactors. It also includes
 * three production safeguards:</p>
 *
 * <ul>
 *   <li>TTL jitter to avoid many keys expiring at the same instant;</li>
 *   <li>a short Redis lock for single-key rebuilds to reduce cache breakdown under concurrency;</li>
 *   <li>graceful fallback to the loader when Redis is temporarily unavailable.</li>
 * </ul>
 */
public class RedisJsonCache {
    private static final Logger log = LoggerFactory.getLogger(RedisJsonCache.class);
    private static final Duration DEFAULT_LOCK_TTL = Duration.ofSeconds(10);
    private static final int LOCK_WAIT_ATTEMPTS = 6;
    private static final DefaultRedisScript<Long> UNLOCK_SCRIPT = new DefaultRedisScript<>(
            "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end",
            Long.class
    );

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    public RedisJsonCache(StringRedisTemplate redisTemplate, ObjectMapper objectMapper) {
        this.redisTemplate = Objects.requireNonNull(redisTemplate, "redisTemplate");
        this.objectMapper = Objects.requireNonNull(objectMapper, "objectMapper");
    }

    public static RedisJsonCache withDefaultMapper(StringRedisTemplate redisTemplate) {
        ObjectMapper mapper = JsonMapper.builder()
                .findAndAddModules()
                .build();
        return new RedisJsonCache(redisTemplate, mapper);
    }

    public <T> T get(String key, Class<T> valueType, Duration ttl, Duration jitter, Supplier<T> loader) {
        JavaType javaType = objectMapper.getTypeFactory().constructType(valueType);
        return get(key, javaType, ttl, jitter, loader);
    }

    public <T> T get(String key, TypeReference<T> valueType, Duration ttl, Duration jitter, Supplier<T> loader) {
        JavaType javaType = objectMapper.getTypeFactory().constructType(valueType);
        return get(key, javaType, ttl, jitter, loader);
    }

    public void evict(String key) {
        try {
            redisTemplate.delete(key);
        } catch (Exception ex) {
            log.warn("Redis cache evict failed, key={}", key, ex);
        }
    }

    public void evictByPrefix(String prefix) {
        String match = prefix.endsWith("*") ? prefix : prefix + "*";
        try {
            redisTemplate.execute((RedisCallback<Void>) connection -> {
                List<byte[]> keys = new ArrayList<>();
                ScanOptions options = ScanOptions.scanOptions().match(match).count(500).build();
                try (Cursor<byte[]> cursor = connection.scan(options)) {
                    cursor.forEachRemaining(keys::add);
                }
                if (!keys.isEmpty()) {
                    connection.keyCommands().del(keys.toArray(byte[][]::new));
                }
                return null;
            });
        } catch (Exception ex) {
            log.warn("Redis cache prefix evict failed, prefix={}", prefix, ex);
        }
    }

    private <T> T get(String key, JavaType valueType, Duration ttl, Duration jitter, Supplier<T> loader) {
        Objects.requireNonNull(key, "key");
        Objects.requireNonNull(valueType, "valueType");
        Objects.requireNonNull(ttl, "ttl");
        Objects.requireNonNull(jitter, "jitter");
        Objects.requireNonNull(loader, "loader");

        try {
            T cached = read(key, valueType);
            if (cached != null) {
                return cached;
            }
            return loadWithRedisLock(key, valueType, ttl, jitter, loader);
        } catch (Exception ex) {
            log.warn("Redis cache unavailable, fallback to direct load, key={}", key, ex);
            return loader.get();
        }
    }

    private <T> T loadWithRedisLock(String key, JavaType valueType, Duration ttl, Duration jitter, Supplier<T> loader) {
        String lockKey = key + ":lock";
        String token = UUID.randomUUID().toString();
        boolean locked = Boolean.TRUE.equals(redisTemplate.opsForValue().setIfAbsent(lockKey, token, DEFAULT_LOCK_TTL));
        if (locked) {
            try {
                T cachedAfterLock = read(key, valueType);
                if (cachedAfterLock != null) {
                    return cachedAfterLock;
                }
                T loaded = loader.get();
                write(key, loaded, ttlWithJitter(ttl, jitter));
                return loaded;
            } finally {
                unlock(lockKey, token);
            }
        }

        T cachedAfterWait = waitForPeerRebuild(key, valueType);
        if (cachedAfterWait != null) {
            return cachedAfterWait;
        }

        log.warn("Redis cache rebuild lock wait timed out, fallback to direct load without cache write, key={}", key);
        return loader.get();
    }

    private <T> T waitForPeerRebuild(String key, JavaType valueType) {
        for (int i = 1; i <= LOCK_WAIT_ATTEMPTS; i++) {
            sleepQuietly(40L * i);
            T cached = read(key, valueType);
            if (cached != null) {
                return cached;
            }
        }
        return null;
    }

    private <T> T read(String key, JavaType valueType) {
        String json = redisTemplate.opsForValue().get(key);
        if (json == null || json.isBlank()) {
            return null;
        }
        try {
            return objectMapper.readValue(json, valueType);
        } catch (JsonProcessingException ex) {
            log.warn("Redis cache JSON parse failed; evict dirty value, key={}", key, ex);
            redisTemplate.delete(key);
            return null;
        }
    }

    private void write(String key, Object value, Duration ttl) {
        if (value == null) {
            return;
        }
        try {
            redisTemplate.opsForValue().set(key, objectMapper.writeValueAsString(value), ttl);
        } catch (JsonProcessingException ex) {
            log.warn("Redis cache JSON write failed, key={}", key, ex);
        }
    }

    private void unlock(String lockKey, String token) {
        try {
            redisTemplate.execute(UNLOCK_SCRIPT, List.of(lockKey), token);
        } catch (Exception ex) {
            log.warn("Redis cache lock release failed, key={}", lockKey, ex);
        }
    }

    private Duration ttlWithJitter(Duration ttl, Duration jitter) {
        long ttlMillis = Math.max(1, ttl.toMillis());
        long jitterMillis = Math.max(0, jitter.toMillis());
        if (jitterMillis == 0) {
            return Duration.ofMillis(ttlMillis);
        }
        return Duration.ofMillis(ttlMillis + ThreadLocalRandom.current().nextLong(jitterMillis + 1));
    }

    private void sleepQuietly(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
        }
    }
}

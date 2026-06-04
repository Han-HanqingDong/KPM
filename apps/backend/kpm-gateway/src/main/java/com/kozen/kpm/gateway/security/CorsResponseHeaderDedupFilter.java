package com.kozen.kpm.gateway.security;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

/**
 * Deduplicates browser CORS headers at the gateway boundary.
 *
 * <p>Spring Cloud Gateway owns cross-origin handling for the frontend. In local distributed mode
 * more than one response filter can add the same CORS header; browsers reject values such as
 * {@code Access-Control-Allow-Origin: http://127.0.0.1:4173, http://127.0.0.1:4173}. This filter
 * keeps only the first effective value before the response is committed.</p>
 */
@Component
public class CorsResponseHeaderDedupFilter implements GlobalFilter, Ordered {
    private static final List<String> CORS_HEADERS = List.of(
            HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN,
            HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS,
            HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS,
            HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS,
            HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        exchange.getResponse().beforeCommit(() -> {
            CORS_HEADERS.forEach(header -> dedupe(exchange.getResponse().getHeaders(), header));
            return Mono.empty();
        });
        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return Ordered.LOWEST_PRECEDENCE;
    }

    private void dedupe(HttpHeaders headers, String header) {
        List<String> values = headers.get(header);
        if (values == null || values.size() <= 1) return;
        Set<String> unique = new LinkedHashSet<>();
        for (String value : values) {
            if (value == null || value.isBlank()) continue;
            for (String part : value.split(",")) {
                String normalized = part.trim();
                if (!normalized.isBlank()) unique.add(normalized);
            }
        }
        if (unique.isEmpty()) {
            headers.remove(header);
            return;
        }
        // Access-Control-Allow-Origin must be a single origin or "*"; keep the first value.
        if (HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN.equalsIgnoreCase(header)
                || HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS.equalsIgnoreCase(header)) {
            headers.set(header, unique.iterator().next());
            return;
        }
        headers.put(header, new ArrayList<>(unique));
    }
}

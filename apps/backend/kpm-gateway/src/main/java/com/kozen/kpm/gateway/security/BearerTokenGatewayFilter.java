package com.kozen.kpm.gateway.security;

import com.kozen.kpm.common.auth.AuthTokenUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

/**
 * Gateway-level bearer token and RBAC verification.
 *
 * <p>The frontend may hide unavailable controls for UX, but this filter keeps the real security
 * decision at the backend boundary. All browser API calls should pass through the gateway.</p>
 */
@Component
public class BearerTokenGatewayFilter implements GlobalFilter, Ordered {
    private static final Logger log = LoggerFactory.getLogger(BearerTokenGatewayFilter.class);

    private final boolean enabled;
    private final boolean rbacEnabled;
    private static final String REFRESH_TOKEN_HEADER = "X-KPM-Refresh-Token";

    private final String tokenSecret;
    private final long tokenTtlSeconds;
    private final String iamUri;
    private final WebClient webClient;

    public BearerTokenGatewayFilter(
            @Value("${kpm.auth.enabled:true}") boolean enabled,
            @Value("${kpm.auth.rbac-enabled:true}") boolean rbacEnabled,
            @Value("${kpm.auth.token-secret:" + AuthTokenUtil.DEFAULT_SECRET + "}") String tokenSecret,
            @Value("${kpm.auth.token-ttl-seconds:7200}") long tokenTtlSeconds,
            @Value("${kpm.iam.uri:${KPM_IAM_URI:http://localhost:8101}}") String iamUri
    ) {
        this.enabled = enabled;
        this.rbacEnabled = rbacEnabled;
        this.tokenSecret = tokenSecret;
        this.tokenTtlSeconds = tokenTtlSeconds;
        this.iamUri = trimTrailingSlash(iamUri);
        this.webClient = WebClient.builder().build();
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();
        if (!enabled || isPublicPath(path)) {
            return chain.filter(exchange);
        }

        String authorization = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return unauthorized(exchange, "Missing Authorization bearer token");
        }

        Map<String, Object> claims;
        try {
            claims = AuthTokenUtil.verify(authorization.substring("Bearer ".length()).trim(), tokenSecret);
        } catch (IllegalArgumentException e) {
            return unauthorized(exchange, e.getMessage());
        }

        String account = String.valueOf(claims.get("account"));
        String displayName = String.valueOf(claims.get("name"));
        exchange.getResponse().getHeaders().set(REFRESH_TOKEN_HEADER, AuthTokenUtil.issue(account, displayName, tokenTtlSeconds, tokenSecret));
        ServerWebExchange forwarded = exchange.mutate()
                .request(builder -> builder
                        .header("X-KPM-Account", account)
                        .header("X-KPM-User", displayName)
                        .header("X-KPM-User-Name-Base64", Base64.getUrlEncoder()
                                .withoutPadding()
                                .encodeToString(displayName.getBytes(StandardCharsets.UTF_8))))
                .build();

        String requiredPermission = requiredPermission(path, exchange.getRequest().getMethod());
        if (!rbacEnabled || requiredPermission == null) {
            return chain.filter(forwarded);
        }

        return permissionCodes(account)
                .flatMap(permissions -> hasPermission(permissions, requiredPermission)
                        ? chain.filter(forwarded)
                        : rejectMissingPermission(exchange, account, requiredPermission, permissions))
                .onErrorResume(error -> forbidden(exchange, "权限服务不可用，请稍后重试"));
    }

    @Override
    public int getOrder() {
        return -100;
    }

    private boolean isPublicPath(String path) {
        return path == null
                || !path.startsWith("/api/")
                || path.equals("/api/iam/login")
                || path.startsWith("/api/customer-portal/")
                || path.startsWith("/actuator/")
                || path.startsWith("/v3/api-docs")
                || path.startsWith("/swagger-ui");
    }

    private Mono<Set<String>> permissionCodes(String account) {
        return webClient.get()
                .uri(UriComponentsBuilder
                        .fromUriString(iamUri)
                        .path("/api/iam/me")
                        .queryParam("account", account)
                        .build()
                        .toUri())
                .retrieve()
                .bodyToMono(Map.class)
                .map(this::extractPermissions);
    }

    @SuppressWarnings("unchecked")
    private Set<String> extractPermissions(Map<?, ?> response) {
        Object data = response.get("data");
        if (!(data instanceof Map<?, ?> user)) {
            return Set.of();
        }
        Object rawPermissions = user.get("permissions");
        if (!(rawPermissions instanceof Collection<?> collection)) {
            return Set.of();
        }
        Set<String> permissions = new LinkedHashSet<>();
        for (Object permission : collection) {
            if (permission == null) continue;
            String code = String.valueOf(permission).trim();
            if (!code.isBlank()) {
                permissions.add(code);
            }
        }
        return permissions;
    }

    private boolean hasPermission(Set<String> permissions, String requiredPermission) {
        return permissions.contains("*") || permissions.contains(requiredPermission);
    }

    private Mono<Void> rejectMissingPermission(
            ServerWebExchange exchange,
            String account,
            String requiredPermission,
            Set<String> permissions
    ) {
        log.warn(
                "Permission denied. account={}, requiredPermission={}, permissionCount={}",
                account,
                requiredPermission,
                permissions.size()
        );
        return forbidden(exchange, "当前账号没有操作权限：" + requiredPermission);
    }

    private String requiredPermission(String path, HttpMethod method) {
        String verb = method == null ? "" : method.name();
        if ("GET".equals(verb)) return null;
        if (path.equals("/api/iam/change-password")) return null;
        if (path.equals("/api/files/upload")) return null;

        if (path.startsWith("/api/tasks")) {
            if ("POST".equals(verb) && path.matches("/api/tasks/[^/]+/comments")) return "button:task-detail:publish-comment";
            if ("POST".equals(verb) && path.matches("/api/tasks/[^/]+/attachments")) return "button:task-detail:save";
            if ("POST".equals(verb) && path.equals("/api/tasks")) return "button:tasks:save";
            if ("PUT".equals(verb)) return "button:task-detail:save";
            if ("DELETE".equals(verb)) return "button:tasks:save";
        }

        if (path.startsWith("/api/orders")) {
            if ("POST".equals(verb)) return "button:orders:create";
            if ("PUT".equals(verb)) return "button:orders:edit";
            if ("DELETE".equals(verb)) return "button:orders:delete";
        }

        if (path.startsWith("/api/customers")) {
            if ("POST".equals(verb) && path.matches("/api/customers/[^/]+/contacts")) return "button:customer-detail:add-contact";
            if ("POST".equals(verb) && path.matches("/api/customers/[^/]+/materials")) return "button:customer-detail:upload-material";
            if ("POST".equals(verb) && path.matches("/api/customers/[^/]+/followups")) return "button:customer-detail:add-followup";
            if ("POST".equals(verb)) return "button:customers:create";
            if ("PUT".equals(verb)) return "button:customers:edit";
            if ("DELETE".equals(verb)) return "button:customers:delete";
        }

        if (path.startsWith("/api/projects")) {
            if (path.equals("/api/projects/templates")) return "POST".equals(verb) ? "button:templates:create" : null;
            if (path.matches("/api/projects/templates/[^/]+")) return "DELETE".equals(verb) ? "button:templates:delete" : "button:templates:edit";
            if (path.matches("/api/projects/[^/]+/members")) return "button:project-detail:edit-members";
            if (path.matches("/api/projects/[^/]+/skus") && "POST".equals(verb)) return "button:project-skus:save";
            if (path.matches("/api/projects/[^/]+/skus/[^/]+") && "PUT".equals(verb)) return "button:project-skus:save";
            if (path.matches("/api/projects/[^/]+/skus/[^/]+") && "DELETE".equals(verb)) return "button:project-skus:delete";
            if (path.matches("/api/projects/[^/]+/archive")) return "button:projects:archive";
            if (path.matches("/api/projects/stages/[^/]+/records")) return "button:stage-detail:publish-record";
            if (path.matches("/api/projects/stages/[^/]+/materials")) return "button:stage-detail:publish-file";
            if (path.matches("/api/projects/[^/]+/materials") && "POST".equals(verb)) return "button:project-materials:upload";
            if (path.matches("/api/projects/[^/]+/materials/[^/]+/public")) return "button:project-materials:publish-customer";
            if (path.matches("/api/projects/[^/]+/announcements")) return "button:project-detail:publish-announcement";
            if (path.matches("/api/projects/stage-materials/[^/]+/publish")) return "button:stage-detail:publish-file";
            if (path.matches("/api/projects/[^/]+/customers/[^/]+/requirements")) return "button:requirements:save";
            if (path.matches("/api/projects/requirements/[^/]+/void")) return "button:requirements:void";
            if (path.matches("/api/projects/requirements/[^/]+")) return "button:requirements:delete";
            if (path.matches("/api/projects/[^/]+/customers.*")) return "button:project-customers:save-link";
            if ("POST".equals(verb) && path.equals("/api/projects")) return "button:projects:create";
            if ("PUT".equals(verb)) return "button:project-edit:save";
            if ("DELETE".equals(verb)) return "button:projects:delete";
        }

        if (path.startsWith("/api/resources")) {
            if (path.matches("/api/resources/users/[^/]+/reset-password")) return "button:users:reset-password";
            return "button:resources:edit";
        }

        return null;
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange, String message) {
        return json(exchange, HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", message);
    }

    private Mono<Void> forbidden(ServerWebExchange exchange, String message) {
        return json(exchange, HttpStatus.FORBIDDEN, "FORBIDDEN", message);
    }

    private Mono<Void> json(ServerWebExchange exchange, HttpStatus status, String code, String message) {
        exchange.getResponse().setStatusCode(status);
        exchange.getResponse().getHeaders().add(HttpHeaders.CONTENT_TYPE, "application/json;charset=UTF-8");
        String body = "{\"success\":false,\"code\":\"" + code + "\",\"message\":\""
                + escapeJson(message)
                + "\",\"data\":null}";
        return exchange.getResponse().writeWith(Mono.just(exchange.getResponse()
                .bufferFactory()
                .wrap(body.getBytes(StandardCharsets.UTF_8))));
    }

    private String escapeJson(String value) {
        return value == null ? "" : value.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private String trimTrailingSlash(String value) {
        if (value == null || value.isBlank()) return "http://localhost:8101";
        return value.endsWith("/") ? value.substring(0, value.length() - 1) : value;
    }
}

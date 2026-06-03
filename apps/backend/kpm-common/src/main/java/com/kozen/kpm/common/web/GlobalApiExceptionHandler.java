package com.kozen.kpm.common.web;

import com.kozen.kpm.common.api.ApiResponse;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Comparator;
import java.util.stream.Collectors;

/** Converts validation failures into the same API envelope used by normal endpoints. */
@RestControllerAdvice(basePackages = "com.kozen.kpm")
public class GlobalApiExceptionHandler {
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> illegalArgument(IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error("VALIDATION_ERROR", e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> methodArgumentNotValid(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .sorted(Comparator.comparing(FieldError::getField))
                .map(error -> error.getField() + "：" + (error.getDefaultMessage() == null ? "格式不正确" : error.getDefaultMessage()))
                .distinct()
                .collect(Collectors.joining("；"));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error("VALIDATION_ERROR", message.isBlank() ? "请求参数校验失败" : message));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Object>> constraintViolation(ConstraintViolationException e) {
        String message = e.getConstraintViolations().stream()
                .sorted(Comparator.comparing(v -> v.getPropertyPath().toString()))
                .map(this::formatViolation)
                .distinct()
                .collect(Collectors.joining("；"));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error("VALIDATION_ERROR", message.isBlank() ? "请求参数校验失败" : message));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiResponse<Object>> illegalState(IllegalStateException e) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(ApiResponse.error("SERVICE_NOT_READY", e.getMessage()));
    }

    private String formatViolation(ConstraintViolation<?> violation) {
        String path = violation.getPropertyPath() == null ? "参数" : violation.getPropertyPath().toString();
        String field = path.contains(".") ? path.substring(path.lastIndexOf('.') + 1) : path;
        return field + "：" + violation.getMessage();
    }
}

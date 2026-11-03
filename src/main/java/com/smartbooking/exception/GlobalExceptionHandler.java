package com.smartbooking.exception;

import com.smartbooking.dto.ErrorResponseDto;
import jakarta.servlet.http.HttpServletRequest;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleNotFound(ResourceNotFoundException ex, HttpServletRequest request) {
        return error(HttpStatus.NOT_FOUND, ex.getMessage(), request, null);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponseDto> handleDuplicate(DuplicateResourceException ex, HttpServletRequest request) {
        return error(HttpStatus.CONFLICT, ex.getMessage(), request, null);
    }

    @ExceptionHandler(FraudRiskException.class)
    public ResponseEntity<ErrorResponseDto> handleFraudRisk(FraudRiskException ex, HttpServletRequest request) {
        return error(HttpStatus.TOO_MANY_REQUESTS, ex.getMessage(), request, null);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponseDto> handleAccessDenied(AccessDeniedException ex, HttpServletRequest request) {
        return error(HttpStatus.FORBIDDEN, "You do not have permission to access this resource.", request, null);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDto> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map<String, String> fields = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> fields.put(error.getField(), error.getDefaultMessage()));
        String firstError = fields.values().stream().findFirst().orElse("Validation failed.");
        return error(HttpStatus.BAD_REQUEST, firstError, request, fields);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponseDto> handleIllegalArgument(IllegalArgumentException ex, HttpServletRequest request) {
        return error(HttpStatus.BAD_REQUEST, ex.getMessage(), request, null);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDto> handleUnexpected(Exception ex, HttpServletRequest request) {
        return error(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected server error: " + ex.getMessage(), request, null);
    }

    private ResponseEntity<ErrorResponseDto> error(HttpStatus status, String message, HttpServletRequest request, Map<String, String> fieldErrors) {
        HttpStatus safeStatus = Objects.requireNonNull(status, "status is required");
        return ResponseEntity.status(safeStatus).body(new ErrorResponseDto(safeStatus.value(), safeStatus.getReasonPhrase(), message, request.getRequestURI(), fieldErrors));
    }
}

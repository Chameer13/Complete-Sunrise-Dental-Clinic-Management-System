package com.sunrise.dental.exception;
import com.sunrise.dental.dto.ApiError; import jakarta.servlet.http.HttpServletRequest; import org.springframework.http.*; import org.springframework.web.bind.MethodArgumentNotValidException; import org.springframework.web.bind.annotation.*; import java.time.Instant; import java.util.*;
@RestControllerAdvice public class GlobalExceptionHandler {
 @ExceptionHandler(MethodArgumentNotValidException.class) ResponseEntity<ApiError> v(MethodArgumentNotValidException e,HttpServletRequest r){Map<String,String> m=new LinkedHashMap<>();e.getBindingResult().getFieldErrors().forEach(x->m.put(x.getField(),x.getDefaultMessage()));return ResponseEntity.badRequest().body(new ApiError(Instant.now(),400,"Validation Error","Please correct the highlighted fields.",m,r.getRequestURI()));}
 @ExceptionHandler(IllegalArgumentException.class) ResponseEntity<ApiError> b(IllegalArgumentException e,HttpServletRequest r){return ResponseEntity.badRequest().body(new ApiError(Instant.now(),400,"Bad Request",e.getMessage(),Map.of(),r.getRequestURI()));}
 @ExceptionHandler(Exception.class) ResponseEntity<ApiError> x(Exception e,HttpServletRequest r){e.printStackTrace();return ResponseEntity.status(500).body(new ApiError(Instant.now(),500,"Internal Server Error","An unexpected server error occurred.",Map.of(),r.getRequestURI()));}
}

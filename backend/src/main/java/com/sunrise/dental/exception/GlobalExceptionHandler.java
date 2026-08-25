package com.sunrise.dental.exception;
import com.sunrise.dental.dto.ApiError; import jakarta.servlet.http.HttpServletRequest; import org.springframework.http.*; import org.springframework.web.bind.MethodArgumentNotValidException; import org.springframework.web.bind.annotation.*; import java.time.Instant; import java.util.LinkedHashMap;
@RestControllerAdvice public class GlobalExceptionHandler {
 @ExceptionHandler(MethodArgumentNotValidException.class) ResponseEntity<ApiError> validation(MethodArgumentNotValidException e,HttpServletRequest req){var m=new LinkedHashMap<String,String>(); e.getBindingResult().getFieldErrors().forEach(x->m.putIfAbsent(x.getField(),x.getDefaultMessage())); return build(HttpStatus.BAD_REQUEST,"Validation failed",m,req.getRequestURI());}
 @ExceptionHandler(IllegalArgumentException.class) ResponseEntity<ApiError> bad(IllegalArgumentException e,HttpServletRequest req){return build(HttpStatus.BAD_REQUEST,e.getMessage(),null,req.getRequestURI());}
 @ExceptionHandler(Exception.class) ResponseEntity<ApiError> other(Exception e,HttpServletRequest req){return build(HttpStatus.INTERNAL_SERVER_ERROR,"An unexpected server error occurred",null,req.getRequestURI());}
 private ResponseEntity<ApiError> build(HttpStatus s,String msg,java.util.Map<String,String> v,String path){return ResponseEntity.status(s).body(new ApiError(Instant.now(),s.value(),s.getReasonPhrase(),msg,v,path));}
}

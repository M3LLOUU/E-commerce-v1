package com.loja.controller;

import com.loja.dto.LoginRequestDTO;
import com.loja.dto.RegisterRequestDTO;
import com.loja.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDTO request) {
        try {
            Map<String, Object> response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO request) {
        try {
            Map<String, Object> response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/favorites/{userId}/{productId}")
    public ResponseEntity<Set<Long>> toggleFavorite(
            @PathVariable Long userId, 
            @PathVariable Long productId) {
        Set<Long> favorites = authService.toggleFavorite(userId, productId);
        return ResponseEntity.ok(favorites);
    }
}
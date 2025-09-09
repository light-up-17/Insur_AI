package com.insurai.insurai.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.insurai.insurai.model.User;
import com.insurai.insurai.model.UserCategory;
import com.insurai.insurai.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        return ResponseEntity.ok(authService.registerUser(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        String categoryStr = credentials.get("category");

        if (email == null || password == null || categoryStr == null) {
            return ResponseEntity.badRequest().body("Email, password, and category are required");
        }

        try {
            UserCategory category = UserCategory.valueOf(categoryStr.toUpperCase());

            return authService.loginUser(email, password, category)
                    .<ResponseEntity<?>>map(ResponseEntity::ok)
                    .orElse(ResponseEntity.status(401).body("Invalid credentials"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid category");
        }
    }
}

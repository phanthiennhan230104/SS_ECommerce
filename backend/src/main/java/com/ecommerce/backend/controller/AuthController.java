package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.request.auth.LoginRequest;
import com.ecommerce.backend.dto.request.auth.RegisterRequest;
import com.ecommerce.backend.dto.response.auth.LoginResponse;
import com.ecommerce.backend.service.auth.AuthService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    // ==============================
    // LOGIN
    // ==============================
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    // ==============================
    // STEP 1: SEND OTP (KHÔNG TẠO USER)
    // ==============================
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody RegisterRequest req) {
        authService.sendOtp(req);
        return ResponseEntity.ok("OTP sent to email");
    }

    // ==============================
    // STEP 2: VERIFY OTP + TẠO USER
    // ==============================
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody RegisterRequest req) {
        authService.verifyOtp(req);
        return ResponseEntity.ok("Registration successful!");
    }
}

package com.ecommerce.backend.service.auth;

import com.ecommerce.backend.dto.request.auth.LoginRequest;
import com.ecommerce.backend.dto.request.auth.RegisterRequest;
import com.ecommerce.backend.dto.response.auth.LoginResponse;
import com.ecommerce.backend.model.User;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.util.JwtUtil;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final OtpService otpService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // ============================================
    // LOGIN
    // ============================================
    public LoginResponse login(LoginRequest req) {

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return new LoginResponse(token, user.getEmail(), user.getFullName());
    }

    // ============================================
    // STEP 1 — SEND OTP
    // ============================================
    public void sendOtp(RegisterRequest req) {

        // Không tạo user, không check email ở đây

        if (req.getFullName() == null || req.getFullName().isBlank()) {
            throw new RuntimeException("Full name is required");
        }

        if (req.getPassword() == null || req.getPassword().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }

        String otp = otpService.generateOtp(req.getEmail());
        emailService.sendOtp(req.getEmail(), otp);
    }

    // ============================================
    // STEP 2 — VERIFY OTP + CREATE USER
    // ============================================
    public void verifyOtp(RegisterRequest req) {

        boolean isValid = otpService.verifyOtp(req.getEmail(), req.getOtp());
        if (!isValid) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        // Check trùng email sau khi OTP hợp lệ
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName())
                .emailVerified(true)
                .role(User.Role.CUSTOMER)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        userRepository.save(user);
    }
}

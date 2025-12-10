package com.ecommerce.backend.service.auth;

import com.ecommerce.backend.dto.request.auth.LoginRequest;
import com.ecommerce.backend.dto.request.auth.RegisterRequest;
import com.ecommerce.backend.dto.response.auth.LoginResponse;
import com.ecommerce.backend.exception.CustomException;
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

    // ========================================================
    // LOGIN
    // ========================================================
    public LoginResponse login(LoginRequest req) {

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new CustomException("User not found"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new CustomException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return new LoginResponse(
                token,
                user.getEmail(),
                user.getFullName(),
                user.getRole().name()
        );
    }


    // ========================================================
    // STEP 1 — SEND OTP (CHECK EMAIL DUPLICATE HERE)
    // ========================================================
    public void sendOtp(RegisterRequest req) {

        // Check trùng email – nếu trùng thì không gửi OTP
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new CustomException("Email already exists");
        }

        // Validate đơn giản
        if (req.getFullName() == null || req.getFullName().isBlank()) {
            throw new CustomException("Full name is required");
        }

        if (req.getPassword() == null || req.getPassword().length() < 6) {
            throw new CustomException("Password must be at least 6 characters");
        }

        // Tạo và gửi OTP
        String otp = otpService.generateOtp(req.getEmail());
        emailService.sendOtp(req.getEmail(), otp);
    }


    // ========================================================
    // STEP 2 — VERIFY OTP + CREATE USER
    // ========================================================
    public void verifyOtp(RegisterRequest req) {

        // Verify OTP
        boolean valid = otpService.verifyOtp(req.getEmail(), req.getOtp());
        if (!valid) {
            throw new CustomException("Invalid or expired OTP");
        }

        // Không check email trùng lại
        User newUser = User.builder()
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName())
                .emailVerified(true)
                .role(User.Role.CUSTOMER)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        userRepository.save(newUser);
    }
}

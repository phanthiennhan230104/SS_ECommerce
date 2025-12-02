package com.ecommerce.backend.service.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final RedisTemplate<String, String> redisTemplate;

    public String generateOtp(String email) {
        String otp = String.valueOf((int) (Math.random() * 900000 + 100000));

        redisTemplate.opsForValue().set("otp:" + email, otp, 5, TimeUnit.MINUTES);

        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        String key = "otp:" + email;
        String storedOtp = redisTemplate.opsForValue().get(key);

        if (storedOtp != null && storedOtp.equals(otp)) {
            redisTemplate.delete(key);
            return true;
        }

        return false;
    }
}

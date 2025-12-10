package com.ecommerce.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.backend.dto.request.cart.AddToCartRequest;
import com.ecommerce.backend.dto.request.cart.UpdateCartRequest;
import com.ecommerce.backend.model.Cart;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.service.cart.CartService;
import com.ecommerce.backend.util.JwtUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    private Long getUserIdFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
        }

        try {
            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token);

            return userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"))
                    .getId();
        } catch (Exception e) {
            throw new RuntimeException("Token không hợp lệ. Vui lòng đăng nhập lại");
        }
    }

    @GetMapping("/cart")
    public ResponseEntity<Cart> getCart(
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        Long userId = getUserIdFromToken(authHeader);
        return ResponseEntity.ok(cartService.getCart(userId));
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody AddToCartRequest req
    ) {
        Long userId = getUserIdFromToken(authHeader);
        return ResponseEntity.ok(cartService.addToCart(userId, req.getProductId(), req.getQuantity()));
    }

    @PutMapping("/update")
    public ResponseEntity<Cart> updateItem(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody UpdateCartRequest req
    ) {
        Long userId = getUserIdFromToken(authHeader);
        return ResponseEntity.ok(cartService.updateItem(userId, req.getProductId(), req.getQuantity()));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Cart> removeItem(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable Long productId
    ) {
        Long userId = getUserIdFromToken(authHeader);
        return ResponseEntity.ok(cartService.removeItem(userId, productId));
    }
}

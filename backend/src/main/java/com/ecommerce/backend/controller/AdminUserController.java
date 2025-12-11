package com.ecommerce.backend.controller;

import com.ecommerce.backend.model.User;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.OrderItemRepository;
import lombok.*;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.EntityManager;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final EntityManager entityManager;

    // DTO
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDTO {
        private Long id;
        private String name;
        private String email;
        private String role;
        private String status;
    }

    @Data
    @NoArgsConstructor
    public static class CreateUserRequest {
        private String name;
        private String email;
        private String role;
    }

    @Data
    @NoArgsConstructor
    public static class UpdateUserRequest {
        private String name;
        private String role;
    }

    // Lấy tất cả users
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserDTO> userDTOs = users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(userDTOs);
    }

    // Lấy user theo ID
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(convertToDTO(user));
    }

    // Tạo user mới
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody CreateUserRequest request) {
        User user = User.builder()
                .email(request.getEmail())
                .fullName(request.getName())
                .role(User.Role.valueOf(request.getRole()))
                .emailVerified(true)
                .build();
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(convertToDTO(savedUser));
    }

    // Cập nhật user
    @PatchMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (request.getName() != null) {
            user.setFullName(request.getName());
        }
        if (request.getRole() != null) {
            user.setRole(User.Role.valueOf(request.getRole()));
        }
        
        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(convertToDTO(updatedUser));
    }

    // Xóa user
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
            
            // 1. Xóa order_items của các sản phẩm của user (seller_id)
            entityManager.createNativeQuery(
                "DELETE oi FROM order_items oi " +
                "INNER JOIN products p ON oi.product_id = p.id " +
                "WHERE p.seller_id = ?1"
            ).setParameter(1, id).executeUpdate();
            
            // 2. Xóa order_items của các orders của user
            entityManager.createNativeQuery(
                "DELETE oi FROM order_items oi " +
                "INNER JOIN orders o ON oi.order_id = o.id " +
                "WHERE o.user_id = ?1"
            ).setParameter(1, id).executeUpdate();
            
            // 3. Xóa orders của user
            entityManager.createNativeQuery(
                "DELETE FROM orders WHERE user_id = ?1"
            ).setParameter(1, id).executeUpdate();
            
            // 4. Xóa products của user (seller)
            entityManager.createNativeQuery(
                "DELETE FROM products WHERE seller_id = ?1"
            ).setParameter(1, id).executeUpdate();
            
            // 5. Xóa user
            userRepository.deleteById(id);
            
            return ResponseEntity.ok(java.util.Map.of("message", "User deleted successfully", "id", id));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }

    private UserDTO convertToDTO(User user) {
        String roleDisplay = user.getRole() != null ? user.getRole().name() : "CUSTOMER";
        return UserDTO.builder()
                .id(user.getId())
                .name(user.getFullName())
                .email(user.getEmail())
                .role(roleDisplay)
                .status(user.isEmailVerified() ? "Active" : "Blocked")
                .build();
    }
}

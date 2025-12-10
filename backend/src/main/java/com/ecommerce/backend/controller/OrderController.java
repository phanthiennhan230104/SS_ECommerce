package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.request.order.UpdateOrderStatusRequest;
import com.ecommerce.backend.dto.response.order.OrderResponse;
import com.ecommerce.backend.model.User;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.service.order.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final UserRepository userRepository;
    private final OrderService orderService;

    // =======================
    // GET MY ORDERS
    // =======================
    @GetMapping
    public List<OrderResponse> getMyOrders(Principal principal) {

        if (principal == null) {
            throw new RuntimeException("Missing Token");
        }

        String email = principal.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return orderService.getOrdersByUserId(user.getId());
    }

    // =======================
    // UPDATE STATUS
    // =======================
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateOrderStatusRequest req,
            Principal principal) {

        if (principal == null) {
            throw new RuntimeException("Missing Token");
        }

        String email = principal.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        orderService.updateStatus(id, user.getId(), req.getStatus());

        return ResponseEntity.ok("Updated");
    }
    @PatchMapping("/{id}/confirm-shipped")
    public ResponseEntity<String> confirmShipped(
            @PathVariable Long id,
            Principal principal
    ) {
        if (principal == null) {
            throw new RuntimeException("Missing Token");
        }

        String email = principal.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // PAID -> SHIPPED
        orderService.confirmShippedByUser(id, user.getId());

        return ResponseEntity.ok("Order marked as SHIPPED");
    }

    @PatchMapping("/{id}/confirm-received")
    public ResponseEntity<String> confirmReceived(
            @PathVariable Long id,
            Principal principal
    ) {
        if (principal == null) {
            throw new RuntimeException("Missing Token");
        }

        String email = principal.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // SHIPPED -> COMPLETED
        orderService.confirmDeliveredByUser(id, user.getId());

        return ResponseEntity.ok("Order marked as COMPLETED");
    }

}

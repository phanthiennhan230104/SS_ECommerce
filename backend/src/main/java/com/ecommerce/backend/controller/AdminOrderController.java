package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.response.order.OrderResponse;
import com.ecommerce.backend.service.order.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderService orderService;

    // Admin xem tất cả đơn
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<OrderResponse> orders = orderService.getAllOrdersForAdmin();
        return ResponseEntity.ok(orders);
    }

    // Admin xác nhận đơn: PENDING -> SHIPPED
    @PatchMapping("/{id}/confirm")
    public ResponseEntity<String> confirmOrder(@PathVariable Long id) {
        orderService.confirmOrderAsAdmin(id);
        return ResponseEntity.ok("Order confirmed (SHIPPED)");
    }

    // Admin hủy đơn
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<String> cancelOrder(@PathVariable Long id) {
        orderService.cancelOrder(id);
        return ResponseEntity.ok("Order cancelled");
    }
}

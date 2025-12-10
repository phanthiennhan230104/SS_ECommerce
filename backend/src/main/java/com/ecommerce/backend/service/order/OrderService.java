package com.ecommerce.backend.service.order;

import com.ecommerce.backend.dto.response.order.OrderResponse;
import com.ecommerce.backend.mapper.OrderMapper;
import com.ecommerce.backend.model.Order;
import com.ecommerce.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;

    public List<OrderResponse> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId)
                .stream()
                .map(orderMapper::toResponse)
                .toList();
    }

    public void updateStatus(Long id, Long userId, String newStatus) {
        Order order = orderRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        try {
            Order.Status status = Order.Status.valueOf(newStatus.toUpperCase());
            order.setStatus(status);
            order.setUpdatedAt(LocalDateTime.now());

            if (status == Order.Status.PAID) {
                order.setConfirmedAt(LocalDateTime.now());
            }

            orderRepository.save(order);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + newStatus);
        }
    }
    
    // Admin xem tất cả đơn, mới nhất trước
    public List<OrderResponse> getAllOrdersForAdmin() {
    List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc();
    return orders.stream()
            .map(orderMapper::toResponse)  // dùng lại mapper giống bên user
            .toList();
}


public void confirmOrderAsAdmin(Long orderId) {
    Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));

    // Chỉ cho phép xác nhận đơn đang chờ
    if (order.getStatus() != Order.Status.PENDING) {
        throw new RuntimeException("Chỉ có thể xác nhận đơn đang chờ (PENDING)");
    }

    order.setStatus(Order.Status.SHIPPED);   // Chuyển trực tiếp sang SHIPPED
    order.setConfirmedAt(LocalDateTime.now());
    order.setUpdatedAt(LocalDateTime.now());

    orderRepository.save(order);
}

// User xác nhận vận chuyển: PAID -> SHIPPED
public void confirmShippedByUser(Long orderId, Long userId) {
    Order order = orderRepository.findByIdAndUserId(orderId, userId)
            .orElseThrow(() -> new RuntimeException("Order not found"));

    if (order.getStatus() != Order.Status.PAID) {
        throw new RuntimeException("Chỉ xác nhận được đơn đã thanh toán (PAID)");
    }

    order.setStatus(Order.Status.SHIPPED);
    order.setUpdatedAt(LocalDateTime.now());

    orderRepository.save(order);
}

/**
 * User xác nhận đã nhận hàng: SHIPPED -> COMPLETED
 */
public void confirmDeliveredByUser(Long orderId, Long userId) {
    Order order = orderRepository.findByIdAndUserId(orderId, userId)
            .orElseThrow(() -> new RuntimeException("Order not found"));

    if (order.getStatus() != Order.Status.SHIPPED) {
        throw new RuntimeException("Chỉ xác nhận được đơn đang vận chuyển (SHIPPED)");
    }

    order.setStatus(Order.Status.COMPLETED);     // Hoàn thành
    order.setUpdatedAt(LocalDateTime.now());

    orderRepository.save(order);
}

// Admin hủy đơn: Any status -> CANCELLED
public void cancelOrder(Long orderId) {
    Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));

    if (order.getStatus() == Order.Status.CANCELLED) {
        throw new RuntimeException("Đơn hàng đã bị hủy rồi");
    }

    order.setStatus(Order.Status.CANCELLED);
    order.setUpdatedAt(LocalDateTime.now());

    orderRepository.save(order);
}

}

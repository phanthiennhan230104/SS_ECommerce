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

        order.setStatus(Order.Status.valueOf(newStatus.toUpperCase()));
        order.setUpdatedAt(LocalDateTime.now());

        orderRepository.save(order);
    }
}

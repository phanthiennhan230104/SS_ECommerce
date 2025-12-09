package com.ecommerce.backend.mapper;

import com.ecommerce.backend.dto.response.order.OrderItemResponse;
import com.ecommerce.backend.dto.response.order.OrderResponse;
import com.ecommerce.backend.model.Order;
import com.ecommerce.backend.model.OrderItem;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Component
public class OrderMapper {

    // Map Order -> OrderResponse
    public OrderResponse toResponse(Order order) {
        OrderResponse dto = new OrderResponse();

        dto.setId(order.getId());
        dto.setOrderCode(generateOrderCode(order.getId(), order.getCreatedAt()));

        dto.setCustomerName(order.getUser().getFullName());
        dto.setCustomerEmail(order.getUser().getEmail());
        dto.setCustomerAddress(order.getShippingAddress());

        dto.setStatus(mapStatus(order.getStatus()));
        dto.setTotalAmount(order.getTotalAmount().doubleValue());
        dto.setCreatedAt(order.getCreatedAt());

        dto.setItems(order.getItems().stream()
                .map(this::toItemResponse)
                .collect(Collectors.toList()));

        return dto;
    }

    // Map OrderItem -> OrderItemResponse
    private OrderItemResponse toItemResponse(OrderItem item) {
        OrderItemResponse dto = new OrderItemResponse();
        dto.setId(item.getId());
        dto.setProductName(item.getProduct().getName());
        dto.setQuantity(item.getQuantity());
        dto.setUnitPrice(item.getUnitPrice().doubleValue());
        dto.setLineTotal(item.getLineTotal().doubleValue());
        return dto;
    }

    // Convert backend Enum -> frontend string
    private String mapStatus(Order.Status status) {
        return switch (status) {
            case PENDING -> "pending";
            case PAID -> "confirmed";
            case SHIPPED -> "shipping";
            case COMPLETED -> "delivered";
            case CANCELLED -> "cancelled";
        };
    }

    // Create orderCode (ORD-2025-003)
    private String generateOrderCode(Long id, LocalDateTime createdAt) {
        int year = createdAt.getYear();
        return String.format("ORD-%d-%03d", year, id);
    }
}

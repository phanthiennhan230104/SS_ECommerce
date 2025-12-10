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
        dto.setOrderCode(order.getOrderCode());

        dto.setCustomerName(order.getCustomerName() != null ? order.getCustomerName() : order.getUser().getFullName());
        dto.setCustomerEmail(order.getCustomerEmail() != null ? order.getCustomerEmail() : order.getUser().getEmail());
        dto.setCustomerPhone(order.getCustomerPhone());
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
        // Calculate lineTotal from quantity * unitPrice
        double lineTotal = item.getUnitPrice().doubleValue() * item.getQuantity();
        dto.setLineTotal(lineTotal);
        return dto;
    }

    // Convert backend Enum -> frontend string
    private String mapStatus(Order.Status status) {
        return switch (status) {
            case PENDING -> "pending";
            case PAID -> "paid";
            case SHIPPED -> "shipped";
            case COMPLETED -> "completed";
            case CANCELLED -> "cancelled";
        };
    }
}


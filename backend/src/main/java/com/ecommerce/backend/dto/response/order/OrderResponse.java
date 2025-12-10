package com.ecommerce.backend.dto.response.order;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
    private Long id;
    private String orderCode;

    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String customerAddress;

    private String status;
    private Double totalAmount;
    private LocalDateTime createdAt;

    private List<OrderItemResponse> items;
}

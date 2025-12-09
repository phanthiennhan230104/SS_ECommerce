package com.ecommerce.backend.dto.response.order;

import lombok.Data;

@Data
public class OrderItemResponse {
    private Long id;
    private String productName;
    private Integer quantity;
    private Double unitPrice;
    private Double lineTotal;
}

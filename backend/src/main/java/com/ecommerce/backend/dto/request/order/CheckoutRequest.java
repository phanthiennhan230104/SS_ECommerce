package com.ecommerce.backend.dto.request.order;

import java.math.BigDecimal;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CheckoutRequest {
    private List<OrderItemDTO> items;
    private BigDecimal totalAmount;
    private String customerName;
    private String customerEmail;
    private String customerAddress;
    private String customerPhone;

    @Getter
    @Setter
    public static class OrderItemDTO {
        private Long productId;
        private Integer quantity;
        private BigDecimal unitPrice;
    }
}

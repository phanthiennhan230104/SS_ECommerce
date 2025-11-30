package com.ecommerce.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK → Order
    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    // FK → Product
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private Integer quantity;

    @Column(name = "unit_price")
    private BigDecimal unitPrice;

    // line_total là GENERATED ALWAYS, không cần set từ backend
    @Column(name = "line_total", insertable = false, updatable = false)
    private BigDecimal lineTotal;
}

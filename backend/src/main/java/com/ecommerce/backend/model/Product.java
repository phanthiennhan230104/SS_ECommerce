package com.ecommerce.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK → User (seller)
    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private BigDecimal price;

    private Integer stock;

    @Column(name = "image_url")
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "is_flash_sale")
    private boolean flashSale;

    @Column(name = "flash_price")
    private BigDecimal flashPrice;

    @Column(name = "flash_start")
    private LocalDateTime flashStart;

    @Column(name = "flash_end")
    private LocalDateTime flashEnd;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public enum Status {
        ACTIVE, INACTIVE, OUT_OF_STOCK
    }
}

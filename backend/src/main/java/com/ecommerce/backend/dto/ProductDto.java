package com.ecommerce.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductDto {

    private Long id;
    private Long sellerId;
    private String name;
    private String description;

    // Giá hiện tại trả về cho FE (có thể là flash price hoặc giá gốc)
    private BigDecimal price;

    // Giá gốc (luôn là price gốc trong DB)
    private BigDecimal originalPrice;

    // Thông tin flash sale
    private boolean flashSale;
    private BigDecimal flashPrice;
    private LocalDateTime flashStart;
    private LocalDateTime flashEnd;

    private Integer stock;
    private String imageUrl;
    private String status;

    // ====== GETTER & SETTER ======

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSellerId() { return sellerId; }
    public void setSellerId(Long sellerId) { this.sellerId = sellerId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }

    public boolean isFlashSale() { return flashSale; }
    public void setFlashSale(boolean flashSale) { this.flashSale = flashSale; }

    public BigDecimal getFlashPrice() { return flashPrice; }
    public void setFlashPrice(BigDecimal flashPrice) { this.flashPrice = flashPrice; }

    public LocalDateTime getFlashStart() { return flashStart; }
    public void setFlashStart(LocalDateTime flashStart) { this.flashStart = flashStart; }

    public LocalDateTime getFlashEnd() { return flashEnd; }
    public void setFlashEnd(LocalDateTime flashEnd) { this.flashEnd = flashEnd; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}

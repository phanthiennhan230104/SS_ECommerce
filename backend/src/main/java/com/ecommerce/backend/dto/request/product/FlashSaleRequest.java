package com.ecommerce.backend.dto.request.product;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class FlashSaleRequest {

    // Bật / tắt flash sale
    private boolean enabled;

    // Chọn 1 trong 2: flashPrice hoặc discountPercent
    private BigDecimal flashPrice;
    private Integer discountPercent;

    private LocalDateTime flashStart;
    private LocalDateTime flashEnd;

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    public BigDecimal getFlashPrice() { return flashPrice; }
    public void setFlashPrice(BigDecimal flashPrice) { this.flashPrice = flashPrice; }

    public Integer getDiscountPercent() { return discountPercent; }
    public void setDiscountPercent(Integer discountPercent) { this.discountPercent = discountPercent; }

    public LocalDateTime getFlashStart() { return flashStart; }
    public void setFlashStart(LocalDateTime flashStart) { this.flashStart = flashStart; }

    public LocalDateTime getFlashEnd() { return flashEnd; }
    public void setFlashEnd(LocalDateTime flashEnd) { this.flashEnd = flashEnd; }
}

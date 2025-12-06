package com.ecommerce.backend.service;

import com.ecommerce.backend.model.Product;
import com.ecommerce.backend.repository.ProductRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class FlashSaleScheduler {

    private final ProductRepository productRepository;

    public FlashSaleScheduler(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Chạy mỗi 1 phút, dọn các flash sale đã hết giờ
    @Scheduled(fixedDelay = 60_000)
    public void disableExpiredFlashSales() {
        LocalDateTime now = LocalDateTime.now();
        List<Product> expired = productRepository.findByFlashSaleTrueAndFlashEndBefore(now);
        if (expired.isEmpty()) {
            return;
        }

        for (Product p : expired) {
            p.setFlashSale(false);
            p.setFlashPrice(null);
            p.setFlashStart(null);
            p.setFlashEnd(null);
            p.setUpdatedAt(now);
        }

        productRepository.saveAll(expired);
    }
}

package com.ecommerce.backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.backend.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
     List<Product> findByFlashSaleTrueAndFlashEndBefore(LocalDateTime time);
     List<Product> findByCategory(String category);
}


package com.ecommerce.backend.repository;

import com.ecommerce.backend.model.Product;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
     List<Product> findByFlashSaleTrueAndFlashEndBefore(LocalDateTime time);
}


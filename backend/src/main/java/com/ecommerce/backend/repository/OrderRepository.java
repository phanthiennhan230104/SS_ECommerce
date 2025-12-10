package com.ecommerce.backend.repository;

import com.ecommerce.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);
    List<Order> findAllByOrderByCreatedAtDesc();
    Optional<Order> findByIdAndUserId(Long id, Long userId);
    void deleteByUserId(Long userId);
}

package com.ecommerce.backend.repository;

import java.math.BigDecimal;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ecommerce.backend.model.Cart;
import com.ecommerce.backend.model.CartItem;
import com.ecommerce.backend.model.Product;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);

    void deleteByCartIdAndProductId(Long cartId, Long productId);

    void deleteByCartId(Long cartId);

    @Query("SELECT SUM(i.lineTotal) FROM CartItem i WHERE i.cart.id = :cartId")
    BigDecimal sumLineTotal(Long cartId);
}

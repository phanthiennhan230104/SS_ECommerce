package com.ecommerce.backend.service.cart;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.backend.model.Cart;
import com.ecommerce.backend.model.CartItem;
import com.ecommerce.backend.model.Product;
import com.ecommerce.backend.model.User;
import com.ecommerce.backend.repository.CartItemRepository;
import com.ecommerce.backend.repository.CartRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    // Lấy giỏ hàng đang mở hoặc tạo mới
    private Cart getOrCreateCart(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cartRepository.findByUserIdAndStatus(userId, Cart.Status.PENDING)
                .orElseGet(() -> {
                    Cart cart = Cart.builder()
                            .user(user)
                            .totalAmount(BigDecimal.ZERO)
                            .status(Cart.Status.PENDING)
                            .createdAt(LocalDateTime.now())
                            .updatedAt(LocalDateTime.now())
                            .build();
                    return cartRepository.save(cart);
                });
    }

    // Add to cart
    public Cart addToCart(Long userId, Long productId, int quantity) {

        Cart cart = getOrCreateCart(userId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem item = cartItemRepository.findByCartAndProduct(cart, product)
                .orElse(null);

        if (item == null) {
            item = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(quantity)
                    .unitPrice(product.getPrice())
                    .build();
        } else {
            item.setQuantity(item.getQuantity() + quantity);
        }

        // lineTotal = unitPrice * quantity
        item.setLineTotal(
                item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()))
        );

        cartItemRepository.save(item);
        updateCartTotal(cart);
        return cart;
    }

    // Update item quantity
    public Cart updateItem(Long userId, Long productId, int quantity) {

        Cart cart = getOrCreateCart(userId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem item = cartItemRepository.findByCartAndProduct(cart, product)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        item.setQuantity(quantity);
        item.setLineTotal(
                item.getUnitPrice().multiply(BigDecimal.valueOf(quantity))
        );
        cartItemRepository.save(item);

        updateCartTotal(cart);
        return cart;
    }

    // Remove item
    @Transactional
    public Cart removeItem(Long userId, Long productId) {

        Cart cart = getOrCreateCart(userId);

        cartItemRepository.deleteByCartIdAndProductId(cart.getId(), productId);

        updateCartTotal(cart);
        return cart;
    }

    // Get Cart
    public Cart getCart(Long userId) {
        return getOrCreateCart(userId);
    }

    // Cập nhật tổng tiền giỏ hàng
    private void updateCartTotal(Cart cart) {
        BigDecimal total = cartItemRepository.sumLineTotal(cart.getId());
        cart.setTotalAmount(total == null ? BigDecimal.ZERO : total);
        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
    }
}

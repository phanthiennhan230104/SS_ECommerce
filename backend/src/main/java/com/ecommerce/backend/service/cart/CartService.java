package com.ecommerce.backend.service.cart;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.backend.dto.request.order.CheckoutRequest;
import com.ecommerce.backend.model.Cart;
import com.ecommerce.backend.model.CartItem;
import com.ecommerce.backend.model.Order;
import com.ecommerce.backend.model.OrderItem;
import com.ecommerce.backend.model.Product;
import com.ecommerce.backend.model.User;
import com.ecommerce.backend.repository.CartItemRepository;
import com.ecommerce.backend.repository.CartRepository;
import com.ecommerce.backend.repository.OrderItemRepository;
import com.ecommerce.backend.repository.OrderRepository;
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
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

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

    // Checkout - convert cart items to order
    @Transactional
    public Order checkout(Long userId, CheckoutRequest checkoutRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create new order
        Order order = Order.builder()
                .user(user)
                .customerName(checkoutRequest.getCustomerName() != null && !checkoutRequest.getCustomerName().isEmpty() 
                    ? checkoutRequest.getCustomerName() 
                    : user.getFullName())
                .customerEmail(checkoutRequest.getCustomerEmail() != null && !checkoutRequest.getCustomerEmail().isEmpty() 
                    ? checkoutRequest.getCustomerEmail() 
                    : user.getEmail())
                .customerPhone(checkoutRequest.getCustomerPhone())
                .shippingAddress(checkoutRequest.getCustomerAddress())
                .totalAmount(checkoutRequest.getTotalAmount())
                .status(Order.Status.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Order savedOrder = orderRepository.save(order);
        
        // Create order items list
        List<OrderItem> orderItems = new ArrayList<>();

        // Create order items from checkout items
        for (CheckoutRequest.OrderItemDTO itemDTO : checkoutRequest.getItems()) {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            OrderItem orderItem = OrderItem.builder()
                    .order(savedOrder)
                    .product(product)
                    .quantity(itemDTO.getQuantity())
                    .unitPrice(itemDTO.getUnitPrice())
                    .build();

            orderItemRepository.save(orderItem);
            orderItems.add(orderItem);
        }
        
        // Set items to order so mapper can use them
        savedOrder.setItems(orderItems);

        // Clear cart after checkout
        Cart cart = getOrCreateCart(userId);
        cart.setStatus(Cart.Status.COMPLETED);
        cartRepository.save(cart);
        cartItemRepository.deleteByCartId(cart.getId());

        return savedOrder;
    }

    // Cập nhật tổng tiền giỏ hàng
    private void updateCartTotal(Cart cart) {
        BigDecimal total = cartItemRepository.sumLineTotal(cart.getId());
        cart.setTotalAmount(total == null ? BigDecimal.ZERO : total);
        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
    }
}


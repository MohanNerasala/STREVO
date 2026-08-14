package com.auratrends.ecommerce.controller;

import com.auratrends.ecommerce.entity.Order;
import com.auratrends.ecommerce.entity.OrderItem;
import com.auratrends.ecommerce.entity.User;
import com.auratrends.ecommerce.repository.CartItemRepository;
import com.auratrends.ecommerce.repository.OrderRepository;
import com.auratrends.ecommerce.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @GetMapping
    public List<Order> getUserOrders(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userDetails.getUser().getId());
    }

    @PostMapping
    public ResponseEntity<?> placeOrder(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                        @RequestBody Map<String, String> request) {
        User user = userDetails.getUser();
        String paymentMethod = request.getOrDefault("paymentMethod", "COD");

        var cartItems = cartItemRepository.findByUserId(user.getId());
        if (cartItems.isEmpty()) {
            return ResponseEntity.badRequest().body("Cart is empty");
        }

        double total = cartItems.stream()
                .mapToDouble(item -> item.getProduct().getFinalPrice() * item.getQuantity())
                .sum();

        Order order = Order.builder()
                .user(user)
                .totalAmount(total)
                .status("PENDING")
                .paymentMethod(paymentMethod)
                .paymentStatus("PENDING")
                .build();

        List<OrderItem> orderItems = cartItems.stream().map(ci ->
            OrderItem.builder()
                .order(order)
                .product(ci.getProduct())
                .quantity(ci.getQuantity())
                .priceAtPurchase(ci.getProduct().getFinalPrice())
                .selectedSize(ci.getSelectedSize())
                .build()
        ).collect(Collectors.toList());

        order.setItems(orderItems);
        Order savedOrder = orderRepository.save(order);

        // Clear cart after order
        cartItemRepository.deleteAll(cartItems);

        return ResponseEntity.ok(savedOrder);
    }
}

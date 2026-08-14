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
import java.util.UUID;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private com.auratrends.ecommerce.repository.AddressRepository addressRepository;

    @GetMapping
    public List<Order> getUserOrders(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userDetails.getUser().getId());
    }

    @PostMapping
    public ResponseEntity<?> placeOrder(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                        @RequestBody Map<String, Object> request) {
        User user = userDetails.getUser();
        String paymentMethod = (String) request.getOrDefault("paymentMethod", "COD");
        
        @SuppressWarnings("unchecked")
        List<String> cartItemIdStrings = (List<String>) request.get("cartItemIds");
        if (cartItemIdStrings == null || cartItemIdStrings.isEmpty()) {
            return ResponseEntity.badRequest().body("No items selected for checkout");
        }
        
        List<UUID> cartItemIds = cartItemIdStrings.stream().map(UUID::fromString).collect(Collectors.toList());
        
        String addressIdStr = (String) request.get("addressId");
        com.auratrends.ecommerce.entity.Address address = null;
        if (addressIdStr != null) {
            address = addressRepository.findById(UUID.fromString(addressIdStr)).orElse(null);
        }

        var allCartItems = cartItemRepository.findByUserId(user.getId());
        var checkoutItems = allCartItems.stream()
                .filter(item -> cartItemIds.contains(item.getId()))
                .collect(Collectors.toList());

        if (checkoutItems.isEmpty()) {
            return ResponseEntity.badRequest().body("Cart items not found");
        }

        double subtotal = checkoutItems.stream()
                .mapToDouble(item -> item.getProduct().getFinalPrice() * item.getQuantity())
                .sum();
                
        double taxAmount = 10.0;
        
        // Delivery fee: 5 rupees per item (qty)
        int totalQuantity = checkoutItems.stream().mapToInt(com.auratrends.ecommerce.entity.CartItem::getQuantity).sum();
        double deliveryFee = totalQuantity * 5.0;
        
        double total = subtotal + taxAmount + deliveryFee;

        Order order = Order.builder()
                .user(user)
                .totalAmount(total)
                .taxAmount(taxAmount)
                .deliveryFee(deliveryFee)
                .status("ORDERED") // Change to ORDERED instead of PENDING for timeline
                .paymentMethod(paymentMethod)
                .paymentStatus("SUCCESS")
                .shippingAddress(address)
                .estimatedDeliveryDate(LocalDateTime.now().plusDays(3))
                .build();

        List<OrderItem> orderItems = checkoutItems.stream().map(ci ->
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

        // Clear only checked out items
        cartItemRepository.deleteAll(checkoutItems);

        return ResponseEntity.ok(savedOrder);
    }
    
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                         @PathVariable UUID id,
                                         @RequestBody Map<String, String> request) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null || !order.getUser().getId().equals(userDetails.getUser().getId())) {
            return ResponseEntity.badRequest().body("Order not found");
        }
        
        String reason = request.getOrDefault("reason", "No reason provided");
        order.setStatus("CANCELLED");
        order.setCancellationReason(reason);
        orderRepository.save(order);
        
        return ResponseEntity.ok(order);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                         @PathVariable UUID id) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null || !order.getUser().getId().equals(userDetails.getUser().getId())) {
            return ResponseEntity.badRequest().body("Order not found");
        }
        
        // Physically delete from database for Clear History
        orderRepository.delete(order);
        return ResponseEntity.ok(Map.of("message", "Order deleted"));
    }

    @DeleteMapping("/clear-history")
    public ResponseEntity<?> clearAllOrdersHistory(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = userDetails.getUser();
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        orderRepository.deleteAll(orders);
        return ResponseEntity.ok(Map.of("message", "All orders cleared"));
    }

    @PostMapping("/{id}/feedback")
    public ResponseEntity<?> submitFeedback(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                            @PathVariable UUID id,
                                            @RequestBody Map<String, Integer> request) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null || !order.getUser().getId().equals(userDetails.getUser().getId())) {
            return ResponseEntity.badRequest().body("Order not found");
        }
        
        Integer rating = request.get("rating");
        if (rating != null && rating >= 1 && rating <= 5) {
            order.setRating(rating);
            orderRepository.save(order);
            return ResponseEntity.ok(Map.of("message", "Feedback saved successfully"));
        }
        return ResponseEntity.badRequest().body("Invalid rating");
    }
}

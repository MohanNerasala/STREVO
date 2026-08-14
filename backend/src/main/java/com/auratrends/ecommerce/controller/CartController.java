package com.auratrends.ecommerce.controller;

import com.auratrends.ecommerce.entity.CartItem;
import com.auratrends.ecommerce.entity.Product;
import com.auratrends.ecommerce.entity.User;
import com.auratrends.ecommerce.repository.CartItemRepository;
import com.auratrends.ecommerce.repository.ProductRepository;
import com.auratrends.ecommerce.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<CartItem> getCartItems(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return cartItemRepository.findByUserId(userDetails.getUser().getId());
    }

    @PostMapping
    public ResponseEntity<?> addToCart(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                       @RequestBody Map<String, Object> request) {
        User user = userDetails.getUser();
        UUID productId = UUID.fromString((String) request.get("productId"));
        Integer quantity = (Integer) request.getOrDefault("quantity", 1);
        String size = (String) request.get("selectedSize");
        if (size == null) {
            size = (String) request.get("size");
        }

        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) return ResponseEntity.badRequest().body("Product not found");

        java.util.Optional<CartItem> existingItem = cartItemRepository.findByUserIdAndProductIdAndSelectedSize(user.getId(), productId, size);
        
        if (existingItem.isPresent()) {
            CartItem cartItem = existingItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
            return ResponseEntity.ok(cartItemRepository.save(cartItem));
        }

        CartItem cartItem = CartItem.builder()
                .user(user)
                .product(product)
                .quantity(quantity)
                .selectedSize(size)
                .build();

        return ResponseEntity.ok(cartItemRepository.save(cartItem));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCartItem(@PathVariable UUID id, @RequestBody Map<String, Object> request) {
        CartItem cartItem = cartItemRepository.findById(id).orElse(null);
        if (cartItem == null) return ResponseEntity.badRequest().body("Cart item not found");
        
        Integer quantity = (Integer) request.get("quantity");
        if (quantity != null) {
            cartItem.setQuantity(quantity);
        }
        
        String size = (String) request.get("selectedSize");
        if (size != null) {
            cartItem.setSelectedSize(size);
        }
        
        return ResponseEntity.ok(cartItemRepository.save(cartItem));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeCartItem(@PathVariable UUID id) {
        cartItemRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}

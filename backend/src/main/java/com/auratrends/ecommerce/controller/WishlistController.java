package com.auratrends.ecommerce.controller;

import com.auratrends.ecommerce.entity.Product;
import com.auratrends.ecommerce.entity.User;
import com.auratrends.ecommerce.entity.WishlistItem;
import com.auratrends.ecommerce.repository.ProductRepository;
import com.auratrends.ecommerce.repository.WishlistItemRepository;
import com.auratrends.ecommerce.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistItemRepository wishlistItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<WishlistItem> getWishlistItems(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return wishlistItemRepository.findByUserId(userDetails.getUser().getId());
    }

    @PostMapping
    public ResponseEntity<?> addToWishlist(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                           @RequestBody Map<String, Object> request) {
        User user = userDetails.getUser();
        UUID productId = UUID.fromString((String) request.get("productId"));

        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) return ResponseEntity.badRequest().body("Product not found");

        // Check if already in wishlist to avoid duplicates
        List<WishlistItem> currentItems = wishlistItemRepository.findByUserId(user.getId());
        for (WishlistItem item : currentItems) {
            if (item.getProduct().getId().equals(productId)) {
                return ResponseEntity.ok(item); // Already exists
            }
        }

        WishlistItem wishlistItem = WishlistItem.builder()
                .user(user)
                .product(product)
                .build();

        return ResponseEntity.ok(wishlistItemRepository.save(wishlistItem));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeWishlistItem(@PathVariable UUID id) {
        wishlistItemRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}

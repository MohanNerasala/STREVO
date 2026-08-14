package com.auratrends.ecommerce.repository;

import com.auratrends.ecommerce.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, UUID> {
    List<WishlistItem> findByUserId(UUID userId);
}

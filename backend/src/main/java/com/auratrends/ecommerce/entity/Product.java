package com.auratrends.ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    private String brand;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String category;
    private String gender;

    @Column(nullable = false)
    private Double price;

    private Double discountPercentage;
    private Double finalPrice;
    private String imageUrl;
    private Integer stockQuantity;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> sizeOptions;

    private String color;
    private Double rating;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    @PreUpdate
    public void calculateFinalPrice() {
        if (price != null) {
            if (discountPercentage != null && discountPercentage > 0) {
                this.finalPrice = price - (price * (discountPercentage / 100.0));
            } else {
                this.finalPrice = price;
            }
        }
    }
}

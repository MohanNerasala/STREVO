package com.auratrends.ecommerce.repository;

import com.auratrends.ecommerce.entity.Product;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    
    @Override
    @EntityGraph(attributePaths = {"sizeOptions"})
    List<Product> findAll();

    @EntityGraph(attributePaths = {"sizeOptions"})
    List<Product> findByCategory(String category);

    @EntityGraph(attributePaths = {"sizeOptions"})
    List<Product> findByGender(String gender);

    @EntityGraph(attributePaths = {"sizeOptions"})
    List<Product> findByNameContainingIgnoreCaseOrBrandContainingIgnoreCase(String name, String brand);
}

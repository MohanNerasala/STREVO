package com.auratrends.ecommerce.config;

import com.auratrends.ecommerce.entity.CartItem;
import com.auratrends.ecommerce.entity.Product;
import com.auratrends.ecommerce.entity.Role;
import com.auratrends.ecommerce.entity.User;
import com.auratrends.ecommerce.entity.WishlistItem;
import com.auratrends.ecommerce.repository.CartItemRepository;
import com.auratrends.ecommerce.repository.ProductRepository;
import com.auratrends.ecommerce.repository.UserRepository;
import com.auratrends.ecommerce.repository.WishlistItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private WishlistItemRepository wishlistItemRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        boolean usersCreated = false;
        if (userRepository.count() == 0) {
            seedUsers();
            usersCreated = true;
        }
        if (productRepository.count() == 0) {
            seedProducts();
            if (usersCreated) {
                seedCartAndWishlist();
            }
        }
    }

    private void seedUsers() {
        User admin = User.builder()
                .fullName("Admin User")
                .email("admin@auratrends.com")
                .passwordHash(passwordEncoder.encode("Mohan**@0987"))
                .role(Role.ADMIN)
                .build();

        User customer = User.builder()
                .fullName("Test Customer")
                .email("customer@auratrends.com")
                .phone("+1234567890")
                .passwordHash(passwordEncoder.encode("password123"))
                .role(Role.USER)
                .build();

        userRepository.saveAll(Arrays.asList(admin, customer));
    }

    private void seedProducts() {
        List<Product> products = new ArrayList<>();

        String[] brands = {"STREVO", "Aura Trends", "UrbanEdge", "Luxe", "District", "Night Grid", "Concrete", "Asphalt", "Metro", "Seoul", "Twinset"};
        
        // Define varied images for each category
        String[] hoodieImages = {
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1578587018452-892bace94f12?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&w=800&q=80"
        };
        
        String[] teeImages = {
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1618517351616-38fb9c52e047?auto=format&fit=crop&w=800&q=80"
        };

        String[] cargoImages = {
            "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80"
        };

        String[] denimImages = {
            "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80"
        };

        String[] sneakerImages = {
            "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1552346154-21d32810baa3?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80"
        };

        // Adjectives and styles to generate unique names
        String[] colors = {"Black", "Navy", "Charcoal", "Olive", "Light Gray", "Off-White", "Washed Black", "Vintage Blue", "Desert Sand"};
        String[] hoodieStyles = {"Boxy Hoodie", "Zip-Up Hoodie", "Heavyweight Hoodie", "Oversized Hoodie"};
        String[] teeStyles = {"Graphic Tee", "Oversized Tee", "Vintage Wash Tee", "Drop Shoulder Tee"};
        String[] cargoStyles = {"Cargo Pants", "Parachute Pants", "Tactical Trousers", "Utility Pants"};
        String[] denimStyles = {"Wide Leg Jeans", "Baggy Denim", "Washed Denim", "Skate Jeans"};
        String[] sneakerStyles = {"Chunky Sneakers", "High-Top Canvas", "Retro Runners", "Court Sneakers"};

        int idCounter = 1;

        // Strictly the 7 categories from the Collections Page Tabs
        products.addAll(generateProductsForCategory("New Drops", 20, colors, hoodieStyles, brands, hoodieImages, 2000, 4000, idCounter)); idCounter += 20;
        products.addAll(generateProductsForCategory("Hoodies", 20, colors, hoodieStyles, brands, hoodieImages, 1500, 3500, idCounter)); idCounter += 20;
        products.addAll(generateProductsForCategory("Tees", 20, colors, teeStyles, brands, teeImages, 800, 1500, idCounter)); idCounter += 20;
        products.addAll(generateProductsForCategory("Cargos", 20, colors, cargoStyles, brands, cargoImages, 1800, 4000, idCounter)); idCounter += 20;
        products.addAll(generateProductsForCategory("Denim", 20, colors, denimStyles, brands, denimImages, 2000, 4500, idCounter)); idCounter += 20;
        products.addAll(generateProductsForCategory("Sneakers", 20, colors, sneakerStyles, brands, sneakerImages, 3000, 8000, idCounter)); idCounter += 20;
        products.addAll(generateProductsForCategory("Sale", 20, colors, teeStyles, brands, teeImages, 500, 1500, idCounter));
        
        productRepository.saveAll(products);
    }

    private List<Product> generateProductsForCategory(String category, int count, String[] colors, String[] styles, String[] brands, String[] images, int minPrice, int maxPrice, int startId) {
        List<Product> products = new ArrayList<>();
        List<String> sizeList = Arrays.asList("S", "M", "L", "XL");
        
        for (int i = 0; i < count; i++) {
            String color = colors[(startId + i) % colors.length];
            String style = styles[(startId + i) % styles.length];
            String brand = brands[(startId + i) % brands.length];
            String image = images[(startId + i) % images.length];
            
            // Unique Name Generation
            String name = brand + " " + color + " " + style + " " + (100 + (startId + i) % 899);
            
            double price = minPrice + (Math.random() * (maxPrice - minPrice));
            price = Math.round(price / 10.0) * 10.0; // Round to nearest 10
            
            // 25% chance of being on sale, but 100% chance if in the 'Sale' category
            double discount = (Math.random() > 0.75 || category.equals("Sale")) ? (10.0 + (Math.round(Math.random() * 4) * 10)) : 0.0; 
            
            Product p = Product.builder()
                    .name(name)
                    .brand(brand)
                    .description("Premium streetwear " + style.toLowerCase() + " by " + brand + ". Built for everyday comfort and street style.")
                    .category(category)
                    .gender((i % 3 == 0) ? "Women" : (i % 2 == 0) ? "Men" : "Unisex")
                    .price(price)
                    .discountPercentage(discount)
                    .imageUrl(image)
                    .stockQuantity(10 + (int)(Math.random() * 100))
                    .sizeOptions(sizeList)
                    .color(color)
                    .rating(4.0 + (Math.random() * 1.0)) // 4.0 to 5.0
                    .build();
            products.add(p);
        }
        return products;
    }

    private void seedCartAndWishlist() {
        User customer = userRepository.findByEmail("customer@auratrends.com").orElse(null);
        if (customer == null) return;

        List<Product> allProducts = productRepository.findAll();
        if (allProducts.size() < 5) return;

        // Add 2 items to Cart
        CartItem c1 = CartItem.builder().user(customer).product(allProducts.get(0)).quantity(1).selectedSize("M").build();
        CartItem c2 = CartItem.builder().user(customer).product(allProducts.get(1)).quantity(2).selectedSize("L").build();
        cartItemRepository.saveAll(Arrays.asList(c1, c2));

        // Add 3 items to Wishlist
        WishlistItem w1 = WishlistItem.builder().user(customer).product(allProducts.get(2)).build();
        WishlistItem w2 = WishlistItem.builder().user(customer).product(allProducts.get(3)).build();
        WishlistItem w3 = WishlistItem.builder().user(customer).product(allProducts.get(4)).build();
        wishlistItemRepository.saveAll(Arrays.asList(w1, w2, w3));
    }
}

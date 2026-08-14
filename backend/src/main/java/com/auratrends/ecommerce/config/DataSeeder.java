package com.auratrends.ecommerce.config;

import com.auratrends.ecommerce.entity.Product;
import com.auratrends.ecommerce.entity.Role;
import com.auratrends.ecommerce.entity.User;
import com.auratrends.ecommerce.repository.ProductRepository;
import com.auratrends.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (productRepository.count() == 0) {
            seedProducts();
        }
        if (userRepository.count() == 0) {
            seedUsers();
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
        Product p1 = Product.builder()
                .name("Slim Fit Casual Shirt")
                .brand("Aura Trends")
                .description("Premium cotton slim fit casual shirt for men.")
                .category("Shirts")
                .gender("Men")
                .price(49.99)
                .discountPercentage(10.0)
                .imageUrl("https://images.unsplash.com/photo-1596755094514-f87e32f85e23?auto=format&fit=crop&w=800&q=80")
                .stockQuantity(100)
                .sizeOptions(Arrays.asList("M", "L", "XL"))
                .rating(4.5)
                .build();

        Product p2 = Product.builder()
                .name("Classic Blue Jeans")
                .brand("Denim Co")
                .description("Durable and stylish classic blue jeans.")
                .category("Pants")
                .gender("Men")
                .price(79.99)
                .discountPercentage(20.0)
                .imageUrl("https://images.unsplash.com/photo-1542272604-780c8e5015b6?auto=format&fit=crop&w=800&q=80")
                .stockQuantity(150)
                .sizeOptions(Arrays.asList("30", "32", "34", "36"))
                .rating(4.8)
                .build();

        Product p3 = Product.builder()
                .name("Floral Summer Dress")
                .brand("Luxe")
                .description("Lightweight floral dress perfect for summer.")
                .category("Dresses")
                .gender("Women")
                .price(59.99)
                .discountPercentage(15.0)
                .imageUrl("https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80")
                .stockQuantity(80)
                .sizeOptions(Arrays.asList("S", "M", "L"))
                .rating(4.7)
                .build();

        Product p4 = Product.builder()
                .name("Elegant Evening Gown")
                .brand("Aura Trends")
                .description("Stunning evening gown for special occasions.")
                .category("Dresses")
                .gender("Women")
                .price(129.99)
                .discountPercentage(0.0)
                .imageUrl("https://images.unsplash.com/photo-1566160983935-300627788b77?auto=format&fit=crop&w=800&q=80")
                .stockQuantity(30)
                .sizeOptions(Arrays.asList("S", "M"))
                .rating(4.9)
                .build();

        Product p5 = Product.builder()
                .name("Kids Graphic T-Shirt")
                .brand("MiniTrends")
                .description("Fun and colorful graphic tee for kids.")
                .category("Shirts")
                .gender("Kids")
                .price(19.99)
                .discountPercentage(5.0)
                .imageUrl("https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80")
                .stockQuantity(200)
                .sizeOptions(Arrays.asList("4Y", "6Y", "8Y"))
                .rating(4.3)
                .build();

        Product p6 = Product.builder()
                .name("Running Sneakers")
                .brand("Sprint")
                .description("Lightweight and comfortable running shoes.")
                .category("Shoes")
                .gender("Unisex")
                .price(89.99)
                .discountPercentage(25.0)
                .imageUrl("https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80")
                .stockQuantity(120)
                .sizeOptions(Arrays.asList("8", "9", "10", "11"))
                .rating(4.6)
                .build();

        Product p7 = Product.builder()
                .name("Leather Jacket")
                .brand("UrbanEdge")
                .description("Premium faux leather jacket for a bold look.")
                .category("Jackets")
                .gender("Men")
                .price(149.99)
                .discountPercentage(30.0)
                .imageUrl("https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80")
                .stockQuantity(40)
                .sizeOptions(Arrays.asList("M", "L", "XL"))
                .rating(4.7)
                .build();

        Product p8 = Product.builder()
                .name("Women's Denim Jacket")
                .brand("Luxe")
                .description("Classic denim jacket for casual outings.")
                .category("Jackets")
                .gender("Women")
                .price(99.99)
                .discountPercentage(15.0)
                .imageUrl("https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80")
                .stockQuantity(60)
                .sizeOptions(Arrays.asList("S", "M", "L"))
                .rating(4.5)
                .build();

        Product p9 = Product.builder()
                .name("Cotton Polo Shirt")
                .brand("Aura Trends")
                .description("Breathable cotton polo shirt for everyday wear.")
                .category("Shirts")
                .gender("Men")
                .price(39.99)
                .discountPercentage(0.0)
                .imageUrl("https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80")
                .stockQuantity(180)
                .sizeOptions(Arrays.asList("S", "M", "L", "XL"))
                .rating(4.4)
                .build();

        Product p10 = Product.builder()
                .name("Kids Sneakers")
                .brand("MiniTrends")
                .description("Colorful and durable sneakers for active kids.")
                .category("Shoes")
                .gender("Kids")
                .price(34.99)
                .discountPercentage(10.0)
                .imageUrl("https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80")
                .stockQuantity(150)
                .sizeOptions(Arrays.asList("2Y", "3Y", "4Y", "5Y"))
                .rating(4.6)
                .build();

        Product p11 = Product.builder()
                .name("Chino Pants")
                .brand("UrbanEdge")
                .description("Slim-fit chinos for a smart-casual look.")
                .category("Pants")
                .gender("Men")
                .price(59.99)
                .discountPercentage(20.0)
                .imageUrl("https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80")
                .stockQuantity(100)
                .sizeOptions(Arrays.asList("30", "32", "34"))
                .rating(4.3)
                .build();

        Product p12 = Product.builder()
                .name("Women's Blouse")
                .brand("Luxe")
                .description("Elegant blouse perfect for office and outings.")
                .category("Tops")
                .gender("Women")
                .price(44.99)
                .discountPercentage(10.0)
                .imageUrl("https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80")
                .stockQuantity(90)
                .sizeOptions(Arrays.asList("S", "M", "L"))
                .rating(4.5)
                .build();

        Product p13 = Product.builder()
                .name("Sunglasses - Aviator")
                .brand("ShadeCraft")
                .description("Classic aviator sunglasses with UV protection.")
                .category("Accessories")
                .gender("Unisex")
                .price(29.99)
                .discountPercentage(0.0)
                .imageUrl("https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80")
                .stockQuantity(300)
                .sizeOptions(Arrays.asList("One Size"))
                .rating(4.8)
                .build();

        Product p14 = Product.builder()
                .name("Ethnic Kurti Set")
                .brand("Aura Trends")
                .description("Beautiful ethnic kurti set for festive occasions.")
                .category("Ethnic Wear")
                .gender("Women")
                .price(69.99)
                .discountPercentage(25.0)
                .imageUrl("https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80")
                .stockQuantity(70)
                .sizeOptions(Arrays.asList("S", "M", "L", "XL"))
                .rating(4.7)
                .build();

        Product p15 = Product.builder()
                .name("Men's Formal Shoes")
                .brand("ClassicStep")
                .description("Polished formal shoes for office and events.")
                .category("Shoes")
                .gender("Men")
                .price(109.99)
                .discountPercentage(15.0)
                .imageUrl("https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=800&q=80")
                .stockQuantity(50)
                .sizeOptions(Arrays.asList("8", "9", "10", "11"))
                .rating(4.4)
                .build();

        Product p16 = Product.builder()
                .name("Women's Heels")
                .brand("GlamStep")
                .description("Stylish block heels for parties and events.")
                .category("Shoes")
                .gender("Women")
                .price(79.99)
                .discountPercentage(20.0)
                .imageUrl("https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80")
                .stockQuantity(60)
                .sizeOptions(Arrays.asList("6", "7", "8"))
                .rating(4.6)
                .build();

        Product p17 = Product.builder()
                .name("Backpack - Urban")
                .brand("UrbanEdge")
                .description("Spacious and durable urban backpack.")
                .category("Accessories")
                .gender("Unisex")
                .price(54.99)
                .discountPercentage(10.0)
                .imageUrl("https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80")
                .stockQuantity(80)
                .sizeOptions(Arrays.asList("One Size"))
                .rating(4.5)
                .build();

        Product p18 = Product.builder()
                .name("Kids Party Dress")
                .brand("MiniTrends")
                .description("Adorable party dress for little ones.")
                .category("Dresses")
                .gender("Kids")
                .price(39.99)
                .discountPercentage(15.0)
                .imageUrl("https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80")
                .stockQuantity(100)
                .sizeOptions(Arrays.asList("3Y", "4Y", "5Y", "6Y"))
                .rating(4.8)
                .build();

        Product p19 = Product.builder()
                .name("Wrist Watch - Classic")
                .brand("TimeCraft")
                .description("Elegant classic wrist watch with leather strap.")
                .category("Accessories")
                .gender("Men")
                .price(199.99)
                .discountPercentage(30.0)
                .imageUrl("https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80")
                .stockQuantity(25)
                .sizeOptions(Arrays.asList("One Size"))
                .rating(4.9)
                .build();

        Product p20 = Product.builder()
                .name("Women's Joggers")
                .brand("Aura Trends")
                .description("Comfortable joggers for workouts and casual wear.")
                .category("Pants")
                .gender("Women")
                .price(44.99)
                .discountPercentage(10.0)
                .imageUrl("https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80")
                .stockQuantity(110)
                .sizeOptions(Arrays.asList("S", "M", "L"))
                .rating(4.4)
                .build();

        productRepository.saveAll(Arrays.asList(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10,
                p11, p12, p13, p14, p15, p16, p17, p18, p19, p20));
    }
}

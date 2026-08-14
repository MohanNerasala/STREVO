package com.auratrends.ecommerce.controller;

import com.auratrends.ecommerce.dto.AuthResponse;
import com.auratrends.ecommerce.dto.LoginRequest;
import com.auratrends.ecommerce.dto.RegisterRequest;
import com.auratrends.ecommerce.entity.Role;
import com.auratrends.ecommerce.entity.User;
import com.auratrends.ecommerce.repository.UserRepository;
import com.auratrends.ecommerce.security.JwtUtil;
import com.auratrends.ecommerce.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private com.auratrends.ecommerce.security.UserDetailsServiceImpl userDetailsService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String jwt = jwtUtil.generateToken(userDetails);
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);

        User user = userDetails.getUser();
        return ResponseEntity.ok(new AuthResponse(jwt, refreshToken, user.getId(), user.getFullName(), user.getEmail(), user.getRole().name(), user.getAvatarUrl()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        User user = User.builder()
                .fullName(signUpRequest.getFullName())
                .email(signUpRequest.getEmail())
                .phone(signUpRequest.getPhone())
                .passwordHash(passwordEncoder.encode(signUpRequest.getPassword()))
                .role(Role.USER)
                .build();

        userRepository.save(user);

        // Auto login after register without re-checking the password hash
        UserDetailsImpl userDetails = new UserDetailsImpl(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        String jwt = jwtUtil.generateToken(userDetails);
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(jwt, refreshToken, user.getId(), user.getFullName(), user.getEmail(), user.getRole().name(), user.getAvatarUrl()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody com.auratrends.ecommerce.dto.RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();
        
        try {
            String username = jwtUtil.extractUsername(refreshToken);
            org.springframework.security.core.userdetails.UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            
            if (jwtUtil.validateToken(refreshToken, userDetails)) {
                String newJwt = jwtUtil.generateToken(userDetails);
                String newRefreshToken = jwtUtil.generateRefreshToken(userDetails); // Optionally rotate refresh token too
                
                User user = ((UserDetailsImpl) userDetails).getUser();
                return ResponseEntity.ok(new AuthResponse(newJwt, newRefreshToken, user.getId(), user.getFullName(), user.getEmail(), user.getRole().name(), user.getAvatarUrl()));
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid Refresh Token");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Token expired or invalid");
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userDetails.getUser();
        return ResponseEntity.ok(user);
    }
}

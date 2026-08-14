package com.auratrends.ecommerce.controller;

import com.auratrends.ecommerce.entity.Address;
import com.auratrends.ecommerce.entity.User;
import com.auratrends.ecommerce.repository.AddressRepository;
import com.auratrends.ecommerce.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    @Autowired
    private AddressRepository addressRepository;

    @GetMapping
    public ResponseEntity<List<Address>> getUserAddresses(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = userDetails.getUser();
        List<Address> addresses = addressRepository.findAll().stream()
                .filter(a -> a.getUser().getId().equals(user.getId()))
                .toList();
        return ResponseEntity.ok(addresses);
    }

    @PostMapping
    public ResponseEntity<?> saveAddress(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                         @RequestBody Address address) {
        User user = userDetails.getUser();
        address.setUser(user);
        
        List<Address> existing = addressRepository.findAll().stream()
                .filter(a -> a.getUser().getId().equals(user.getId()))
                .toList();
                
        if (existing.isEmpty() || (address.getIsDefault() != null && address.getIsDefault())) {
            address.setIsDefault(true);
        } else {
            address.setIsDefault(false);
        }

        Address saved = addressRepository.save(address);
        return ResponseEntity.ok(saved);
    }
}

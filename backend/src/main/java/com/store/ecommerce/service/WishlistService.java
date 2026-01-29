package com.store.ecommerce.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.store.ecommerce.model.CustomUser;
import com.store.ecommerce.model.Product;
import com.store.ecommerce.model.Wishlist;
import com.store.ecommerce.repository.WishlistRepo;

import jakarta.transaction.Transactional;

@Service
public class WishlistService {
    WishlistRepo wishlistRepo;
    UserService userService;
    ProductService productService;

    public WishlistService(WishlistRepo _WishlistRepo, UserService _uService, ProductService _ProductService){
        this.wishlistRepo = _WishlistRepo;
        this.productService = _ProductService;
        this.userService = _uService;
    }

    public Wishlist getWishlist(Long wishlistId){
        return wishlistRepo.findById(wishlistId).orElseThrow(() -> new RuntimeException("Wishlist Not Found !"));
    }

    public Wishlist addItem(Long userId, Long productId){
        CustomUser user = userService.ReturnCustomUserById(userId);
        Product product = productService.returnProductById(productId);
        Optional<Wishlist> existingWishlist = wishlistRepo.findByUserAndProduct(user, product);
        if (existingWishlist.isPresent()) {
            throw new IllegalStateException(
                "Product with ID " + productId + " is already in the wishlist for user " + userId
            );
        }else{
            Wishlist wishlist = new Wishlist(user, product);
            return wishlistRepo.save(wishlist);   
        }
    }

    @Transactional
    public void deleteItem(Long userId, Long productId){
        CustomUser user = userService.ReturnCustomUserById(userId);
        Product product = productService.returnProductById(productId);
        wishlistRepo.deleteByUserAndProduct(user, product);
    }
}

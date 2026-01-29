package com.store.ecommerce.controller;

import com.store.ecommerce.DTOs.Wishlist.WishlistResponse;
import com.store.ecommerce.model.Wishlist;
import com.store.ecommerce.service.WishlistService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/wishlist")
public class WishlistController {
    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @PostMapping("/users/{userId}/product/{productId}")
    public ResponseEntity<WishlistResponse> addItemToWishlist(
            @PathVariable Long userId,
            @PathVariable Long productId) {
        
        Wishlist wishlistItem = wishlistService.addItem(userId, productId);
        WishlistResponse response = new WishlistResponse(wishlistItem);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("/users/{userId}/product/{productId}")
    public ResponseEntity<Void> deleteItemFromWishlist(
            @PathVariable Long userId,
            @PathVariable Long productId) {
        
        wishlistService.deleteItem(userId, productId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{wishlistItemId}")
    public ResponseEntity<WishlistResponse> getWishlistItemById(@PathVariable Long wishlistItemId) {
        Wishlist item = wishlistService.getWishlist(wishlistItemId);
        WishlistResponse response = new WishlistResponse(item);
        return ResponseEntity.ok(response);
    }
    // if we want to get the userWishlist it will come from userController
}
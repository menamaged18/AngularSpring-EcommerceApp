package com.store.ecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.store.ecommerce.DTOs.CartItem.CartItemRequest;
import com.store.ecommerce.DTOs.CartItem.CartItemResponse;
import com.store.ecommerce.model.CartItem;
import com.store.ecommerce.service.CartItemService;

@RestController
@RequestMapping("/cart-items")
public class CartItemController {
    @Autowired
    private CartItemService cartItemService;

    @PostMapping("/add/{userId}")
    public ResponseEntity<CartItemResponse> addItemToCart(
            @PathVariable Long userId,
            @RequestBody CartItemRequest req) {
        CartItem addedItem = cartItemService.addItemToCart(userId, req.getProductId(), req.getQuantity());
        CartItemResponse response = new CartItemResponse(addedItem);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/cart/{cartId}")
    public ResponseEntity<CartItemResponse> editCartItem(
            @PathVariable Long cartId,
            @RequestBody CartItemRequest req) {
        CartItem editedItem = cartItemService.editCartItem(cartId, req.getProductId(), req.getQuantity());
        CartItemResponse response = new CartItemResponse(editedItem);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/cart/{cartId}/product/{productId}")
    public ResponseEntity<Void> deleteItemFromCart(
            @PathVariable Long cartId,
            @PathVariable Long productId) {
        cartItemService.deleteItemFromUserCart(cartId, productId);
        return ResponseEntity.noContent().build(); 
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<Void> deleteItemFromCartByCartItemId(@PathVariable Long cartItemId) {
        cartItemService.deleteItemByCartItemId(cartItemId);
        return ResponseEntity.noContent().build(); 
    }

    @GetMapping("/{cartItemId}")
    public ResponseEntity<CartItemResponse> getCartItemById(@PathVariable Long cartItemId) {
        CartItem cartItem = cartItemService.getCartItemByCartItemId(cartItemId);
        CartItemResponse response = new CartItemResponse(cartItem);
        return ResponseEntity.ok(response);
    }

}
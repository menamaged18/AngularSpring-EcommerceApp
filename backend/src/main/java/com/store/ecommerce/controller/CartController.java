package com.store.ecommerce.controller;

// import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.store.ecommerce.DTOs.Cart.CartWithItemsResponse;
import com.store.ecommerce.model.Cart;
import com.store.ecommerce.service.CartService;

@RestController
@RequestMapping("/cart")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // cart created when user is created
    // @PostMapping("/users/{userId}")
    // public ResponseEntity<Cart> createCart(@PathVariable Long userId) {
    //     Cart newCart = cartService.createCart(userId);
    //     return new ResponseEntity<>(newCart, HttpStatus.CREATED);
    // }

    @GetMapping("/users/{userId}")
    public ResponseEntity<CartWithItemsResponse> getCartByUserId(@PathVariable Long userId) {
        Cart cart = cartService.getCartByUserId(userId);
        CartWithItemsResponse response = new CartWithItemsResponse(cart);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{cartId}")
    public ResponseEntity<CartWithItemsResponse> getCartById(@PathVariable Long cartId) {
        Cart cart = cartService.getCardById(cartId);
        CartWithItemsResponse response = new CartWithItemsResponse(cart);
        return ResponseEntity.ok(response);
    }

    // this method will empty the cart content
    @DeleteMapping("/{cartId}/clear")
    public ResponseEntity<Void> emptyCart(@PathVariable Long cartId) {
        cartService.emptyCartByCartId(cartId);
        return ResponseEntity.noContent().build(); 
    }    
}
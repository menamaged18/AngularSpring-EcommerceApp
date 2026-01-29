package com.store.ecommerce.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.store.ecommerce.model.Cart;
import com.store.ecommerce.model.CustomUser;
import com.store.ecommerce.repository.CartRepo;
import com.store.ecommerce.repository.UserRepo; 

@Service
public class CartService {
    private CartRepo cartRepo;
    private UserRepo userRepo; 

    public CartService(CartRepo _CartRepo, UserRepo _userRepo){
        this.cartRepo = _CartRepo;
        this.userRepo = _userRepo;
    }

    public Cart createCart(Long userId){
        CustomUser user = userRepo.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        Cart newCart = new Cart(user);
        return cartRepo.save(newCart);
    }

    public void deleteCart(Long userId){
        cartRepo.deleteByUser_Id(userId);
    }

    public Cart getCardById(Long cartId){
        return cartRepo.findById(cartId).orElseThrow(() -> new RuntimeException("Cart not found!"));
    }

    public Optional<Cart> getCardByIdOptional(Long cartId){
        return cartRepo.findById(cartId);
    }

    public Cart getCartByUserId(Long userId){
        // if the cart was empty intizlize one and return it because every user must have a cart
        return cartRepo.findByUser_id(userId)
                        .orElseGet(() -> createCart(userId));
    }

    public void updateCartTotal(Long cartId) {
        Double total = cartRepo.calculateCartTotal(cartId);
        Cart cart = cartRepo.findById(cartId).orElseThrow();
        cart.setTotal_cost(total);
        cartRepo.save(cart);
    }

    public void emptyCartByCartId(Long cartId) {
        Cart userCart = getCardById(cartId); 
        userCart.emptyCart(); 
        cartRepo.save(userCart);
    }

    public void emptyCartByUserId(Long userId) {
        Cart userCart = getCartByUserId(userId);
        userCart.emptyCart();
        cartRepo.save(userCart);
    }

}
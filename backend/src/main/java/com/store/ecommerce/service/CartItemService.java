package com.store.ecommerce.service;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.store.ecommerce.model.Cart;
import com.store.ecommerce.model.CartItem;
import com.store.ecommerce.model.Product;
import com.store.ecommerce.repository.CartItemRepo;

@Service
public class CartItemService {
    @Autowired
    private CartItemRepo cartItemRepo;
    @Autowired
    private CartService cartService;
    @Autowired
    private ProductService productService;

    public CartItem addItemToCart(Long userId, Long productId, int quantity) {
        Cart cart = cartService.getCartByUserId(userId);
        Product product = productService.returnProductById(productId);

        Optional<CartItem> existingItemOpt = cartItemRepo.findByCartAndProduct(cart, product);

        // if the cart exists and if the product exists in it we add the quantitiy to it 
        // else we create new cart
        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            existingItem.setProductQuantity(existingItem.getProductQuantity() + quantity);
            existingItem.getCart().setUpdated_at(LocalDateTime.now());
            cartService.updateCartTotal(existingItem.getCart().getId());
            return cartItemRepo.save(existingItem);
        } else {
            CartItem newCartItem = new CartItem(); 
            newCartItem.setCart(cart);
            newCartItem.setProduct(product);
            newCartItem.setProductQuantity(quantity);
            cartService.updateCartTotal(newCartItem.getCart().getId());
            return cartItemRepo.save(newCartItem);
        }
    }

    public CartItem getCartItemByCartItemId(Long cartItemId){
        return cartItemRepo.findById(cartItemId).orElseThrow(()-> new RuntimeException("Cart Item not found!"));
    }

    public void deleteItemFromUserCart(Long cartId, Long productId) {
        Cart userCart = cartService.getCardById(cartId);
        Product product = productService.returnProductById(productId);
        Optional<CartItem> OPTcartItem = cartItemRepo.findByCartAndProduct(userCart, product);
        if (OPTcartItem.isPresent()) {
            cartItemRepo.deleteByCartAndProduct(userCart, product);
            // updating the price after deleting 
            cartService.updateCartTotal(cartId);
        }
    }

    public void deleteItemByCartItemId(Long cartItemId){
        CartItem cartItem = getCartItemByCartItemId(cartItemId);
        // Get the of the cartId before deletion to update price
        Long cartId = cartItem.getCart().getId(); 
        // deletion process
        cartItemRepo.deleteById(cartItemId);

        cartService.updateCartTotal(cartId);
    }

    public CartItem editCartItem(Long cartId, Long productId, int quantity){
        Cart cart = cartService.getCardById(cartId);
        Product product = productService.returnProductById(productId);
        Optional<CartItem> existingItemOpt = cartItemRepo.findByCartAndProduct(cart, product);
        
        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            
            existingItem.setProductQuantity(quantity);
            existingItem.getCart().setUpdated_at(LocalDateTime.now());
            
            CartItem savedCartItem = cartItemRepo.save(existingItem);
            cartService.updateCartTotal(cartId);
            return savedCartItem;
        } else {
            // Not Found exception with details
            throw new NoSuchElementException(
                "Cart Item not found in Cart ID: " + cartId + 
                " for Product ID: " + productId + 
                ". Cannot edit non-existent item."
            );
        }    
    }

    public CartItem editCartItemByCartItemId(Long CartItemId, Integer newQuantity){
        CartItem cartItem = getCartItemByCartItemId(CartItemId);
        Cart userCart = cartItem.getCart();
        
        cartItem.setProductQuantity(newQuantity);
        userCart.setUpdated_at(LocalDateTime.now());
        cartService.updateCartTotal(userCart.getId());

        return cartItemRepo.save(cartItem);
    }
}

package com.store.ecommerce.DTOs.CartItem;

import java.time.LocalDateTime;

import com.store.ecommerce.DTOs.Product.SimpleProductResponse;
import com.store.ecommerce.model.CartItem;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CartItemResponse {
    private Long id;
    private SimpleProductResponse product;
    private Integer itemQuantity;
    private LocalDateTime added_at;

    public CartItemResponse(CartItem cartitem){
        this.id = cartitem.getId();
        this.product = new SimpleProductResponse(cartitem.getProduct());
        this.itemQuantity = cartitem.getProductQuantity();
        this.added_at = cartitem.getAdded_at();
    }
}

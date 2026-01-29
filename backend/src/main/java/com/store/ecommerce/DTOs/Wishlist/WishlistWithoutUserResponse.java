package com.store.ecommerce.DTOs.Wishlist;

import java.time.LocalDateTime;

import com.store.ecommerce.DTOs.Product.SimpleProductResponse;
import com.store.ecommerce.model.Wishlist;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class WishlistWithoutUserResponse {
    private Long id;
    private SimpleProductResponse product;
    private LocalDateTime added_at;

    public WishlistWithoutUserResponse(Wishlist wishlist){
        this.id = wishlist.getId();
        this.product = new SimpleProductResponse(wishlist.getProduct());
        this.added_at = wishlist.getAdded_at();
    }
}

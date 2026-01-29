package com.store.ecommerce.DTOs.Wishlist;

import java.time.LocalDateTime;

import com.store.ecommerce.DTOs.Product.ProductResponse;
import com.store.ecommerce.DTOs.User.UserResponse;
import com.store.ecommerce.model.Wishlist;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class WishlistResponse {
    private Long id;
    private ProductResponse product;
    private UserResponse user;
    private LocalDateTime added_at;

    public WishlistResponse(Wishlist wishlist){
        this.id = wishlist.getId();
        this.product = new ProductResponse(wishlist.getProduct());
        this.user = new UserResponse(wishlist.getUser());
        this.added_at = wishlist.getAdded_at();
    }
}

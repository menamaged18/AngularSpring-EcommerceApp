package com.store.ecommerce.DTOs.Cart;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.store.ecommerce.DTOs.CartItem.CartItemResponse;
import com.store.ecommerce.model.Cart;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter 
public class CartWithItemsResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private String session_id;
    private LocalDateTime created_at;
    private List<CartItemResponse> Items;

    public CartWithItemsResponse(Cart cart){
        this.id = cart.getId();
        this.userId = cart.getUser().getId();
        this.userName = cart.getUser().getName();
        this.userEmail = cart.getUser().getEmail();
        if (cart.getSession_id() != null) {
            this.session_id = cart.getSession_id();  
        }
        this.created_at = cart.getCreated_at();
        this.Items = cart.getCart_Items().stream().map(CartItemResponse::new).collect(Collectors.toList());
    }
}

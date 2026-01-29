package com.store.ecommerce.DTOs.User;

import java.time.LocalDateTime;

import com.store.ecommerce.DTOs.Cart.CartWithItemsResponse;
import com.store.ecommerce.model.CustomUser;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserCartResponse {
    private Long id;
    private String username;
    private String email;
    private String phone;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
    private LocalDateTime last_login;
    private Boolean is_active;
    private CartWithItemsResponse cart;

    public UserCartResponse(){}

    public UserCartResponse(CustomUser _CustomUser){
        this.id = _CustomUser.getId();
        this.email = _CustomUser.getEmail();
        this.username = _CustomUser.getName();
        this.phone = _CustomUser.getPhone();
        this.created_at = _CustomUser.getCreated_at();
        this.updated_at = _CustomUser.getUpdated_at();
        this.last_login = _CustomUser.getLast_login();
        this.is_active = _CustomUser.getIs_active();
        this.cart = new CartWithItemsResponse(_CustomUser.getCart());
    } 
}

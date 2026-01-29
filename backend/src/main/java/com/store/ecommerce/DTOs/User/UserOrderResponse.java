package com.store.ecommerce.DTOs.User;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.store.ecommerce.DTOs.Order.WithoutUserOrderResponse;
import com.store.ecommerce.model.CustomUser;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserOrderResponse {
    private Long id;
    private String username;
    private String email;
    private String phone;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
    private LocalDateTime last_login;
    private Boolean is_active;
    private List<WithoutUserOrderResponse> orders = new ArrayList<>();

    public UserOrderResponse(){}

    public UserOrderResponse(CustomUser _CustomUser){
        this.id = _CustomUser.getId();
        this.email = _CustomUser.getEmail();
        this.username = _CustomUser.getName();
        this.phone = _CustomUser.getPhone();
        this.created_at = _CustomUser.getCreated_at();
        this.updated_at = _CustomUser.getUpdated_at();
        this.last_login = _CustomUser.getLast_login();
        this.is_active = _CustomUser.getIs_active();
        this.orders = _CustomUser.getOrders().stream().map(WithoutUserOrderResponse::new).collect(Collectors.toList());
    } 
}

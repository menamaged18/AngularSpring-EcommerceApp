package com.store.ecommerce.DTOs.User;

import com.store.ecommerce.types.UserType;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserRequest {
    private Long id;
    private String username;
    private String email;
    private String password;
    private String phone;
    private Boolean is_active;
    private UserType userType;
}

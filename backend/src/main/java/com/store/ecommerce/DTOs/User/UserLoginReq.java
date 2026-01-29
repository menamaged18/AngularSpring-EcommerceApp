package com.store.ecommerce.DTOs.User;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserLoginReq {
    private String email;
    private String password;
}

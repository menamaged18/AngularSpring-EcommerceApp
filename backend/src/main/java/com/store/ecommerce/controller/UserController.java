package com.store.ecommerce.controller;

import com.store.ecommerce.DTOs.User.UserRequest;
import com.store.ecommerce.DTOs.User.UserResponse;
import com.store.ecommerce.service.UserService;
import com.store.ecommerce.DTOs.User.UserCartResponse;
import com.store.ecommerce.DTOs.User.UserLoginReq;
import com.store.ecommerce.DTOs.User.UserOrderResponse;
import com.store.ecommerce.DTOs.User.UserWishlistResponse;

import java.util.List;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;


@RestController
@RequestMapping("/userapi")
public class UserController {
    private final UserService userService;

    public UserController(UserService _userService){
        this.userService = _userService;
    }

    @GetMapping("/getallUsers")
    public List<UserResponse> GetUsers() {
        return userService.allUsers();
    }

    @GetMapping("/getUserById/{id}")
    public UserResponse GetUser(@PathVariable Long id) {
        return userService.FindUserById(id);
    }

    @GetMapping("/getUserOrders/{id}")
    public UserOrderResponse GetUserOrders(@PathVariable Long id) {
        return userService.getUserOrders(id);
    }

    @GetMapping("/getUserCart/{id}")
    public UserCartResponse GetUserCart(@PathVariable Long id) {
        return userService.getUserCart(id);
    }

    @GetMapping("/getUserWishlist/{id}")
    public UserWishlistResponse GetUserWishlist(@PathVariable Long id) {
        return userService.getUserWishlist(id);
    }

    @PostMapping("/add")
    public UserResponse registerUser(@RequestBody UserRequest user) {
        return userService.RegisterUser(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserLoginReq loginRequest) {
        try {
            UserResponse user = userService.login(loginRequest.getEmail(), loginRequest.getPassword());
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            // Return 401 Unauthorized instead of 500 Internal Server Error
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @PutMapping("/edit/{id}")
    public UserResponse editUser(@PathVariable Long id, @RequestBody UserRequest user) {
        return userService.EditUser(id, user);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.DeleteUserById(id);
        // Returns HTTP Status 204 (No Content)
        return ResponseEntity.noContent().build();
    }
    
}
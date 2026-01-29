package com.store.ecommerce.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.store.ecommerce.DTOs.User.UserCartResponse;
import com.store.ecommerce.DTOs.User.UserOrderResponse;
import com.store.ecommerce.DTOs.User.UserRequest;
import com.store.ecommerce.DTOs.User.UserResponse;
import com.store.ecommerce.DTOs.User.UserWishlistResponse;
import com.store.ecommerce.model.CustomUser;
import com.store.ecommerce.repository.ReviewsRepo;
import com.store.ecommerce.repository.UserRepo;
import com.store.ecommerce.types.UserType;

import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    private final UserRepo userRepo;
    private final CartService cartService;
    private final ReviewsRepo reviewsRepo;

    // @Autowired
    public UserService(UserRepo _userRepo, CartService _CartService, ReviewsRepo _reviewsRepo){
        this.userRepo = _userRepo;
        this.cartService = _CartService;
        this.reviewsRepo = _reviewsRepo;
    }

    private CustomUser toEntity(UserRequest _user){
        CustomUser user = new CustomUser();
        user.setEmail(_user.getEmail());
        user.setName(_user.getUsername());
        user.setPassword(_user.getPassword());
        user.setPhone(_user.getPhone());
        user.setIs_active(_user.getIs_active());
        user.setUserType(_user.getUserType());
        return user;
    }

    private UserResponse toResponse(CustomUser _CustomUser){
        UserResponse userRes = new UserResponse(_CustomUser);
        return userRes;
    }

    // helper function to retrieve the CustomUser object
    public CustomUser ReturnCustomUserById(Long id){
        return userRepo.findById(id)
                            .orElseThrow(()-> new RuntimeException("user not found"));
    }

    // Services 
    public UserResponse RegisterUser(UserRequest userReq){
        if (userRepo.findByEmail(userReq.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        CustomUser userEntity = toEntity(userReq);
        CustomUser savedUser = userRepo.save(userEntity);
        // once a user is created a cart is created with him
        cartService.createCart(savedUser.getId());
        return toResponse(savedUser);
    }

    public UserResponse login(String email, String password){
        Optional<CustomUser> OPTuser = userRepo.findByEmail(email);
        if (OPTuser.isPresent()) {
            CustomUser user = OPTuser.get();
            if (user.getPassword().equals(password)) {
                user.setLast_login(LocalDateTime.now());
                userRepo.save(user);
                return toResponse(user); 
            } else {
                throw new RuntimeException("Password is not correct");
            }
        } else {
            throw new RuntimeException("Email is not correct");
        }
    }

    // return the user basic information without orders or wishlist or cart
    public UserResponse FindUserById(Long id){
        CustomUser user = userRepo.findById(id)
                            .orElseThrow(()-> new RuntimeException("user not found"));
        return toResponse(user);
    }

    // returns basic user information + orders
    public UserOrderResponse getUserOrders(Long id){
        CustomUser user = ReturnCustomUserById(id);
        return new UserOrderResponse(user);
    }

    // returns basic user information + cart
    public UserCartResponse getUserCart(Long id){
        CustomUser user = ReturnCustomUserById(id);
        // System.out.println("------------> " + user.getCart());
        return new UserCartResponse(user);
    }

    // returns basic user information + Wishlist
    @Transactional(readOnly = true)
    public UserWishlistResponse getUserWishlist(Long id){
        CustomUser user = ReturnCustomUserById(id);
        // Force initialization of the lazy collection
        user.getWishList().size(); // This triggers the lazy loading
        System.out.println("---> " + user.getWishList());
        return new UserWishlistResponse(user);
    }

    public List<UserResponse> allUsers(){
        List<CustomUser> users = userRepo.findAll();

        return users.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public UserResponse EditUser(Long id, UserRequest userReq){
        CustomUser existingUser = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
        
        if (userReq.getUsername() != null) {
            existingUser.setName(userReq.getUsername());
        }
        if (userReq.getEmail() != null) {
            existingUser.setEmail(userReq.getEmail());
        }
        if (userReq.getIs_active() != null) {
            existingUser.setIs_active(userReq.getIs_active());
        }
        if (userReq.getPhone() != null) {
            existingUser.setPhone(userReq.getPhone());
        }
        if (userReq.getUserType() != null) {
            // for a security reason i can not convert normal or guest user to admin type
            if (userReq.getUserType() != UserType.Admin) {
                existingUser.setUserType(userReq.getUserType());
            }
        }

        existingUser.setUpdated_at(LocalDateTime.now());
        // TODO: Password update would require hashing and specific business logic
        
        CustomUser updatedUser = userRepo.save(existingUser);
        return toResponse(updatedUser);
    }

    @Transactional
    public void DeleteUserById(Long id){
        CustomUser user = ReturnCustomUserById(id);
        // first deleting related reviews
        reviewsRepo.deleteByUser(user);
        userRepo.deleteById(id);
    }
}

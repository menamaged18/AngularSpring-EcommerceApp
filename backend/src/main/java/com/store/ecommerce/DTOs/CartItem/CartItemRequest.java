package com.store.ecommerce.DTOs.CartItem;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CartItemRequest {
    private Long productId;
    private int quantity;
}

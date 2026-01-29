package com.store.ecommerce.DTOs.OrderItems;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UpdateOrderItemRequest {
    private Long orderItemId;
    private Long productId;
    private Integer productQuantity;
}

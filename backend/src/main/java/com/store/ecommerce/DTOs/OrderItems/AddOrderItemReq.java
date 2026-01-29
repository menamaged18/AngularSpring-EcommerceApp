package com.store.ecommerce.DTOs.OrderItems;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AddOrderItemReq {
    private Long orderId;
    private Long productId;
    private Integer productQuantity; 
}

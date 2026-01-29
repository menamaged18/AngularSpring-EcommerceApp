package com.store.ecommerce.DTOs.Order;

import com.store.ecommerce.types.PaymentType;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderServiceReq {
    private Long userId; 
    private Long productId; 
    private int productQuantity;
    private String shipping_address;
    
    @Enumerated(EnumType.STRING)
    private PaymentType payment_Type;
}

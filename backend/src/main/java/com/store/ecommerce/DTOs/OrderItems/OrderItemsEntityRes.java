package com.store.ecommerce.DTOs.OrderItems;

import com.store.ecommerce.model.OrderItems;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class OrderItemsEntityRes {
    private Long id;
    private Long productId;
    private String productName;
    private Double productPrice;
    private Integer quantity;

    public OrderItemsEntityRes() {}

    public OrderItemsEntityRes(OrderItems orderItem) {
        this.id = orderItem.getId();
        this.quantity = orderItem.getQuantity();
        
        if (orderItem.getProduct() != null) {
            this.productId = orderItem.getProduct().getId();
            this.productName = orderItem.getProduct().getName();
            this.productPrice = orderItem.getProduct().getPrice();
        }
    }
}

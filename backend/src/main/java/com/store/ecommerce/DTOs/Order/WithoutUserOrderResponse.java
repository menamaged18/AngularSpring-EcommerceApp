package com.store.ecommerce.DTOs.Order;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.store.ecommerce.DTOs.OrderItems.OrderItemsEntityRes;
import com.store.ecommerce.model.Order;
import com.store.ecommerce.types.OrderStatus;
import com.store.ecommerce.types.PaymentType;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class WithoutUserOrderResponse {
    private Long id;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
    private Double total_amount;
    private String shipping_address;
    private OrderStatus order_Status;
    private PaymentType payment_Type;
    private List<OrderItemsEntityRes> orderItems; 

    public WithoutUserOrderResponse(){}

    public WithoutUserOrderResponse(Order _Order){
        this.id = _Order.getId();
        this.created_at = _Order.getCreated_at();
        this.updated_at = _Order.getUpdated_at();
        this.total_amount = _Order.getTotal_amount();
        this.shipping_address = _Order.getShipping_address();
        this.order_Status = _Order.getOrder_Status();
        this.payment_Type = _Order.getPayment_Type();
        this.orderItems = _Order.getOrder_Items().stream().map(OrderItemsEntityRes::new)
                                                            .collect(Collectors.toList());
    }
     
}

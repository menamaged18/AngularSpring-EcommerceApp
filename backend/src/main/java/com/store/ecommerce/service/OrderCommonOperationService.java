package com.store.ecommerce.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.store.ecommerce.model.Order;
import com.store.ecommerce.repository.OrderRepo;


@Service
public class OrderCommonOperationService {
    private final OrderRepo orderRepo;

    public OrderCommonOperationService(OrderRepo orderRepo) {
        this.orderRepo = orderRepo;
    }

    public void updateOrderTotal(Long orderId) {
        Order order = orderRepo.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        Double totalPrice = orderRepo.total_price(orderId);
        order.setTotal_amount(totalPrice);
        orderRepo.save(order);
    }

    public void updateUpdatedAt(Order order){
        order.setUpdated_at(LocalDateTime.now());
        orderRepo.save(order);
    }

    public void updateUpdatedAt(Long orderId){
        Order order = orderRepo.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found!"));
        order.setUpdated_at(LocalDateTime.now());
        orderRepo.save(order);
    }
}

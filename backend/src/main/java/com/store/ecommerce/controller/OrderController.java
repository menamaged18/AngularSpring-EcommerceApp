package com.store.ecommerce.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.store.ecommerce.DTOs.Order.OrderResponse;
import com.store.ecommerce.DTOs.Order.OrderServiceReq;
import com.store.ecommerce.model.Order;
import com.store.ecommerce.service.OrderService;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/order/")
public class OrderController {
    private final OrderService ordServ;

    public OrderController(OrderService _ordServ){
        this.ordServ = _ordServ;
    }

    // OrderResponse to hide Password and sensitive data related to the user 
    // because without OrderResponse this returns the full CustomUser entity information

    @PostMapping("add")
    public ResponseEntity<OrderResponse> createOrderByUserAndProduct(@RequestBody OrderServiceReq orderCreation){
        Order newOrder = ordServ.makeOrderByProductId(orderCreation.getUserId(), orderCreation.getProductId(), 
                                                    orderCreation.getProductQuantity(),
                                                    orderCreation.getShipping_address(),
                                                    orderCreation.getPayment_Type());
        return ResponseEntity.created(
            URI.create("/order/" + newOrder.getId())
        ).body(new OrderResponse(newOrder));
    }

    @PostMapping("add/by-Cart/{cartId}")
    public ResponseEntity<OrderResponse> createOrderByCart(@PathVariable Long cartId){
        Order newOrder = ordServ.makeOrderByCart(cartId);
        return ResponseEntity.created(
            URI.create("/order/" + newOrder.getId())
        ).body(new OrderResponse(newOrder));
    }

    @GetMapping("getOrderById/{id}")
    public OrderResponse getOrderById(@PathVariable Long id) {
        return new OrderResponse(ordServ.getOrderById(id));
    }

    @GetMapping("getOrders")
    public List<OrderResponse> getOrders() {
        return  ordServ.getAllOrders().stream().map(order -> new OrderResponse(order)).collect(Collectors.toList()) ;
    }

    @GetMapping("getUserOrders/{userId}")
    public List<OrderResponse> getUserOrders(@PathVariable Long userId) {
        return ordServ.getAllUserOrders(userId).stream().map(order -> new OrderResponse(order)).collect(Collectors.toList());
    }

    @PutMapping("edit/{id}")
    public OrderResponse editOrder(@PathVariable Long id, @RequestBody Order newOrder) {
        return new OrderResponse(ordServ.EditOrder(id, newOrder));
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        ordServ.deleteOrder(id);
        // Returns HTTP Status 204 (No Content)
        return ResponseEntity.noContent().build();
    }
}

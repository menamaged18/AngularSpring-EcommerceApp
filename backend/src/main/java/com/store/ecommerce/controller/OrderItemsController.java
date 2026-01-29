package com.store.ecommerce.controller;

import com.store.ecommerce.DTOs.OrderItems.AddOrderItemReq;
import com.store.ecommerce.DTOs.OrderItems.OrderItemsEntityRes;
import com.store.ecommerce.DTOs.OrderItems.UpdateOrderItemRequest;
import com.store.ecommerce.model.Order;
import com.store.ecommerce.model.OrderItems;
import com.store.ecommerce.model.Product;
import com.store.ecommerce.service.OrderItemsService;
import com.store.ecommerce.service.OrderService;
import com.store.ecommerce.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/order-items")
public class OrderItemsController {

    private final OrderItemsService orderItemsService;
    private final OrderService orderService;
    private final ProductService productService;

    public OrderItemsController(OrderItemsService orderItemsService,
                                OrderService orderService,
                                ProductService productService) {
        this.orderItemsService = orderItemsService;
        this.orderService = orderService;
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<OrderItemsEntityRes> addItemToOrder(@RequestBody AddOrderItemReq request) {
        try {
            Order order = orderService.returnOrderById(request.getOrderId());
            Product product = productService.returnProductById(request.getProductId());

            OrderItems newItem = orderItemsService.addItemToOrder(order, product, request.getProductQuantity());
            OrderItemsEntityRes response = new OrderItemsEntityRes(newItem);

            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderItemsEntityRes> getOrderItemById(@PathVariable("id") Long id) {
        try {
            OrderItems item = orderItemsService.getOrderItemByOrderItemsId(id);
            OrderItemsEntityRes response = new OrderItemsEntityRes(item);
            return ResponseEntity.ok(response);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getStatusCode());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderItemsEntityRes> updateOrderItem(@PathVariable("id") Long id, @RequestBody UpdateOrderItemRequest request) {
        try {
            OrderItems updatedItem = orderItemsService.editOrderItem( request.getOrderItemId(),
                                                                      request.getProductId(),
                                                                      request.getProductQuantity());

            OrderItemsEntityRes response = new OrderItemsEntityRes(updatedItem);
            return ResponseEntity.ok(response);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getStatusCode());
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderItem(@PathVariable("id") Long id) {
        try {
            orderItemsService.deleteOrderItemByOrderItemId(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}

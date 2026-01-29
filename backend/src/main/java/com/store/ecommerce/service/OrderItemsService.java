package com.store.ecommerce.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.store.ecommerce.model.Order;
import com.store.ecommerce.model.OrderItems;
import com.store.ecommerce.model.Product;
import com.store.ecommerce.repository.OrderItemsRepo;
import com.store.ecommerce.types.OrderStatus;

@Service
public class OrderItemsService {
    private final OrderItemsRepo orderItemRepo;
    private final ProductService prodServ;
    private final OrderCommonOperationService orderCommonOperations;


    public OrderItemsService(OrderItemsRepo _orderDetailsRepo, ProductService _prodserv,
                            OrderCommonOperationService _orderCommonOperations){
        this.orderItemRepo = _orderDetailsRepo;
        this.prodServ = _prodserv;
        this.orderCommonOperations = _orderCommonOperations; 
    }

    public OrderItems addItemToOrder(Order order, Product product, int quantity) {
        // Check if the order is in a state that allows adding items
        if (!order.getOrder_Status().equals(OrderStatus.pending)) { 
             throw new RuntimeException("Cannot add items to an order that is not pending.");
        }

        // Check for sufficient product stock
        if (product.getQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock for product: " + product.getName());
        }

        prodServ.updateStock(product, quantity);

        Optional<OrderItems> optItem = orderItemRepo.findByOrderAndProduct(order, product);

        OrderItems savedItem;
        if (optItem.isPresent()) {
            // If item exists, update its quantity
            OrderItems orderItem = optItem.get();
            orderItem.setQuantity(orderItem.getQuantity() + quantity);
            savedItem = orderItemRepo.save(orderItem);
        } else {
            // If item is new, create a new OrderItems entry
            OrderItems newOrderItem = new OrderItems(order, product, quantity);
            savedItem = orderItemRepo.save(newOrderItem); 
            // THIS LINE is to Maintain bidirectional relationship
            order.addOrder_Items(savedItem);
        }

        // Recalculate and update the order's total price
        orderCommonOperations.updateOrderTotal(order.getId());
        orderCommonOperations.updateUpdatedAt(order);
        return savedItem;
    }

    public void deleteOrderItemByOrderItemId(Long orderItemId){
        OrderItems orderItem = getOrderItemByOrderItemsId(orderItemId);
        int oldQuantity = orderItem.getQuantity();
        // get order id before deleting the item because if we deleted the item we can't get the order id
        Order order = orderItem.getOrder();
        orderItemRepo.deleteById(orderItemId);
        // updating the total order price after deleting the item
        orderCommonOperations.updateOrderTotal(order.getId());
        orderCommonOperations.updateUpdatedAt(order);
        // updating stock 
        prodServ.updateStock(null, 0, oldQuantity); // <- this will add the quantity removed
    }

    public OrderItems getOrderItemByOrderItemsId(Long id){
        return orderItemRepo.findById(id).orElseThrow(() -> 
                new ResponseStatusException(HttpStatus.NOT_FOUND, "OrderDetails not found or not exist"));
    }

    public List<OrderItems> GetUserOrder(Long OrderId){
        return orderItemRepo.findByorder_id(OrderId);
    }

    public OrderItems editOrderItem(Long orderDetailsID, Long productId, Integer quantity){
        OrderItems oldOrderDetails = getOrderItemByOrderItemsId(orderDetailsID);

        // first checking and updating the quantity available first
        prodServ.updateStock(oldOrderDetails.getProduct(), quantity, oldOrderDetails.getQuantity());

        if (productId != null && oldOrderDetails.getProduct().getId() != productId) {
            Product newProduct = prodServ.returnProductById(productId);
            oldOrderDetails.setProduct(newProduct);
        }

        if (quantity != null) {
            oldOrderDetails.setQuantity(quantity);
        }

        OrderItems savedOrder = orderItemRepo.save(oldOrderDetails);
        // updating the new price
        orderCommonOperations.updateOrderTotal(orderDetailsID);
        orderCommonOperations.updateUpdatedAt(orderDetailsID);
        return savedOrder;
    }

    // helper function used to replace orderItems
    public void replaceOrderItems(Order oldOrder, Order newOrder){
        // Create a map of old items by product ID for quick lookup
        Map<Long, OrderItems> oldItemsMap = new HashMap<>();
        for (OrderItems oldItem : oldOrder.getOrder_Items()) {
            oldItemsMap.put(oldItem.getProduct().getId(), oldItem);
        }

        // Process new items: update existing or add new
        for (OrderItems newItem : newOrder.getOrder_Items()) {
            Long productId = newItem.getProduct().getId();
            OrderItems existingItem = oldItemsMap.remove(productId);  // Remove from map to track deletions later
            if (existingItem != null) {
                // Update quantity if changed (handles stock diff via editOrderItem)
                if (!existingItem.getQuantity().equals(newItem.getQuantity())) {
                    editOrderItem(existingItem.getId(), existingItem.getProduct().getId(), newItem.getQuantity());
                }
            } else {
                // Add new item
                addItemToOrder(oldOrder, newItem.getProduct(), newItem.getQuantity());
            }
        }

        // Delete any remaining old items (not present in new list)
        for (OrderItems remainingItem : oldItemsMap.values()) {
            deleteOrderItemByOrderItemId(remainingItem.getId());
        }
    }
}

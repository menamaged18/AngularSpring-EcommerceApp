package com.store.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.store.ecommerce.model.Order;
import com.store.ecommerce.model.OrderItems;
import com.store.ecommerce.model.Product;

import java.util.List;
import java.util.Optional;


@Repository
public interface OrderItemsRepo extends JpaRepository<OrderItems, Long> {
    // to get the order details
    List<OrderItems> findByorder_id(Long orederId);
    Optional<OrderItems> findByOrderAndProduct(Order order, Product product);
}

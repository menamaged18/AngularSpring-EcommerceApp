package com.store.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.store.ecommerce.model.Order;

@Repository
public interface OrderRepo extends JpaRepository<Order,Long>{
    // to get userOrders
    List<Order> findByUser_id(Long userId);
    
    @Query("SELECT COALESCE(SUM(oi.product.price * oi.productQuantity), 0) FROM OrderItems oi WHERE oi.order.id = :orderId")
    Double total_price(Long orderId);

}

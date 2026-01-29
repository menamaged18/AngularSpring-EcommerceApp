package com.store.ecommerce.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.store.ecommerce.types.OrderStatus;
import com.store.ecommerce.types.PaymentType;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "orders")
@Setter
@Getter
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime created_at = LocalDateTime.now();
    private LocalDateTime updated_at = LocalDateTime.now();
    private Double total_amount;
    private String shipping_address;

    // to be extended later
    @Enumerated(EnumType.STRING)
    private OrderStatus order_Status = OrderStatus.pending;
    @Enumerated(EnumType.STRING)
    private PaymentType payment_Type;

    // Joins from another tables
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private CustomUser user;

    // to retrieve order details
    // what table will store is for example number of products 
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItems> order_Items = new ArrayList<>();

    public Order(){}

    public void addOrder_Items(OrderItems ord){
        this.order_Items.add(ord);
    }

}

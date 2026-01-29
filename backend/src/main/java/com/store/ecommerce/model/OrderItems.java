package com.store.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Id; 
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
@Table(name = "Order_items")
public class OrderItems {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIgnore
    private Order order; 

    @ManyToOne 
    @JoinColumn(name = "product_id")
    private Product product; 

    private Integer productQuantity;

    public OrderItems(){}
    public OrderItems(Order ord, Product prod, int quantity){
        this.order = ord;
        this.product = prod;
        this.productQuantity = quantity;
    }

    public Long getId(){
        return this.id;
    }

    public Integer getQuantity(){
        return productQuantity;
    }

    public void setQuantity(int number){
        this.productQuantity = number;
    }

    public void setProduct(Product _product){
        this.product = _product;
    }

    public Product getProduct(){
        return this.product;
    }

    public Order getOrder(){
        return this.order;
    }

}
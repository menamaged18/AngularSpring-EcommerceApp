package com.store.ecommerce.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "cart_item")
@Setter
@Getter
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 

    @ManyToOne
    @JoinColumn(name = "cart_id")
    @JsonIgnore
    private Cart cart; 

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product; 

    private LocalDateTime added_at = LocalDateTime.now();

    private Integer productQuantity;

    // cannot intialize Cartitem without cart being exist.
    public CartItem(){}

    public CartItem(CartItem _CartItem){
        this.cart = _CartItem.getCart();
        this.product = _CartItem.getProduct();
        this.productQuantity = _CartItem.getProductQuantity();
    }
}

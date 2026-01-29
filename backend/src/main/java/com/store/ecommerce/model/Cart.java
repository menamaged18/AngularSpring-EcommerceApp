package com.store.ecommerce.model;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "Cart")
@Setter
@Getter
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "customer_id")
    @JsonIgnore
    private CustomUser user;

    private String session_id; // for guest user
    private Double total_cost;
    private LocalDateTime created_at = LocalDateTime.now();
    private LocalDateTime updated_at;
    
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    List<CartItem> cart_Items;

    public Cart(){}

    public Cart(CustomUser _user){
        this.user = _user;
    }

    public void emptyCart() {
        if (this.cart_Items != null) {
            this.cart_Items.clear();
        }
        this.total_cost = 0.0;
    }

}

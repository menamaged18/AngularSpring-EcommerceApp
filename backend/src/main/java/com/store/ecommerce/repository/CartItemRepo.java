package com.store.ecommerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.store.ecommerce.model.Cart;
import com.store.ecommerce.model.CartItem;
import com.store.ecommerce.model.Product;

import jakarta.transaction.Transactional;

@Repository
public interface CartItemRepo extends JpaRepository<CartItem, Long> {
    public void deleteByProduct(Product product);

    @Transactional
    public void deleteByCartAndProduct(Cart cart, Product product);

    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
}

package com.store.ecommerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.store.ecommerce.model.CustomUser;
import com.store.ecommerce.model.Product;
import com.store.ecommerce.model.Wishlist;


@Repository
public interface WishlistRepo extends JpaRepository<Wishlist, Long> {
    public Optional<Wishlist> findByUserAndProduct(CustomUser user, Product product);
    public void deleteByUserAndProduct(CustomUser user, Product product);
    void deleteByUser(CustomUser user);
}

package com.store.ecommerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.store.ecommerce.model.Cart;

@Repository
public interface CartRepo extends JpaRepository<Cart, Long> {
    public Optional<Cart> findByUser_id(Long user_id);
    public void deleteByUser_Id(Long userId);

    @Query("SELECT COALESCE(SUM(ci.product.price * ci.productQuantity), 0) FROM CartItem ci WHERE ci.cart.id = :cartId")
    public Double calculateCartTotal(@Param("cartId") Long cartId);
}

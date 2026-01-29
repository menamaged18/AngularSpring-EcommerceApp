package com.store.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.store.ecommerce.model.CustomUser;
import com.store.ecommerce.model.Reviews;

@Repository
public interface ReviewsRepo extends JpaRepository<Reviews, Long> {
    public List<Reviews> findByUser(CustomUser user);
    void deleteByUser(CustomUser user);
    public List<Reviews> findByProductId(Long productId);

}

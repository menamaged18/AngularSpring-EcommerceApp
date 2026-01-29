package com.store.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.store.ecommerce.model.Product;
import java.util.List;


@Repository
public interface ProductRepo extends JpaRepository<Product,Long>{
    List<Product> findByCategory(String category);
}

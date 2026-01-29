package com.store.ecommerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.store.ecommerce.model.CustomUser;

@Repository
public interface UserRepo extends JpaRepository<CustomUser, Long> {
    Optional<CustomUser> findByEmail(String email);
}

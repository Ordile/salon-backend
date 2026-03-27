package com.salon.salon_backend.repository;

import com.salon.salon_backend.model.AppUser;
import com.salon.salon_backend.model.CartItem;
import com.salon.salon_backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(AppUser user);
    Optional<CartItem> findByUserAndProduct(AppUser user, Product product);
    void deleteByUser(AppUser user);
}

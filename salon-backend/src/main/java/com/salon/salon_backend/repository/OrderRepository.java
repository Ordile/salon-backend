package com.salon.salon_backend.repository;

import com.salon.salon_backend.model.AppUser;
import com.salon.salon_backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(AppUser user);
}

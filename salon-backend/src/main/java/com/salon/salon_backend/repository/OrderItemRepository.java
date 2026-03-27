package com.salon.salon_backend.repository;

import com.salon.salon_backend.model.Order;
import com.salon.salon_backend.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    void deleteByOrder(Order order);
}

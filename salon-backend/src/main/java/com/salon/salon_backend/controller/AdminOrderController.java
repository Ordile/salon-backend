package com.salon.salon_backend.controller;

import com.salon.salon_backend.model.*;
import com.salon.salon_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.temporal.ChronoUnit;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/admin/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminOrderController {

    @Autowired private OrderRepository orderRepo;
    @Autowired private AppUserRepository userRepo;

    // GET tất cả đơn hàng
    @GetMapping
    public ResponseEntity<?> getAllOrders() {
        List<Order> orders = orderRepo.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Order o : orders) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", o.getId());
            m.put("username", o.getUser().getUsername());
            m.put("status", o.getStatus());
            m.put("returnStatus", o.getReturnStatus());
            m.put("paymentMethod", o.getPaymentMethod());
            m.put("totalAmount", o.getTotalAmount());
            m.put("createdAt", o.getCreatedAt().toString());
            m.put("shippingAddress", o.getShippingAddress() != null ? o.getShippingAddress() : "");

            List<Map<String, Object>> itemList = new ArrayList<>();
            if (o.getItems() != null) {
                for (OrderItem oi : o.getItems()) {
                    Map<String, Object> im = new LinkedHashMap<>();
                    im.put("productName", oi.getProduct().getName());
                    im.put("quantity", oi.getQuantity());
                    im.put("price", oi.getPrice());
                    itemList.add(im);
                }
            }
            m.put("items", itemList);
            result.add(m);
        }

        result.sort((a, b) -> b.get("createdAt").toString().compareTo(a.get("createdAt").toString()));
        return ResponseEntity.ok(result);
    }
}

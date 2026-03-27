package com.salon.salon_backend.controller;

import com.salon.salon_backend.model.*;
import com.salon.salon_backend.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    @Autowired private CartItemRepository cartRepo;
    @Autowired private AppUserRepository userRepo;
    @Autowired private ProductRepository productRepo;
    @Autowired private OrderRepository orderRepo;
    @Autowired private OrderItemRepository orderItemRepo;

    private AppUser getUser(Principal principal) {
        return userRepo.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // GET /api/cart
    @GetMapping
    public ResponseEntity<?> getCart(Principal principal) {
        AppUser user = getUser(principal);
        List<CartItem> items = cartRepo.findByUser(user);
        List<Map<String, Object>> result = new ArrayList<>();
        for (CartItem item : items) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", item.getId());
            m.put("quantity", item.getQuantity());
            m.put("productId", item.getProduct().getId());
            m.put("productName", item.getProduct().getName());
            m.put("productPrice", item.getProduct().getPrice());
            m.put("productImage", item.getProduct().getImageUrl());
            result.add(m);
        }
        return ResponseEntity.ok(result);
    }

    // POST /api/cart/add
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Object> body, Principal principal) {
        AppUser user = getUser(principal);
        Long productId = Long.valueOf(body.get("productId").toString());
        int qty = body.containsKey("quantity") ? Integer.parseInt(body.get("quantity").toString()) : 1;

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<CartItem> existing = cartRepo.findByUserAndProduct(user, product);
        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + qty);
            cartRepo.save(item);
        } else {
            cartRepo.save(CartItem.builder().user(user).product(product).quantity(qty).build());
        }
        return ResponseEntity.ok(Map.of("message", "Đã thêm vào giỏ hàng"));
    }

    // PUT /api/cart/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> updateQty(@PathVariable Long id,
                                        @RequestBody Map<String, Object> body,
                                        Principal principal) {
        AppUser user = getUser(principal);
        int qty = Integer.parseInt(body.get("quantity").toString());
        return cartRepo.findById(id).map(item -> {
            if (!item.getUser().getId().equals(user.getId()))
                return ResponseEntity.status(403).<Object>body("Forbidden");
            if (qty <= 0) cartRepo.delete(item);
            else { item.setQuantity(qty); cartRepo.save(item); }
            return ResponseEntity.ok(Map.of("message", "Đã cập nhật"));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/cart/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeItem(@PathVariable Long id, Principal principal) {
        AppUser user = getUser(principal);
        return cartRepo.findById(id).map(item -> {
            if (!item.getUser().getId().equals(user.getId()))
                return ResponseEntity.status(403).<Object>body("Forbidden");
            cartRepo.delete(item);
            return ResponseEntity.ok(Map.of("message", "Đã xóa"));
        }).orElse(ResponseEntity.notFound().build());
    }

    // POST /api/cart/checkout
    @Transactional
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody Map<String, Object> body, Principal principal) {
        try {
            AppUser user = getUser(principal);
            String paymentMethod = body.get("paymentMethod").toString();
            String shippingAddress = body.containsKey("shippingAddress") ? body.get("shippingAddress").toString() : "";

            List<CartItem> cartItems = cartRepo.findByUser(user);
            if (cartItems.isEmpty())
                return ResponseEntity.badRequest().body(Map.of("message", "Giỏ hàng trống"));

            double total = cartItems.stream()
                    .mapToDouble(i -> i.getProduct().getPrice() * i.getQuantity())
                    .sum();

            // Tạo order trước (chưa có items)
            Order order = new Order();
            order.setUser(user);
            order.setPaymentMethod(paymentMethod);
            order.setStatus("PENDING");
            order.setTotalAmount(total);
            order.setCreatedAt(LocalDateTime.now());
            order.setReturnStatus(null);
            order.setShippingAddress(shippingAddress);
            Order savedOrder = orderRepo.save(order);

            // Tạo order items
            List<OrderItem> orderItems = new ArrayList<>();
            for (CartItem ci : cartItems) {
                OrderItem oi = new OrderItem();
                oi.setOrder(savedOrder);
                oi.setProduct(ci.getProduct());
                oi.setQuantity(ci.getQuantity());
                oi.setPrice(ci.getProduct().getPrice());
                orderItems.add(oi);
            }
            savedOrder.setItems(orderItems);
            orderRepo.save(savedOrder);

            // Xóa giỏ hàng
            cartRepo.deleteAll(cartItems);

            Map<String, Object> resp = new LinkedHashMap<>();
            resp.put("message", "Đặt hàng thành công!");
            resp.put("orderId", savedOrder.getId());
            resp.put("total", total);
            resp.put("paymentMethod", paymentMethod);
            resp.put("shippingAddress", shippingAddress);

            // Items để hiển thị hóa đơn ngay
            List<Map<String, Object>> itemsResp = new ArrayList<>();
            for (CartItem ci : cartItems) {
                Map<String, Object> im = new LinkedHashMap<>();
                im.put("productName", ci.getProduct().getName());
                im.put("quantity", ci.getQuantity());
                im.put("price", ci.getProduct().getPrice());
                itemsResp.add(im);
            }
            resp.put("items", itemsResp);
            return ResponseEntity.ok(resp);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Lỗi server: " + e.getMessage()));
        }
    }

    // GET /api/cart/orders
    @GetMapping("/orders")
    public ResponseEntity<?> getOrders(Principal principal) {
        AppUser user = getUser(principal);
        List<Order> orders = orderRepo.findByUser(user);
        List<Map<String, Object>> result = new ArrayList<>();

        for (Order o : orders) {
            // Auto-confirm after 3 days
            if ("PENDING".equals(o.getStatus())) {
                long days = ChronoUnit.DAYS.between(o.getCreatedAt(), LocalDateTime.now());
                if (days >= 3) {
                    o.setStatus("CONFIRMED");
                    orderRepo.save(o);
                }
            }

            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", o.getId());
            m.put("status", o.getStatus());
            m.put("returnStatus", o.getReturnStatus());
            m.put("paymentMethod", o.getPaymentMethod());
            m.put("totalAmount", o.getTotalAmount());
            m.put("createdAt", o.getCreatedAt().toString());
            m.put("shippingAddress", o.getShippingAddress() != null ? o.getShippingAddress() : "");

            long daysSince = ChronoUnit.DAYS.between(o.getCreatedAt(), LocalDateTime.now());
            m.put("canReturn", "CONFIRMED".equals(o.getStatus())
                    && o.getReturnStatus() == null
                    && ChronoUnit.DAYS.between(o.getCreatedAt(), LocalDateTime.now()) <= 7);
            m.put("daysLeft", Math.max(0, 7 - daysSince));

            List<Map<String, Object>> itemList = new ArrayList<>();
            if (o.getItems() != null) {
                for (OrderItem oi : o.getItems()) {
                    Map<String, Object> im = new LinkedHashMap<>();
                    im.put("productName", oi.getProduct().getName());
                    im.put("quantity", oi.getQuantity());
                    im.put("price", oi.getPrice());
                    im.put("productImage", oi.getProduct().getImageUrl());
                    itemList.add(im);
                }
            }
            m.put("items", itemList);
            result.add(m);
        }

        result.sort((a, b) -> b.get("createdAt").toString().compareTo(a.get("createdAt").toString()));
        return ResponseEntity.ok(result);
    }

    // POST /api/cart/orders/{id}/return
    @PostMapping("/orders/{id}/return")
    public ResponseEntity<?> requestReturn(@PathVariable Long id, Principal principal) {
        AppUser user = getUser(principal);
        return orderRepo.findById(id).map(order -> {
            if (!order.getUser().getId().equals(user.getId()))
                return ResponseEntity.status(403).<Object>body(Map.of("message", "Không có quyền"));

            long daysSince = ChronoUnit.DAYS.between(order.getCreatedAt(), LocalDateTime.now());
            if (daysSince > 7)
                return ResponseEntity.badRequest().<Object>body(
                        Map.of("message", "Đã quá 7 ngày, không thể hoàn hàng"));

            if (order.getReturnStatus() != null)
                return ResponseEntity.badRequest().<Object>body(
                        Map.of("message", "Đơn hàng đã được yêu cầu hoàn trước đó"));

            order.setReturnStatus("REQUESTED");
            order.setStatus("RETURNED");
            orderRepo.save(order);
            return ResponseEntity.ok(Map.of(
                    "message", "Yêu cầu hoàn hàng thành công! Chúng tôi sẽ liên hệ trong 24h."));
        }).orElse(ResponseEntity.notFound().build());
    }

    // PUT /api/cart/address
    @PutMapping("/address")
    public ResponseEntity<?> updateAddress(@RequestBody Map<String, Object> body, Principal principal) {
        AppUser user = getUser(principal);
        user.setAddress(body.get("address").toString());
        userRepo.save(user);
        return ResponseEntity.ok(Map.of("message", "Đã cập nhật địa chỉ"));
    }

    // GET /api/cart/address
    @GetMapping("/address")
    public ResponseEntity<?> getAddress(Principal principal) {
        AppUser user = getUser(principal);
        return ResponseEntity.ok(Map.of("address", user.getAddress() != null ? user.getAddress() : ""));
    }

    // DELETE /api/cart/orders/{id} — hủy và xóa đơn PENDING
    @Transactional
    @DeleteMapping("/orders/{id}")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id, Principal principal) {
        AppUser user = getUser(principal);
        return orderRepo.findById(id).map(order -> {
            if (!order.getUser().getId().equals(user.getId()))
                return ResponseEntity.status(403).<Object>body(Map.of("message", "Không có quyền"));
            if (!"PENDING".equals(order.getStatus()))
                return ResponseEntity.badRequest().<Object>body(Map.of("message", "Chỉ có thể hủy đơn đang chờ xử lý"));
            // Xóa items trước để tránh constraint violation
            orderItemRepo.deleteByOrder(order);
            orderItemRepo.flush();
            orderRepo.delete(order);
            return ResponseEntity.ok(Map.of("message", "Đã hủy đơn hàng thành công!"));
        }).orElse(ResponseEntity.notFound().build());
    }
}

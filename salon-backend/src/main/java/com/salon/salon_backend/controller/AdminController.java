package com.salon.salon_backend.controller;

import com.salon.salon_backend.model.AppUser;
import com.salon.salon_backend.model.Product;
import com.salon.salon_backend.model.Role;
import com.salon.salon_backend.repository.AppUserRepository;
import com.salon.salon_backend.repository.ProductRepository;
import com.salon.salon_backend.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private RoleRepository roleRepository;

    // 🧑‍🤝‍🧑 Lấy danh sách khách hàng (ẩn password)
    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getUsers() {
        List<Map<String, Object>> users = appUserRepository.findAll().stream()
            .map(u -> Map.of(
                "id", u.getId(),
                "username", u.getUsername() != null ? u.getUsername() : "",
                "email", u.getEmail() != null ? u.getEmail() : "",
                "address", u.getAddress() != null ? u.getAddress() : "",
                "roles", u.getRoles().stream().map(r -> r.getName()).collect(Collectors.toList())
            ))
            .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    // 🗑️ Xóa tài khoản khách hàng
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (!appUserRepository.existsById(id)) return ResponseEntity.notFound().build();
        appUserRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // ✏️ Cập nhật thông tin + vai trò người dùng
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return appUserRepository.findById(id).map(u -> {
            if (body.containsKey("email")) u.setEmail((String) body.get("email"));
            if (body.containsKey("address")) u.setAddress((String) body.get("address"));
            if (body.containsKey("role")) {
                String raw = (String) body.get("role");
                String roleName = raw.startsWith("ROLE_") ? raw.substring(5) : raw;
                // Không cho hạ cấp nếu đây là admin cuối cùng
                boolean isCurrentlyAdmin = u.getRoles().stream().anyMatch(r -> "ADMIN".equals(r.getName()));
                if (isCurrentlyAdmin && "USER".equals(roleName)) {
                    long adminCount = appUserRepository.findAll().stream()
                        .filter(usr -> usr.getRoles().stream().anyMatch(r -> "ADMIN".equals(r.getName())))
                        .count();
                    if (adminCount <= 1) {
                        return ResponseEntity.badRequest().body("Phải giữ ít nhất 1 tài khoản Admin!");
                    }
                }
                Optional<Role> roleOpt = roleRepository.findByName(roleName);
                if (roleOpt.isEmpty()) return ResponseEntity.badRequest().body("Vai trò không tồn tại: " + roleName);
                u.setRoles(new HashSet<>(Set.of(roleOpt.get())));
            }
            AppUser saved = appUserRepository.save(u);
            return ResponseEntity.ok(Map.of(
                "id", saved.getId(),
                "username", saved.getUsername() != null ? saved.getUsername() : "",
                "email", saved.getEmail() != null ? saved.getEmail() : "",
                "address", saved.getAddress() != null ? saved.getAddress() : "",
                "roles", saved.getRoles().stream().map(Role::getName).collect(Collectors.toList())
            ));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ➕ Thêm người dùng mới
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> body,
                                        org.springframework.security.crypto.password.PasswordEncoder encoder) {
        String username = body.get("username");
        if (username == null || username.isBlank()) return ResponseEntity.badRequest().body("Thiếu username");
        if (appUserRepository.existsByUsername(username)) return ResponseEntity.badRequest().body("Username đã tồn tại");
        String raw = body.getOrDefault("role", "USER");
        String roleName = raw.startsWith("ROLE_") ? raw.substring(5) : raw;
        Optional<Role> roleOpt = roleRepository.findByName(roleName);
        if (roleOpt.isEmpty()) return ResponseEntity.badRequest().body("Vai trò không tồn tại: " + roleName);
        AppUser user = AppUser.builder()
            .username(username)
            .email(body.getOrDefault("email", ""))
            .address(body.getOrDefault("address", ""))
            .password(encoder.encode(body.getOrDefault("password", "123456")))
            .roles(new HashSet<>(Set.of(roleOpt.get())))
            .build();
        AppUser saved = appUserRepository.save(user);
        return ResponseEntity.ok(Map.of(
            "id", saved.getId(),
            "username", saved.getUsername(),
            "email", saved.getEmail() != null ? saved.getEmail() : "",
            "address", saved.getAddress() != null ? saved.getAddress() : "",
            "roles", saved.getRoles().stream().map(Role::getName).collect(Collectors.toList())
        ));
    }

    // 🧩 Lấy tất cả sản phẩm (admin dùng)
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAll() {
        return ResponseEntity.ok(productRepository.findAll());
    }

    // 🧩 Thêm sản phẩm mới
    @PostMapping("/products")
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        Product saved = productRepository.save(product);
        return ResponseEntity.ok(saved);
    }

    // 🧩 Sửa sản phẩm
    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return productRepository.findById(id)
                .map(p -> {
                    p.setName(product.getName());
                    p.setDescription(product.getDescription());
                    p.setPrice(product.getPrice());
                    p.setImageUrl(product.getImageUrl());
                    return ResponseEntity.ok(productRepository.save(p));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 🧩 Xóa sản phẩm
    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (!productRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}

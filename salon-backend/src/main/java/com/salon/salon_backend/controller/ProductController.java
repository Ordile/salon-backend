package com.salon.salon_backend.controller;

import com.salon.salon_backend.model.Product;
import com.salon.salon_backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000") // Cho phép React truy cập
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    // ✅ Ai cũng có thể xem danh sách sản phẩm
    @GetMapping
    public List<Product> getAll() {
        return productRepository.findAll();
    }

    // ✅ Ai cũng có thể xem chi tiết sản phẩm
    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ ADMIN thêm sản phẩm
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product saved = productRepository.save(product);
        return ResponseEntity.ok(saved);
    }

    // ✅ ADMIN cập nhật sản phẩm
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product updated) {
        return productRepository.findById(id)
                .map(product -> {
                    if (updated.getName() != null) product.setName(updated.getName());
                    if (updated.getPrice() != null) product.setPrice(updated.getPrice());
                    if (updated.getDescription() != null) product.setDescription(updated.getDescription());
                    if (updated.getImageUrl() != null) product.setImageUrl(updated.getImageUrl());
                    Product saved = productRepository.save(product);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ ADMIN xóa sản phẩm
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

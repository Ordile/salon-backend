package com.salon.salon_backend.controller;

import com.salon.salon_backend.model.Product;
import com.salon.salon_backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private ProductRepository productRepository;

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

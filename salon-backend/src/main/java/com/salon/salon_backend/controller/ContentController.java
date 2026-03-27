package com.salon.salon_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.nio.file.*;
import java.util.Map;

/**
 * Lưu nội dung động (promo, home-content, service-detail) vào file JSON
 * trong thư mục content/ — đơn giản, không cần thêm bảng DB
 */
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ContentController {

    private static final String CONTENT_DIR = "content/";
    private final ObjectMapper mapper = new ObjectMapper();

    private File getFile(String name) {
        new File(CONTENT_DIR).mkdirs();
        return new File(CONTENT_DIR + name + ".json");
    }

    private Object readJson(String name) {
        try {
            File f = getFile(name);
            if (!f.exists()) return Map.of();
            return mapper.readValue(f, Object.class);
        } catch (Exception e) { return Map.of(); }
    }

    private void writeJson(String name, Object data) throws IOException {
        mapper.writerWithDefaultPrettyPrinter().writeValue(getFile(name), data);
    }

    // ===== PROMO =====
    @GetMapping("/api/promo")
    public ResponseEntity<?> getPromo() { return ResponseEntity.ok(readJson("promo")); }

    @PostMapping("/api/promo")
    public ResponseEntity<?> savePromo(@RequestBody Object body) throws IOException {
        writeJson("promo", body);
        return ResponseEntity.ok(Map.of("message", "Đã lưu khuyến mãi"));
    }

    // ===== HOME CONTENT — services =====
    @GetMapping("/api/home-content/services")
    public ResponseEntity<?> getHomeServices() { return ResponseEntity.ok(readJson("home-services")); }

    @PostMapping("/api/home-content/services")
    public ResponseEntity<?> saveHomeServices(@RequestBody Object body) throws IOException {
        writeJson("home-services", body);
        return ResponseEntity.ok(Map.of("message", "Đã lưu"));
    }

    // ===== HOME CONTENT — albums =====
    @GetMapping("/api/home-content/albums")
    public ResponseEntity<?> getHomeAlbums() { return ResponseEntity.ok(readJson("home-albums")); }

    @PostMapping("/api/home-content/albums")
    public ResponseEntity<?> saveHomeAlbums(@RequestBody Object body) throws IOException {
        writeJson("home-albums", body);
        return ResponseEntity.ok(Map.of("message", "Đã lưu"));
    }

    // ===== SERVICE DETAIL =====
    @GetMapping("/api/service-detail/{category}")
    public ResponseEntity<?> getServiceDetail(@PathVariable String category) {
        return ResponseEntity.ok(readJson("service-" + category));
    }

    @PostMapping("/api/service-detail/{category}")
    public ResponseEntity<?> saveServiceDetail(@PathVariable String category, @RequestBody Object body) throws IOException {
        writeJson("service-" + category, body);
        return ResponseEntity.ok(Map.of("message", "Đã lưu"));
    }
}

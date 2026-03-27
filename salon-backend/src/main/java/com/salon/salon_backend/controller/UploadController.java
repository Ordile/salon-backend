package com.salon.salon_backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "http://localhost:3000")
public class UploadController {

    private static final String UPLOAD_DIR = "uploads/";

    @PostMapping
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file) {
        try {
            // Tạo thư mục nếu chưa có
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) dir.mkdirs();

            // Tên file unique
            String ext = "";
            String original = file.getOriginalFilename();
            if (original != null && original.contains("."))
                ext = original.substring(original.lastIndexOf("."));
            String filename = UUID.randomUUID() + ext;

            Path path = Paths.get(UPLOAD_DIR + filename);
            Files.write(path, file.getBytes());

            String url = "http://localhost:8080/uploads/" + filename;
            return ResponseEntity.ok(Map.of("url", url));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Upload thất bại: " + e.getMessage()));
        }
    }
}

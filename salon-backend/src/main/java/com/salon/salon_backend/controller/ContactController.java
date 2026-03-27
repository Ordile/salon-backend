package com.salon.salon_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.salon.salon_backend.model.Contact;
import com.salon.salon_backend.repository.ContactRepository;

@CrossOrigin(origins = "http://localhost:3000") // ✅ Giới hạn đúng frontend
@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private ContactRepository contactRepository;

    @PostMapping
    public ResponseEntity<?> saveContact(@RequestBody Contact contact) {
        try {
            Contact saved = contactRepository.save(contact);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lưu thông tin thất bại!");
        }
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(contactRepository.findAll());
    }
}

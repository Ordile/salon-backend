package com.salon.salon_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.salon.salon_backend.model.Appointment;
import com.salon.salon_backend.repository.AppointmentRepository;

@CrossOrigin(origins = "http://localhost:3000") // ✅ chỉ cho phép frontend React
@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @PostMapping
    public ResponseEntity<?> saveAppointment(@RequestBody Appointment appointment) {
        try {
            Appointment saved = appointmentRepository.save(appointment);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Đặt lịch thất bại!");
        }
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(appointmentRepository.findAll());
    }
}

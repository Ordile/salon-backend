package com.salon.salon_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.salon.salon_backend.model.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> { }

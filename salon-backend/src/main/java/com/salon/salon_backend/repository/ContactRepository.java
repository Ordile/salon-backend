package com.salon.salon_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.salon.salon_backend.model.Contact;

public interface ContactRepository extends JpaRepository<Contact, Long> { }

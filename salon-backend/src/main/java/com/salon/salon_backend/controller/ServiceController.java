package com.salon.salon_backend.controller;

import com.salon.salon_backend.model.Service;
import com.salon.salon_backend.repository.ServiceRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {
    private final ServiceRepository repo;

    public ServiceController(ServiceRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Service> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Service create(@RequestBody Service s) {
        return repo.save(s);
    }

    @PutMapping("/{id}")
    public Service update(@PathVariable Long id, @RequestBody Service s) {
        s.setId(id);
        return repo.save(s);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
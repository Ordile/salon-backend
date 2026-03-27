package com.salon.salon_backend.config;

import com.salon.salon_backend.model.AppUser;
import com.salon.salon_backend.model.Role;
import com.salon.salon_backend.repository.AppUserRepository;
import com.salon.salon_backend.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(RoleRepository roleRepo, AppUserRepository userRepo, PasswordEncoder encoder) {
        return args -> {
            // ✅ Tạo role nếu chưa có
            Role adminRole = roleRepo.findByName("ADMIN")
                    .orElseGet(() -> roleRepo.save(new Role(null, "ADMIN")));
            Role userRole = roleRepo.findByName("USER")
                    .orElseGet(() -> roleRepo.save(new Role(null, "USER")));

            // ✅ Tạo tài khoản admin mặc định
            if (userRepo.findByUsername("admin").isEmpty()) {
                AppUser admin = new AppUser();
                admin.setUsername("admin");
                admin.setPassword(encoder.encode("123"));
                admin.setEmail("admin@salontoro.com");
                admin.setRoles(Set.of(adminRole));
                userRepo.save(admin);
                System.out.println("✅ Đã tạo tài khoản ADMIN mặc định: admin / 123");
            }
        };
    }
}

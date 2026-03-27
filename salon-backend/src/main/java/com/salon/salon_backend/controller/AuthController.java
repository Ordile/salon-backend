package com.salon.salon_backend.controller;

import com.salon.salon_backend.model.AppUser;
import com.salon.salon_backend.model.Role;
import com.salon.salon_backend.repository.AppUserRepository;
import com.salon.salon_backend.repository.RoleRepository;
import com.salon.salon_backend.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") // cho phép React
public class AuthController {

    @Autowired
    private AppUserRepository userRepo;

    @Autowired
    private RoleRepository roleRepo;

    @Autowired
    private JwtService jwtService;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String email = body.get("email");
        String password = encoder.encode(body.get("password"));

        if (userRepo.existsByUsername(username))
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Tên đăng nhập đã tồn tại!"));

        Role userRole = roleRepo.findByName("USER").orElseGet(() -> {
            Role newRole = new Role();
            newRole.setName("USER");
            return roleRepo.save(newRole);
        });

        AppUser user = AppUser.builder()
                .username(username)
                .email(email)
                .password(password)
                .roles(Collections.singleton(userRole))
                .build();

        userRepo.save(user);
        return ResponseEntity.ok(Map.of("message", "Register successful!"));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        AppUser user = userRepo.findByUsername(username).orElse(null);

        if (user == null || !encoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Sai tên đăng nhập hoặc mật khẩu!"));
        }

        String role = user.getRoles().iterator().next().getName();
        String token = jwtService.generateToken(username, role);

        return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "token", token,
                "role", role,
                "username", username
        ));
    }

    // Quên mật khẩu — xác minh email
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String email = body.get("email");

        AppUser user = userRepo.findByUsername(username).orElse(null);
        if (user == null || !email.equalsIgnoreCase(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Tên đăng nhập hoặc email không đúng!"));
        }
        return ResponseEntity.ok(Map.of("message", "Xác minh thành công!"));
    }

    // Đặt lại mật khẩu
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String email = body.get("email");
        String newPassword = body.get("newPassword");

        AppUser user = userRepo.findByUsername(username).orElse(null);
        if (user == null || !email.equalsIgnoreCase(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Xác minh thất bại!"));
        }
        user.setPassword(encoder.encode(newPassword));
        userRepo.save(user);
        return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công!"));
    }
}

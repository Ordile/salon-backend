package com.salon.salon_backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    // 🔐 KHÓA BÍ MẬT PHẢI >= 32 ký tự (để phù hợp HMAC-SHA256)
    private static final String SECRET_KEY = "12345678901234567890123456789012"; 
    private static final long EXPIRATION_TIME = 1000L * 60 * 60 * 24 * 7; // 7 ngày

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    // ✅ Tạo JWT có username & role
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role) // Ví dụ: ADMIN hoặc USER
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ Giải mã token và trả về Claims
    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // ✅ Lấy username (nếu cần trong các service khác)
    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    // ✅ Lấy role
    public String extractRole(String token) {
        return extractClaims(token).get("role", String.class);
    }

    // ✅ Kiểm tra token hợp lệ
    public boolean isTokenValid(String token) {
        try {
            Claims claims = extractClaims(token);
            Date expiration = claims.getExpiration();
            return expiration.after(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}

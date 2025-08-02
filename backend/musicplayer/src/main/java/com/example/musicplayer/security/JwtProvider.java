package com.example.musicplayer.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtProvider {
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final long expiration = 604800000L; // 7 days in milliseconds

    public String generateToken(String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key)
                .compact();
    }

    public String getEmailFromJWT(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (JwtException e) {
            System.err.println("JWT Parsing Error: " + e.getMessage());
            throw e;
        }
    }

    public boolean validate(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            System.err.println("Token expired: " + e.getMessage());
            return false;
        } catch (JwtException | IllegalArgumentException e) {
            System.err.println("JWT Validation Error: " + e.getMessage());
            return false;
        }
    }
}

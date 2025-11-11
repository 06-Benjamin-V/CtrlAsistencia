package cl.crtl.asistencia.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

// Utilidad para generar y validar tokens JWT
@Component
public class JwtUtil {

    @Value("${JWT_SECRET}")
    private String SECRET_KEY;

    @Value("${JWT_EXPIRATION}")
    private long EXPIRATION_TIME;

    // Genera la clave de firma HMAC desde la clave secreta
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    // Genera un token JWT con el correo, rol y ID del usuario
    public String generateToken(String correo, String rol, Long userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("rol", rol);
        claims.put("userId", userId);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(correo)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Extrae el email del token
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    // Extrae el rol del token
    public String extractRole(String token) {
        return extractAllClaims(token).get("rol", String.class);
    }

    // Extrae el ID del usuario del token
    public Long extractUserId(String token) {
        return extractAllClaims(token).get("userId", Long.class);
    }

    // Verifica si el token ha expirado
    public boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    // Valida que el token sea correcto y no haya expirado
    public boolean validateToken(String token, String correo) {
        return (correo.equals(extractEmail(token)) && !isTokenExpired(token));
    }

    // Extrae todos los claims del token JWT
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
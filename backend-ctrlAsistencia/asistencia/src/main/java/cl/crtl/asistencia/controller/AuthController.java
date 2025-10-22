package cl.crtl.asistencia.controller;

import cl.crtl.asistencia.dto.LoginRequest;
import cl.crtl.asistencia.dto.LoginResponse;
import cl.crtl.asistencia.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.unifiedLogin(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }
    }
}

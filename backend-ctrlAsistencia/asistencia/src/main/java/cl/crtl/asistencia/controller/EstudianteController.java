package cl.crtl.asistencia.controller;

import cl.crtl.asistencia.dto.LoginResponse;
import cl.crtl.asistencia.model.Estudiante;
import cl.crtl.asistencia.service.EstudianteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/estudiante")
@CrossOrigin(origins = "*") // NOSONAR: CORS abierto solo en dev; restringir en prod
@RequiredArgsConstructor
public class EstudianteController {

    private final EstudianteService estudianteService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestParam String correo, @RequestParam String contrasenia) {
        return estudianteService.login(correo, contrasenia)
                .map((Estudiante e) -> {
                    LoginResponse resp = new LoginResponse("OK", "Login exitoso", e.getNombre(), null, "Estudiante");
                    return ResponseEntity.ok(resp);
                })
                .orElseGet(() -> {
                    LoginResponse resp = new LoginResponse("UNAUTHORIZED", "Credenciales inválidas", null, null,null);
                    return ResponseEntity.status(401).body(resp);
                });
    }
}
package cl.crtl.asistencia.controller;

import cl.crtl.asistencia.dto.LoginResponse;
import cl.crtl.asistencia.model.Administrativo;
import cl.crtl.asistencia.service.AdministrativoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/administrativo")
@CrossOrigin(origins = "*") // NOSONAR: CORS abierto sólo en dev; restringir en prod
@RequiredArgsConstructor // genera constructor para los campos final (inyección por constructor)
public class AdministrativoController {

    private final AdministrativoService administrativoService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestParam String correo, @RequestParam String contrasenia) {
        Administrativo admin = administrativoService.login(correo, contrasenia);

        if (admin != null) {
            LoginResponse resp = new LoginResponse("OK", "Login exitoso", admin.getNombre(), null, "Administrativo");
            return ResponseEntity.ok(resp);
        } else {
            LoginResponse resp = new LoginResponse("UNAUTHORIZED", "Credenciales inválidas", null, null,null);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resp);
        }
    }
}

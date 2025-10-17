package cl.crtl.asistencia.controller;

import cl.crtl.asistencia.dto.LoginResponse;
import cl.crtl.asistencia.model.Docente;
import cl.crtl.asistencia.service.DocenteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/docente")
@CrossOrigin(origins = "*") // NOSONAR: CORS abierto solo en dev; restringir en prod
@RequiredArgsConstructor
public class DocenteController {
    private final DocenteService docenteService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestParam String correo, @RequestParam String contrasenia) {
        return docenteService.login(correo, contrasenia)
                .map((Docente d) -> {
                    LoginResponse resp = new LoginResponse("OK", "Login exitoso", d.getNombre(), null, "Docente");
                    return ResponseEntity.ok(resp);
                })
                .orElseGet(() -> {
                    LoginResponse resp = new LoginResponse("UNAUTHORIZED", "Credenciales inválidas", null, null,null);
                    return ResponseEntity.status(401).body(resp);
                });
    }  
}

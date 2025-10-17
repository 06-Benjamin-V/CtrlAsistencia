package cl.crtl.asistencia.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cl.crtl.asistencia.service.EstudianteService;

@RestController
@RequestMapping("/api/estudiante")
@CrossOrigin(origins = "*")// NOSONAR: CORS abierto solo en entorno de desarrollo
public class EstudianteController {
    @Autowired
    private EstudianteService estudianteService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String correo, @RequestParam String contrasenia) {
        return estudianteService.login(correo, contrasenia)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(401).body("Credenciales inválidas"));
    }
}

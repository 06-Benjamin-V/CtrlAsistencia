package cl.crtl.asistencia.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cl.crtl.asistencia.model.Asignatura;
import cl.crtl.asistencia.repository.AsignaturaRepository;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/asignatura")
@RequiredArgsConstructor
public class AsignaturaController {

    private final AsignaturaRepository asignaturaRepository;

    @PostMapping("/crear")
    public ResponseEntity<Asignatura> crear(@RequestBody Asignatura asignatura) {
        return ResponseEntity.ok(asignaturaRepository.save(asignatura));
    }
}

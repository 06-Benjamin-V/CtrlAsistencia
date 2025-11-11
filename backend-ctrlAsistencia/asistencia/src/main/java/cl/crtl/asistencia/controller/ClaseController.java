package cl.crtl.asistencia.controller;

import cl.crtl.asistencia.model.Clase;
import cl.crtl.asistencia.service.ClaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clase")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ClaseController {

    private final ClaseService claseService;

    @GetMapping("/lista")
    public ResponseEntity<List<Clase>> listarTodas() {
        return ResponseEntity.ok(claseService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Clase> obtenerPorId(@PathVariable Long id) {
        Clase clase = claseService.obtenerPorId(id);
        return clase != null ? ResponseEntity.ok(clase) : ResponseEntity.notFound().build();
    }

    @GetMapping("/curso/{idCurso}")
    public ResponseEntity<List<Clase>> listarPorCurso(@PathVariable Long idCurso) {
        return ResponseEntity.ok(claseService.listarPorCurso(idCurso));
    }

    @GetMapping("/docente/{idDocente}")
    public ResponseEntity<List<Clase>> listarPorDocente(@PathVariable Long idDocente) {
        return ResponseEntity.ok(claseService.listarPorDocente(idDocente));
    }

    @PostMapping("/crear")
    public ResponseEntity<Clase> crear(@RequestBody Clase clase) {
        return ResponseEntity.ok(claseService.guardar(clase));
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        claseService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

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
public class ClaseController {

    private final ClaseService claseService;

    @GetMapping("/lista")
    public ResponseEntity<List<Clase>> listar() {
        return ResponseEntity.ok(claseService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Clase> obtenerPorId(@PathVariable Long id) {
        var clase = claseService.obtenerPorId(id);
        return (clase != null) ? ResponseEntity.ok(clase) : ResponseEntity.notFound().build();
    }

    @GetMapping("/curso/{idCurso}")
    public ResponseEntity<List<Clase>> listarPorCurso(@PathVariable Long idCurso) {
        return ResponseEntity.ok(claseService.listarPorCurso(idCurso));
    }

    @GetMapping("/docente/{idDocente}")
    public ResponseEntity<List<Clase>> listarPorDocente(@PathVariable Long idDocente) {
        return ResponseEntity.ok(claseService.listarPorDocente(idDocente));
    }

    @PostMapping("/crear-con-codigo")
    public ResponseEntity<Clase> crearClase(@RequestBody Clase clase,
            @RequestParam(defaultValue = "10") int duracionMinutos) {
        Clase nueva = claseService.crearClaseConCodigo(clase, duracionMinutos);
        return ResponseEntity.ok(nueva);
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        claseService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

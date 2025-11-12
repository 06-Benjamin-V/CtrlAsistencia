package cl.crtl.asistencia.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import cl.crtl.asistencia.dto.AsignaturaDetalleDTO;
import cl.crtl.asistencia.model.Asignatura;
import cl.crtl.asistencia.service.AsignaturaService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/asignatura")
@RequiredArgsConstructor
public class AsignaturaController {

    private final AsignaturaService asignaturaService;

    // Crear una nueva asignatura
    @PostMapping("/crear")
    public ResponseEntity<Asignatura> crear(@RequestBody Asignatura asignatura) {
        return ResponseEntity.ok(asignaturaService.guardar(asignatura));
    }

    // Listar todas las asignaturas
    @GetMapping("/lista")
    public ResponseEntity<List<Asignatura>> listar() {
        return ResponseEntity.ok(asignaturaService.listarTodos());
    }

    // Obtener asignatura por ID
    @GetMapping("/{id}")
    public ResponseEntity<Asignatura> obtenerPorId(@PathVariable Long id) {
        Asignatura asignatura = asignaturaService.obtenerPorId(id);
        return (asignatura != null) ? ResponseEntity.ok(asignatura) : ResponseEntity.notFound().build();
    }

    // Obtener detalle completo de asignatura (docentes, estudiantes, clases)
    @GetMapping("/{id}/detalle")
    public ResponseEntity<AsignaturaDetalleDTO> obtenerDetalle(@PathVariable Long id) {
        AsignaturaDetalleDTO detalle = asignaturaService.obtenerDetalle(id);
        return (detalle != null) ? ResponseEntity.ok(detalle) : ResponseEntity.notFound().build();
    }

    // Actualizar asignatura
    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Asignatura> actualizar(@PathVariable Long id, @RequestBody Asignatura asignatura) {
        Asignatura actualizado = asignaturaService.actualizar(id, asignatura);
        return (actualizado != null) ? ResponseEntity.ok(actualizado) : ResponseEntity.notFound().build();
    }

    // Eliminar asignatura
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        boolean eliminado = asignaturaService.eliminar(id);
        return eliminado ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}

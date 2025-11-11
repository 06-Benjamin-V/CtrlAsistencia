package cl.crtl.asistencia.controller;

import cl.crtl.asistencia.model.Asistencia;
import cl.crtl.asistencia.service.AsistenciaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/asistencia")
@RequiredArgsConstructor
public class AsistenciaController {

    private final AsistenciaService asistenciaService;

    @GetMapping("/lista")
    public ResponseEntity<List<Asistencia>> listar() {
        return ResponseEntity.ok(asistenciaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Asistencia> obtenerPorId(@PathVariable Long id) {
        var asistencia = asistenciaService.obtenerPorId(id);
        return (asistencia != null) ? ResponseEntity.ok(asistencia) : ResponseEntity.notFound().build();
    }

    @PostMapping("/registrar")
    public ResponseEntity<Asistencia> registrar(@RequestBody Asistencia asistencia) {
        return ResponseEntity.ok(asistenciaService.registrarAsistencia(asistencia));
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Asistencia> actualizar(@PathVariable Long id, @RequestBody Asistencia asistencia) {
        asistencia.setIdAsistencia(id);
        return ResponseEntity.ok(asistenciaService.guardar(asistencia));
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        asistenciaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/clase/{idClase}")
    public ResponseEntity<List<Asistencia>> listarPorClase(@PathVariable Long idClase) {
        return ResponseEntity.ok(asistenciaService.listarPorClase(idClase));
    }

    @GetMapping("/estudiante/{idEstudiante}")
    public ResponseEntity<List<Asistencia>> listarPorEstudiante(@PathVariable Long idEstudiante) {
        return ResponseEntity.ok(asistenciaService.listarPorEstudiante(idEstudiante));
    }
}

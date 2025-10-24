package cl.crtl.asistencia.controller;

import cl.crtl.asistencia.model.Matricula;
import cl.crtl.asistencia.service.MatriculaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matricula")
@RequiredArgsConstructor
public class MatriculaController {

    private final MatriculaService matriculaService;

    @GetMapping("/lista")
    public ResponseEntity<List<Matricula>> listar() {
        return ResponseEntity.ok(matriculaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Matricula> obtenerPorId(@PathVariable Long id) {
        var matricula = matriculaService.obtenerPorId(id);
        return (matricula != null) ? ResponseEntity.ok(matricula) : ResponseEntity.notFound().build();
    }

    @GetMapping("/estudiante/{idEstudiante}")
    public ResponseEntity<List<Matricula>> listarPorEstudiante(@PathVariable Long idEstudiante) {
        return ResponseEntity.ok(matriculaService.listarPorEstudiante(idEstudiante));
    }

    @GetMapping("/curso/{idCurso}")
    public ResponseEntity<List<Matricula>> listarPorCurso(@PathVariable Long idCurso) {
        return ResponseEntity.ok(matriculaService.listarPorCurso(idCurso));
    }

    @PostMapping("/crear")
    public ResponseEntity<Matricula> crear(@RequestBody Matricula matricula) {
        return ResponseEntity.ok(matriculaService.inscribirEstudiante(matricula));
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Matricula> actualizar(@PathVariable Long id, @RequestBody Matricula matricula) {
        matricula.setIdMatricula(id);
        return ResponseEntity.ok(matriculaService.guardar(matricula));
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        matriculaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

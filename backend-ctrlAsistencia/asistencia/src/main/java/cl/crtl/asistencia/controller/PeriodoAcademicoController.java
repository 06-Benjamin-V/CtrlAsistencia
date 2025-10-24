package cl.crtl.asistencia.controller;

import cl.crtl.asistencia.model.PeriodoAcademico;
import cl.crtl.asistencia.service.PeriodoAcademicoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/periodo")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PeriodoAcademicoController {

    private final PeriodoAcademicoService periodoService;

    @GetMapping("/lista")
    public ResponseEntity<List<PeriodoAcademico>> listar() {
        return ResponseEntity.ok(periodoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PeriodoAcademico> obtenerPorId(@PathVariable Long id) {
        PeriodoAcademico periodo = periodoService.obtenerPorId(id);
        return (periodo != null) ? ResponseEntity.ok(periodo) : ResponseEntity.notFound().build();
    }

    @PostMapping("/crear")
    public ResponseEntity<PeriodoAcademico> crear(@RequestBody PeriodoAcademico periodo) {
        return ResponseEntity.ok(periodoService.guardar(periodo));
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<PeriodoAcademico> actualizar(@PathVariable Long id, @RequestBody PeriodoAcademico periodo) {
        periodo.setIdPeriodo(id);
        return ResponseEntity.ok(periodoService.guardar(periodo));
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        periodoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

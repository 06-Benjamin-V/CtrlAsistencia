package cl.crtl.asistencia.controller;

import cl.crtl.asistencia.model.Departamento;
import cl.crtl.asistencia.service.DepartamentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departamento")
@RequiredArgsConstructor
public class DepartamentoController {

    private final DepartamentoService departamentoService;

    @GetMapping("/lista")
    public ResponseEntity<List<Departamento>> listar() {
        return ResponseEntity.ok(departamentoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Departamento> obtenerPorId(@PathVariable Long id) {
        Departamento dep = departamentoService.obtenerPorId(id);
        return (dep != null) ? ResponseEntity.ok(dep) : ResponseEntity.notFound().build();
    }

    @PostMapping("/crear")
    public ResponseEntity<Departamento> crear(@RequestBody Departamento departamento) {
        return ResponseEntity.ok(departamentoService.guardar(departamento));
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Departamento> actualizar(
            @PathVariable Long id,
            @RequestBody Departamento departamento) {
        departamento.setIdDepartamento(id);
        return ResponseEntity.ok(departamentoService.guardar(departamento));
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        departamentoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

package cl.crtl.asistencia.controller;

import cl.crtl.asistencia.model.Administrativo;
import cl.crtl.asistencia.service.AdministrativoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/administrativo")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdministrativoController {

    private final AdministrativoService administrativoService;

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("¡Token válido! Eres un administrador autenticado.");
    }

    @GetMapping("/lista")
    public ResponseEntity<List<Administrativo>> listar() {
        return ResponseEntity.ok(administrativoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Administrativo> obtenerPorId(@PathVariable Long id) {
        Administrativo admin = administrativoService.obtenerPorId(id);
        return (admin != null) ? ResponseEntity.ok(admin) : ResponseEntity.notFound().build();
    }

    @PostMapping("/crear")
    public ResponseEntity<Administrativo> crear(@RequestBody Administrativo administrativo) {
        return ResponseEntity.ok(administrativoService.guardar(administrativo));
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Administrativo> actualizar(@PathVariable Long id,
            @RequestBody Administrativo administrativo) {
        Administrativo actualizado = administrativoService.actualizar(id, administrativo);
        return (actualizado != null) ? ResponseEntity.ok(actualizado) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        boolean eliminado = administrativoService.eliminar(id);
        return eliminado ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
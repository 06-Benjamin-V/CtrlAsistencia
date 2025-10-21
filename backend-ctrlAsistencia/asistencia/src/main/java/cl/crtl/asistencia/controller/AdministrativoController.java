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

    // ELIMINA el método login - ya no se usa, ahora es /api/auth/login

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("¡Token válido! Eres un administrador autenticado.");
    }

    @GetMapping("/lista")
    public ResponseEntity<List<Administrativo>> listar() {
        List<Administrativo> lista = administrativoService.listarTodos();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Administrativo> obtenerPorId(@PathVariable Long id) {
        Administrativo admin = administrativoService.obtenerPorId(id);
        if (admin != null) {
            return ResponseEntity.ok(admin);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/crear")
    public ResponseEntity<Administrativo> crear(@RequestBody Administrativo administrativo) {
        Administrativo nuevo = administrativoService.guardar(administrativo);
        return ResponseEntity.ok(nuevo);
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Administrativo> actualizar(@PathVariable Long id, @RequestBody Administrativo administrativo) {
        administrativo.setIdAdministrativo(id);
        Administrativo actualizado = administrativoService.guardar(administrativo);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        administrativoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
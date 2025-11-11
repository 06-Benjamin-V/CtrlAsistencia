package cl.crtl.asistencia.controller;

import cl.crtl.asistencia.model.Carrera;
import cl.crtl.asistencia.service.CarreraService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carrera")
@RequiredArgsConstructor
public class CarreraController {

    private final CarreraService carreraService;

    @GetMapping("/lista")
    public ResponseEntity<List<Carrera>> listar() {
        return ResponseEntity.ok(carreraService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Carrera> obtenerPorId(@PathVariable Long id) {
        Carrera carrera = carreraService.obtenerPorId(id);
        return (carrera != null) ? ResponseEntity.ok(carrera) : ResponseEntity.notFound().build();
    }

    @PostMapping("/crear")
    public ResponseEntity<Carrera> crear(@RequestBody Carrera carrera) {
        return ResponseEntity.ok(carreraService.guardar(carrera));
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Carrera> actualizar(@PathVariable Long id, @RequestBody Carrera carrera) {
        carrera.setIdCarrera(id);
        return ResponseEntity.ok(carreraService.guardar(carrera));
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        carreraService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

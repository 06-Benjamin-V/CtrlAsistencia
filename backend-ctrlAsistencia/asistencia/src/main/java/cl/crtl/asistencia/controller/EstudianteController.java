package cl.crtl.asistencia.controller;

import cl.crtl.asistencia.config.JwtUtil;
import cl.crtl.asistencia.dto.AsignaturaDTO;
import cl.crtl.asistencia.model.Estudiante;
import cl.crtl.asistencia.service.EstudianteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/estudiante")
@RequiredArgsConstructor
public class EstudianteController {

    private final EstudianteService estudianteService;
    private final JwtUtil jwtUtil;

    @PostMapping("/crear")
    public ResponseEntity<Estudiante> crear(@RequestBody Estudiante estudiante) {
        return ResponseEntity.ok(estudianteService.guardar(estudiante));
    }

        @GetMapping("/lista")
    public ResponseEntity<List<Estudiante>> listar() {
        return ResponseEntity.ok(estudianteService.listarTodos());
    }

        @GetMapping("/{id}")
    public ResponseEntity<Estudiante> obtenerPorId(@PathVariable Long id) {
        Estudiante estudiante = estudianteService.obtenerPorId(id);
        return (estudiante != null) ? ResponseEntity.ok(estudiante) : ResponseEntity.notFound().build();
    }
        @PutMapping("/actualizar/{id}")
    public ResponseEntity<Estudiante> actualizar(@PathVariable Long id, @RequestBody Estudiante estudiante) {
        Estudiante actualizado = estudianteService.actualizar(id, estudiante);
        return (actualizado != null) ? ResponseEntity.ok(actualizado) : ResponseEntity.notFound().build();
    }
        @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        boolean eliminado = estudianteService.eliminar(id);
        return eliminado ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
    @GetMapping("/asignaturas")
    public ResponseEntity<List<AsignaturaDTO>> obtenerAsignaturas(HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }

        String token = authHeader.substring(7);
        Long idEstudiante = jwtUtil.extractUserId(token);

        List<AsignaturaDTO> asignaturas = estudianteService.obtenerAsignaturasPorEstudiante(idEstudiante);
        return ResponseEntity.ok(asignaturas);
    }
}

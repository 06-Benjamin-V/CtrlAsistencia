package cl.crtl.asistencia.controller;

import cl.crtl.asistencia.model.Asistencia;
import cl.crtl.asistencia.model.Clase;
import cl.crtl.asistencia.service.AsistenciaService;
import cl.crtl.asistencia.repository.ClaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/asistencia")
@RequiredArgsConstructor
public class AsistenciaController {

    private final AsistenciaService asistenciaService;
    private final ClaseRepository claseRepository;

    // Listar todas las asistencias
    @GetMapping("/lista")
    public ResponseEntity<List<Asistencia>> listar() {
        return ResponseEntity.ok(asistenciaService.listarTodas());
    }

    // Obtener asistencia por ID
    @GetMapping("/{id}")
    public ResponseEntity<Asistencia> obtenerPorId(@PathVariable Long id) {
        var asistencia = asistenciaService.obtenerPorId(id);
        return (asistencia != null)
                ? ResponseEntity.ok(asistencia)
                : ResponseEntity.notFound().build();
    }

    // Registrar asistencia usando código (rol estudiante)
    @PostMapping("/registrar-codigo/{codigo}/{idEstudiante}")
    public ResponseEntity<?> registrarPorCodigo(
            @PathVariable String codigo,
            @PathVariable Long idEstudiante) {
        try {
            boolean exito = asistenciaService.registrarAsistenciaPorCodigo(codigo, idEstudiante);
            if (!exito) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Código inválido o expirado.");
            }

            // Devolver detalles de la clase
            Clase clase = claseRepository.findByCodigoAsistencia(codigo).orElse(null);
            if (clase == null) {
                return ResponseEntity.ok("Asistencia registrada, pero no se encontró la clase.");
            }

            return ResponseEntity.ok(clase);

        } catch (IllegalStateException e) {
            // Ya marcó asistencia en esta clase
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());

        } catch (IllegalArgumentException e) {
            // Código inválido o estudiante no pertenece al curso
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());

        } catch (Exception e) {
            // Error inesperado
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al registrar asistencia.");
        }
    }

    // Actualizar asistencia
    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Asistencia> actualizar(
            @PathVariable Long id,
            @RequestBody Asistencia asistencia) {
        asistencia.setIdAsistencia(id);
        return ResponseEntity.ok(asistenciaService.guardar(asistencia));
    }

    // Eliminar asistencia
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        asistenciaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // Listar asistencias de una clase
    @GetMapping("/clase/{idClase}")
    public ResponseEntity<List<Asistencia>> listarPorClase(@PathVariable Long idClase) {
        return ResponseEntity.ok(asistenciaService.listarPorClase(idClase));
    }

    // Listar asistencias de un estudiante
    @GetMapping("/estudiante/{idEstudiante}")
    public ResponseEntity<List<Asistencia>> listarPorEstudiante(@PathVariable Long idEstudiante) {
        return ResponseEntity.ok(asistenciaService.listarPorEstudiante(idEstudiante));
    }

    // Resumen de una clase (rol docente)
    @GetMapping("/clase/{idClase}/resumen")
    public ResponseEntity<?> obtenerResumenClase(@PathVariable Long idClase) {
        try {
            var resumen = asistenciaService.obtenerResumenClase(idClase);
            return ResponseEntity.ok(resumen);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al obtener resumen de clase.");
        }
    }
}

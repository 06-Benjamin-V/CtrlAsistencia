package cl.crtl.asistencia.controller;

import cl.crtl.asistencia.config.JwtUtil;
import cl.crtl.asistencia.dto.AsignaturaDTO;
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

package cl.crtl.asistencia.controller;

import cl.crtl.asistencia.config.JwtUtil;
import cl.crtl.asistencia.dto.AsignaturaDTO;
import cl.crtl.asistencia.dto.HomeResponse;
import cl.crtl.asistencia.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/usuario")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final JwtUtil jwtUtil;
    private final AdministrativoRepository adminRepo;
    private final DocenteRepository docenteRepo;
    private final EstudianteRepository estudianteRepo;
    private final JdbcTemplate jdbcTemplate;

    @GetMapping("/home")
    public ResponseEntity<HomeResponse> obtenerHome(HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }

        String token = authHeader.substring(7);
        String correo = jwtUtil.extractEmail(token);
        String rol = jwtUtil.extractRole(token);

        HomeResponse response = new HomeResponse();
        response.setRol(rol);

        // ADMINISTRATIVO → todas las asignaturas
        if ("ADMINISTRATIVO".equalsIgnoreCase(rol)) {
            var admin = adminRepo.findByCorreo(correo).orElseThrow();
            response.setNombreCompleto(admin.getNombre() + " " + admin.getApellido());

            String sql = "SELECT a.id_asignatura, a.nombre FROM asignatura a";
            List<AsignaturaDTO> asignaturas = jdbcTemplate.query(
                    sql,
                    (rs, rowNum) -> new AsignaturaDTO(
                            rs.getLong("id_asignatura"),
                            rs.getString("nombre"),
                            null, null, null, null, null));

            response.setAsignaturas(asignaturas);
            return ResponseEntity.ok(response);
        }

        // DOCENTE → asignaturas que imparte
        if ("DOCENTE".equalsIgnoreCase(rol)) {
            var docente = docenteRepo.findByCorreo(correo).orElseThrow();
            response.setNombreCompleto(docente.getNombre() + " " + docente.getApellido());

            String sql = """
                        SELECT a.id_asignatura, a.nombre
                        FROM asignatura a
                        JOIN curso c ON c.id_asignatura = a.id_asignatura
                        WHERE c.id_docente = ?
                    """;
            List<AsignaturaDTO> asignaturas = jdbcTemplate.query(
                    sql,
                    (rs, rowNum) -> new AsignaturaDTO(
                            rs.getLong("id_asignatura"),
                            rs.getString("nombre"),
                            docente.getNombre() + " " + docente.getApellido(),
                            null, null, null, null),
                    docente.getIdDocente());

            response.setAsignaturas(asignaturas);
            return ResponseEntity.ok(response);
        }

        // ESTUDIANTE → asignaturas inscritas
        if ("ESTUDIANTE".equalsIgnoreCase(rol)) {
            var estudiante = estudianteRepo.findByCorreo(correo).orElseThrow();
            response.setNombreCompleto(estudiante.getNombre() + " " + estudiante.getApellido());

            String sql = """
                        SELECT DISTINCT a.id_asignatura, a.nombre
                        FROM asignatura a
                        JOIN curso c ON c.id_asignatura = a.id_asignatura
                        JOIN matricula m ON m.id_curso = c.id
                        WHERE m.id_estudiante = ?
                    """;
            List<AsignaturaDTO> asignaturas = jdbcTemplate.query(
                    sql,
                    (rs, rowNum) -> new AsignaturaDTO(
                            rs.getLong("id_asignatura"),
                            rs.getString("nombre"),
                            null, null, null, null, null),
                    estudiante.getIdEstudiante());

            response.setAsignaturas(asignaturas);
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(403).build();
    }
}

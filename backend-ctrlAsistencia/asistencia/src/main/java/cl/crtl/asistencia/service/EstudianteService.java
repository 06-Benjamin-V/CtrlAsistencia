package cl.crtl.asistencia.service;

import cl.crtl.asistencia.dto.AsignaturaDTO;
import cl.crtl.asistencia.model.Estudiante;
import cl.crtl.asistencia.repository.EstudianteRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EstudianteService {

    private final EstudianteRepository estudianteRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    public List<Estudiante> listarTodos() {
        return estudianteRepository.findAll();
    }

    public Estudiante obtenerPorId(Long id) {
        return estudianteRepository.findById(id).orElse(null);
    }

    public Estudiante guardar(Estudiante estudiante) {
        if (estudiante.getContrasenia() != null &&
                !estudiante.getContrasenia().startsWith("$2")) {
            estudiante.setContrasenia(passwordEncoder.encode(estudiante.getContrasenia()));
        }
        return estudianteRepository.save(estudiante);
    }

    public Estudiante actualizar(Long id, Estudiante estudiante) {
        return estudianteRepository.findById(id)
                .map(existing -> {
                    estudiante.setIdEstudiante(id);
                    if (estudiante.getContrasenia() != null &&
                            !estudiante.getContrasenia().startsWith("$2")) {
                        estudiante.setContrasenia(passwordEncoder.encode(estudiante.getContrasenia()));
                    }
                    return estudianteRepository.save(estudiante);
                })
                .orElse(null);
    }

    public boolean eliminar(Long id) {
        if (estudianteRepository.existsById(id)) {
            estudianteRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<AsignaturaDTO> obtenerAsignaturasPorEstudiante(Long idEstudiante) {
        String sql = """
                    SELECT DISTINCT a.id_asignatura, a.nombre
                    FROM asignatura a
                    JOIN curso c ON c.id_asignatura = a.id_asignatura
                    JOIN matricula m ON m.id_curso = c.id
                    WHERE m.id_estudiante = ?
                """;

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> new AsignaturaDTO(
                        rs.getLong("id_asignatura"),
                        rs.getString("nombre"),
                        null, null, null, null, null),
                idEstudiante);
    }
}

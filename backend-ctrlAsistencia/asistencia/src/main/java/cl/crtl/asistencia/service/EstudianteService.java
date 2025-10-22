package cl.crtl.asistencia.service;

import cl.crtl.asistencia.dto.AsignaturaDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EstudianteService {

    private final JdbcTemplate jdbcTemplate;

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

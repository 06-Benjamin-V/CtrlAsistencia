package cl.crtl.asistencia.repository;

import cl.crtl.asistencia.model.Matricula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MatriculaRepository extends JpaRepository<Matricula, Long> {
    // Buscar matrículas por estudiante
    List<Matricula> findByEstudiante_IdEstudiante(Long idEstudiante);

    // Buscar matrículas por curso
    List<Matricula> findByCurso_IdCurso(Long idCurso);

    // Ver si un estudiante ya está matriculado en un curso
    Optional<Matricula> findByEstudiante_IdEstudianteAndCurso_IdCurso(Long idEstudiante, Long idCurso);
}

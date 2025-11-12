package cl.crtl.asistencia.repository;

import cl.crtl.asistencia.model.Curso;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CursoRepository extends JpaRepository<Curso, Long> {
    List<Curso> findByDocente_IdDocente(Long idDocente);

    List<Curso> findByAsignatura_IdAsignatura(Long idDocente);

}

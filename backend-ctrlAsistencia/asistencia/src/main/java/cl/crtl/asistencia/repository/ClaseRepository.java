package cl.crtl.asistencia.repository;

import cl.crtl.asistencia.model.Clase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaseRepository extends JpaRepository<Clase, Long> {
    // Buscar clases por curso
    List<Clase> findByCurso_IdCurso(Long idCurso);
    List<Clase> findByCurso_Docente_IdDocente(Long idDocente);

}

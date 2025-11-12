package cl.crtl.asistencia.repository;

import cl.crtl.asistencia.model.Asistencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {
    // Buscar asistencias por clase
    List<Asistencia> findByClase_IdClase(Long idClase);

    // Buscar asistencias de un estudiante
    List<Asistencia> findByEstudiante_IdEstudiante(Long idEstudiante);

    boolean existsByClase_IdClaseAndEstudiante_IdEstudiante(Long idClase, Long idEstudiante);
}

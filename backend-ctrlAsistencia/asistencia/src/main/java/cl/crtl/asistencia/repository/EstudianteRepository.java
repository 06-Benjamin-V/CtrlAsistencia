package cl.crtl.asistencia.repository;

import cl.crtl.asistencia.model.Estudiante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface EstudianteRepository extends JpaRepository<Estudiante, Long> {
    Optional<Estudiante> findByRut(String rut);

    Optional<Estudiante> findByCorreo(String correo);

}

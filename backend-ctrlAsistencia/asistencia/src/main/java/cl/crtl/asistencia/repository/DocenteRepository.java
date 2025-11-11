package cl.crtl.asistencia.repository;

import cl.crtl.asistencia.model.Docente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DocenteRepository extends JpaRepository<Docente, Long> {
    Optional<Docente> findByRut(String rut);

    Optional<Docente> findByCorreo(String correo);
}

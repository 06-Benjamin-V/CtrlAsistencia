package cl.crtl.asistencia.repository;

import cl.crtl.asistencia.model.Administrativo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AdministrativoRepository extends JpaRepository<Administrativo, Long> {
    Optional<Administrativo> findByCorreo(String correo);
}

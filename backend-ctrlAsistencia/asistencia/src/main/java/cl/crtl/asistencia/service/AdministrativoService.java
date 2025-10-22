package cl.crtl.asistencia.service;

import cl.crtl.asistencia.model.Administrativo;
import cl.crtl.asistencia.repository.AdministrativoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdministrativoService {

    private final AdministrativoRepository administrativoRepository;
    private final PasswordEncoder passwordEncoder;

    // Buscar por correo (para validaciones o asignaciones)
    public Optional<Administrativo> buscarPorCorreo(String correo) {
        return administrativoRepository.findByCorreo(correo.trim());
    }

    // Listar todos los administrativos
    public List<Administrativo> listarTodos() {
        return administrativoRepository.findAll();
    }

    // Obtener administrativo por ID
    public Administrativo obtenerPorId(Long id) {
        return administrativoRepository.findById(id).orElse(null);
    }

    // Crear o actualizar administrativo (encripta la contraseña si no lo está)
    public Administrativo guardar(Administrativo administrativo) {
        if (administrativo.getContrasenia() != null &&
            !administrativo.getContrasenia().startsWith("$2")) { // si no está hasheada
            administrativo.setContrasenia(passwordEncoder.encode(administrativo.getContrasenia()));
        }
        return administrativoRepository.save(administrativo);
    }

    // Eliminar administrativo por ID
    public void eliminar(Long id) {
        administrativoRepository.deleteById(id);
    }
}

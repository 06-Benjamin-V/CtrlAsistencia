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

    public Optional<Administrativo> buscarPorCorreo(String correo) {
        return administrativoRepository.findByCorreo(correo.trim());
    }

    public List<Administrativo> listarTodos() {
        return administrativoRepository.findAll();
    }

    public Administrativo obtenerPorId(Long id) {
        return administrativoRepository.findById(id).orElse(null);
    }

    public Administrativo guardar(Administrativo administrativo) {
        if (administrativo.getContrasenia() != null &&
                !administrativo.getContrasenia().startsWith("$2")) {
            administrativo.setContrasenia(passwordEncoder.encode(administrativo.getContrasenia()));
        }
        return administrativoRepository.save(administrativo);
    }

    public Administrativo actualizar(Long id, Administrativo administrativo) {
        return administrativoRepository.findById(id)
                .map(existing -> {
                    administrativo.setIdAdministrativo(id);
                    if (administrativo.getContrasenia() != null &&
                            !administrativo.getContrasenia().startsWith("$2")) {
                        administrativo.setContrasenia(passwordEncoder.encode(administrativo.getContrasenia()));
                    }
                    return administrativoRepository.save(administrativo);
                })
                .orElse(null);
    }

    public boolean eliminar(Long id) {
        if (administrativoRepository.existsById(id)) {
            administrativoRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

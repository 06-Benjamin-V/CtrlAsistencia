package cl.crtl.asistencia.service;

import cl.crtl.asistencia.model.Administrativo;
import cl.crtl.asistencia.repository.AdministrativoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AdministrativoService {

    @Autowired
    private AdministrativoRepository administrativoRepository;

    public Administrativo login(String correo, String contrasenia) {
        // Hacer trim para eliminar espacios en blanco
        String correoLimpio = correo != null ? correo.trim() : "";
        String contraseniaLimpia = contrasenia != null ? contrasenia.trim() : "";
        
        Optional<Administrativo> admin = administrativoRepository.findByCorreoAndContrasenia(correoLimpio, contraseniaLimpia);
        return admin.orElse(null);
    }

    public Optional<Administrativo> buscarPorCorreo(String correo) {
        return administrativoRepository.findByCorreo(correo.trim());
    }
}
package cl.crtl.asistencia.service;

import cl.crtl.asistencia.model.Estudiante;
import cl.crtl.asistencia.repository.EstudianteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class EstudianteService {

    @Autowired
    private EstudianteRepository estudianteRepository;

    public Optional<Estudiante> login(String correo, String contrasenia) {
        return estudianteRepository.findByCorreoAndContrasenia(correo, contrasenia);
    }

    public Optional<Estudiante> buscarPorCorreo(String correo) {
        return estudianteRepository.findByCorreo(correo);
    }
}

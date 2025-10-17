package cl.crtl.asistencia.service;

import cl.crtl.asistencia.model.Docente;
import cl.crtl.asistencia.repository.DocenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class DocenteService {

    @Autowired
    private DocenteRepository docenteRepository;

    public Optional<Docente> login(String correo, String contrasenia) {
        return docenteRepository.findByCorreoAndContrasenia(correo, contrasenia);
    }

    public Optional<Docente> buscarPorCorreo(String correo) {
        return docenteRepository.findByCorreo(correo);
    }
}

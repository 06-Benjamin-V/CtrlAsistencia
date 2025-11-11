package cl.crtl.asistencia.service;

import cl.crtl.asistencia.model.Docente;
import cl.crtl.asistencia.repository.DocenteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DocenteService {

    private final DocenteRepository docenteRepository;
    private final PasswordEncoder passwordEncoder;

    public List<Docente> listarTodos() {
        return docenteRepository.findAll();
    }

    public Docente obtenerPorId(Long id) {
        return docenteRepository.findById(id).orElse(null);
    }

    public Docente guardar(Docente docente) {
        if (docente.getContrasenia() != null &&
            !docente.getContrasenia().startsWith("$2")) {
            docente.setContrasenia(passwordEncoder.encode(docente.getContrasenia()));
        }
        return docenteRepository.save(docente);
    }

    public Docente actualizar(Long id, Docente docente) {
        return docenteRepository.findById(id)
                .map(existing -> {
                    docente.setIdDocente(id);
                    if (docente.getContrasenia() != null &&
                        !docente.getContrasenia().startsWith("$2")) {
                        docente.setContrasenia(passwordEncoder.encode(docente.getContrasenia()));
                    }
                    return docenteRepository.save(docente);
                })
                .orElse(null);
    }

    public boolean eliminar(Long id) {
        if (docenteRepository.existsById(id)) {
            docenteRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

package cl.crtl.asistencia.service;

import cl.crtl.asistencia.model.Asignatura;
import cl.crtl.asistencia.repository.AsignaturaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AsignaturaService {

    private final AsignaturaRepository asignaturaRepository;

    public List<Asignatura> listarTodos() {
        return asignaturaRepository.findAll();
    }

    public Asignatura obtenerPorId(Long id) {
        return asignaturaRepository.findById(id).orElse(null);
    }

    public Asignatura guardar(Asignatura asignatura) {
        return asignaturaRepository.save(asignatura);
    }

    public Asignatura actualizar(Long id, Asignatura asignatura) {
        return asignaturaRepository.findById(id)
                .map(existing -> {
                    asignatura.setIdAsignatura(id);
                    return asignaturaRepository.save(asignatura);
                })
                .orElse(null);
    }

    public boolean eliminar(Long id) {
        if (asignaturaRepository.existsById(id)) {
            asignaturaRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

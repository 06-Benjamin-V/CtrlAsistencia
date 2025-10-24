package cl.crtl.asistencia.service;

import cl.crtl.asistencia.model.Clase;
import cl.crtl.asistencia.repository.ClaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClaseService {

    private final ClaseRepository claseRepository;

    public List<Clase> listarTodas() {
        return claseRepository.findAll();
    }

    public Clase obtenerPorId(Long id) {
        return claseRepository.findById(id).orElse(null);
    }

    public List<Clase> listarPorCurso(Long idCurso) {
        return claseRepository.findByCurso_IdCurso(idCurso);
    }

    public Clase guardar(Clase clase) {
        return claseRepository.save(clase);
    }

    public void eliminar(Long id) {
        claseRepository.deleteById(id);
    }
}

package cl.crtl.asistencia.service;

import cl.crtl.asistencia.model.Carrera;
import cl.crtl.asistencia.repository.CarreraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CarreraService {

    private final CarreraRepository carreraRepository;

    public List<Carrera> listarTodas() {
        return carreraRepository.findAll();
    }

    public Carrera obtenerPorId(Long id) {
        return carreraRepository.findById(id).orElse(null);
    }

    public Carrera guardar(Carrera carrera) {
        return carreraRepository.save(carrera);
    }

    public void eliminar(Long id) {
        carreraRepository.deleteById(id);
    }
}

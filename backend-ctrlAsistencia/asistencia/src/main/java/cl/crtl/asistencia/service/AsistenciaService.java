package cl.crtl.asistencia.service;

import cl.crtl.asistencia.model.Asistencia;
import cl.crtl.asistencia.repository.AsistenciaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AsistenciaService {

    private final AsistenciaRepository asistenciaRepository;

    public List<Asistencia> listarTodas() {
        return asistenciaRepository.findAll();
    }

    public Asistencia obtenerPorId(Long id) {
        return asistenciaRepository.findById(id).orElse(null);
    }

    public List<Asistencia> listarPorClase(Long idClase) {
        return asistenciaRepository.findByClase_IdClase(idClase);
    }

    public List<Asistencia> listarPorEstudiante(Long idEstudiante) {
        return asistenciaRepository.findByEstudiante_IdEstudiante(idEstudiante);
    }

    public Asistencia guardar(Asistencia asistencia) {
        return asistenciaRepository.save(asistencia);
    }

    public void eliminar(Long id) {
        asistenciaRepository.deleteById(id);
    }
    public Asistencia registrarAsistencia(Asistencia asistencia) {
    // si quieres setear valores por defecto:
    if (asistencia.getMarcadaEn() == null) {
        asistencia.setMarcadaEn(java.time.LocalDateTime.now());
    }
    return asistenciaRepository.save(asistencia);
}

}

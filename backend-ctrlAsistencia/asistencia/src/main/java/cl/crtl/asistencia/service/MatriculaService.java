package cl.crtl.asistencia.service;

import cl.crtl.asistencia.model.Matricula;
import cl.crtl.asistencia.repository.MatriculaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MatriculaService {

    private final MatriculaRepository matriculaRepository;

    public List<Matricula> listarTodas() {
        return matriculaRepository.findAll();
    }

    public Matricula obtenerPorId(Long id) {
        return matriculaRepository.findById(id).orElse(null);
    }

    public List<Matricula> listarPorEstudiante(Long idEstudiante) {
        return matriculaRepository.findByEstudiante_IdEstudiante(idEstudiante);
    }

    public List<Matricula> listarPorCurso(Long idCurso) {
        return matriculaRepository.findByCurso_IdCurso(idCurso);
    }
    public Matricula guardar(Matricula matricula) {
        if (matricula.getFechaInscripcion() == null) {
            matricula.setFechaInscripcion(LocalDateTime.now());
        }
        if (matricula.getEstado() == null || matricula.getEstado().isBlank()) {
            matricula.setEstado("ACTIVA");
        }
        return matriculaRepository.save(matricula);
    }
    public Matricula inscribirEstudiante(Matricula matricula) {
        var existente = matriculaRepository
                .findByEstudiante_IdEstudianteAndCurso_IdCurso(
                        matricula.getEstudiante().getIdEstudiante(),
                        matricula.getCurso().getIdCurso()
                );
        if (existente.isPresent()) {
            return existente.get();
        }

        matricula.setFechaInscripcion(LocalDateTime.now());
        matricula.setEstado("ACTIVA");
        return matriculaRepository.save(matricula);
    }

    public void eliminar(Long id) {
        matriculaRepository.deleteById(id);
    }
}

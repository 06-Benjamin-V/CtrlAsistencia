package cl.crtl.asistencia.service;

import cl.crtl.asistencia.model.PeriodoAcademico;
import cl.crtl.asistencia.repository.PeriodoAcademicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PeriodoAcademicoService {

    private final PeriodoAcademicoRepository periodoRepository;

    public List<PeriodoAcademico> listarTodos() {
        return periodoRepository.findAll();
    }

    public PeriodoAcademico obtenerPorId(Long id) {
        return periodoRepository.findById(id).orElse(null);
    }

    public PeriodoAcademico guardar(PeriodoAcademico periodo) {
        return periodoRepository.save(periodo);
    }

    public void eliminar(Long id) {
        periodoRepository.deleteById(id);
    }
}

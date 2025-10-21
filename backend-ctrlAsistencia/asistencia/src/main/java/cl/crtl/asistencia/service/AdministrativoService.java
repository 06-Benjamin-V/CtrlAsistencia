package cl.crtl.asistencia.service;

import cl.crtl.asistencia.model.Administrativo;
import cl.crtl.asistencia.repository.AdministrativoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdministrativoService {

    private final AdministrativoRepository administrativoRepository;

    public Optional<Administrativo> buscarPorCorreo(String correo) {
        return administrativoRepository.findByCorreo(correo.trim());
    }

    public List<Administrativo> listarTodos() {
        return administrativoRepository.findAll();
    }

    public Administrativo obtenerPorId(Long id) {
        return administrativoRepository.findById(id).orElse(null);
    }

    public Administrativo guardar(Administrativo administrativo) {
        return administrativoRepository.save(administrativo);
    }

    public void eliminar(Long id) {
        administrativoRepository.deleteById(id);
    }
}
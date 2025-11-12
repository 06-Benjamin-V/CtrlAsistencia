package cl.crtl.asistencia.service;

import cl.crtl.asistencia.model.Clase;
import cl.crtl.asistencia.repository.ClaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

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

    public List<Clase> listarPorDocente(Long idDocente) {
        return claseRepository.findByCurso_Docente_IdDocente(idDocente);
    }

    public Clase guardar(Clase clase) {
        return claseRepository.save(clase);
    }

    public void eliminar(Long id) {
        claseRepository.deleteById(id);
    }

    // ---------------------------------------------------------------
    // ✅ CREAR CLASE CON CÓDIGO Y DURACIÓN
    // ---------------------------------------------------------------
    public Clase crearClaseConCodigo(Clase clase, int duracionMinutos) {
        String codigo = generarCodigoAsistencia();
        LocalDateTime expiracion = LocalDateTime.now().plusMinutes(duracionMinutos);

        clase.setCodigoAsistencia(codigo);
        clase.setCodigoExpiraEn(expiracion);

        return claseRepository.save(clase);
    }

    // ---------------------------------------------------------------
    // ✅ GENERADOR DE CÓDIGOS FORMATO AA1234
    // ---------------------------------------------------------------
    private String generarCodigoAsistencia() {
        Random rand = new Random();
        String letras = "" + (char) ('A' + rand.nextInt(26)) + (char) ('A' + rand.nextInt(26));
        int numeros = rand.nextInt(10000);
        return String.format("%s%04d", letras, numeros);
    }

    // LIMPIAR CÓDIGOS EXPIRADOS AUTOMÁTICAMENTE
    @Transactional
    @Scheduled(fixedRate = 60000) // cada 60 segundos
    public void limpiarCodigosExpirados() {
        LocalDateTime ahora = LocalDateTime.now();
        List<Clase> expiradas = claseRepository.findAll().stream()
                .filter(c -> c.getCodigoExpiraEn() != null && c.getCodigoExpiraEn().isBefore(ahora))
                .toList();

        if (!expiradas.isEmpty()) {
            expiradas.forEach(c -> {
                c.setCodigoAsistencia(null);
                c.setCodigoExpiraEn(null);
            });
            claseRepository.saveAll(expiradas);
            System.out.println("Códigos expirados limpiados: " + expiradas.size());
        }
    }
}

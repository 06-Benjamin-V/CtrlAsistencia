package cl.crtl.asistencia.service;

import cl.crtl.asistencia.model.Asistencia;
import cl.crtl.asistencia.model.Clase;
import cl.crtl.asistencia.model.Estudiante;
import cl.crtl.asistencia.model.Matricula;
import cl.crtl.asistencia.repository.AsistenciaRepository;
import cl.crtl.asistencia.repository.ClaseRepository;
import cl.crtl.asistencia.repository.MatriculaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AsistenciaService {

    private final AsistenciaRepository asistenciaRepository;
    private final ClaseRepository claseRepository;
    private final MatriculaRepository matriculaRepository;

    // MÉTODOS BÁSICOS CRUD
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

    // REGISTRO DE ASISTENCIA (código)
    public boolean registrarAsistenciaPorCodigo(String codigo, Long idEstudiante) {
        Clase clase = claseRepository.findByCodigoAsistencia(codigo).orElse(null);

        if (clase == null || clase.getCodigoExpiraEn() == null ||
                clase.getCodigoExpiraEn().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Código inválido o expirado");
        }

        // Verificar que el estudiante pertenece al curso de la clase
        Long idCurso = clase.getCurso().getIdCurso();
        boolean pertenece = matriculaRepository.existsByCurso_IdCursoAndEstudiante_IdEstudiante(idCurso, idEstudiante);
        if (!pertenece) {
            throw new IllegalArgumentException("El estudiante no pertenece a este curso");
        }

        // Verificar si ya marcó asistencia en esta clase
        boolean yaMarcada = asistenciaRepository.existsByClase_IdClaseAndEstudiante_IdEstudiante(
                clase.getIdClase(), idEstudiante);
        if (yaMarcada) {
            throw new IllegalStateException("El estudiante ya marcó asistencia en esta clase");
        }

        // Registrar asistencia
        Asistencia asistencia = Asistencia.builder()
                .clase(clase)
                .estudiante(Estudiante.builder().idEstudiante(idEstudiante).build())
                .presente(true)
                .justificado(false)
                .fechaRegistro(LocalDateTime.now())
                .build();

        asistenciaRepository.save(asistencia);
        return true;
    }

    // RESUMEN DE CLASE (para el docente)
    public Map<String, Object> obtenerResumenClase(Long idClase) {
        Clase clase = claseRepository.findById(idClase)
                .orElseThrow(() -> new IllegalArgumentException("Clase no encontrada"));

        Long idCurso = clase.getCurso().getIdCurso();

        // 🔹 Todos los estudiantes matriculados al curso
        List<Matricula> matriculas = matriculaRepository.findAll().stream()
                .filter(m -> m.getCurso().getIdCurso().equals(idCurso))
                .collect(Collectors.toList());

        // 🔹 Estudiantes que marcaron asistencia
        List<Asistencia> presentes = asistenciaRepository.findByClase_IdClase(idClase);
        Set<Long> idsPresentes = presentes.stream()
                .map(a -> a.getEstudiante().getIdEstudiante())
                .collect(Collectors.toSet());

        // 🔹 Construir listas de presentes y ausentes
        List<Map<String, Object>> listaPresentes = presentes.stream().map(a -> {
            Map<String, Object> item = new HashMap<>();
            item.put("idEstudiante", a.getEstudiante().getIdEstudiante());
            item.put("nombre", a.getEstudiante().getNombre());
            item.put("apellido", a.getEstudiante().getApellido());
            item.put("rut", a.getEstudiante().getRut());
            item.put("fechaRegistro", a.getFechaRegistro());
            return item;
        }).toList();

        List<Map<String, Object>> listaAusentes = matriculas.stream()
                .filter(m -> !idsPresentes.contains(m.getEstudiante().getIdEstudiante()))
                .map(m -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("idEstudiante", m.getEstudiante().getIdEstudiante());
                    item.put("nombre", m.getEstudiante().getNombre());
                    item.put("apellido", m.getEstudiante().getApellido());
                    item.put("rut", m.getEstudiante().getRut());
                    return item;
                }).toList();

        // 🔹 Armar respuesta completa
        Map<String, Object> resumen = new LinkedHashMap<>();
        resumen.put("idClase", clase.getIdClase());
        resumen.put("tema", clase.getTema());
        resumen.put("fecha", clase.getFecha());
        resumen.put("asignatura", clase.getCurso().getAsignatura().getNombre());
        resumen.put("seccion", clase.getCurso().getSeccion());
        resumen.put("presentes", listaPresentes);
        resumen.put("ausentes", listaAusentes);

        return resumen;
    }
}

package cl.crtl.asistencia.service;

import cl.crtl.asistencia.dto.AsignaturaDetalleDTO;
import cl.crtl.asistencia.model.*;
import cl.crtl.asistencia.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

// Servicio para manejar la lógica de negocio de las asignaturas
@Service
@RequiredArgsConstructor
public class AsignaturaService {

    private final AsignaturaRepository asignaturaRepository;
    private final CursoRepository cursoRepository;
    private final MatriculaRepository matriculaRepository;
    private final ClaseRepository claseRepository;

    // Listar todas las asignaturas
    public List<Asignatura> listarTodos() {
        return asignaturaRepository.findAll();
    }

    // Obtener una asignatura por su ID
    public Asignatura obtenerPorId(Long id) {
        return asignaturaRepository.findById(id).orElse(null);
    }

    // Crear una nueva asignatura
    public Asignatura guardar(Asignatura asignatura) {
        return asignaturaRepository.save(asignatura);
    }

    // Actualizar una asignatura existente
    public Asignatura actualizar(Long id, Asignatura asignatura) {
        return asignaturaRepository.findById(id)
                .map(existing -> {
                    asignatura.setIdAsignatura(id);
                    return asignaturaRepository.save(asignatura);
                })
                .orElse(null);
    }

    // Eliminar una asignatura por su ID
    public boolean eliminar(Long id) {
        if (asignaturaRepository.existsById(id)) {
            asignaturaRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Obtener detalle completo de una asignatura (docentes, estudiantes y clases)
    @Transactional(readOnly = true)
    public AsignaturaDetalleDTO obtenerDetalle(Long idAsignatura) {
        Asignatura asignatura = asignaturaRepository.findById(idAsignatura).orElse(null);
        if (asignatura == null)
            return null;

        AsignaturaDetalleDTO dto = new AsignaturaDetalleDTO();
        dto.setIdAsignatura(asignatura.getIdAsignatura());
        dto.setNombre(asignatura.getNombre());
        dto.setCodigo(asignatura.getCodigo());
        dto.setCreditos(asignatura.getCreditos());
        dto.setDepartamento(asignatura.getDepartamento().getNombre());

        // Buscar cursos asociados a la asignatura
        List<Curso> cursos = cursoRepository.findByAsignatura_IdAsignatura(idAsignatura);

        // Docentes asociados (sin duplicados)
        dto.setDocentes(
                cursos.stream()
                        .map(Curso::getDocente)
                        .filter(Objects::nonNull)
                        .distinct()
                        .map(d -> {
                            AsignaturaDetalleDTO.DocenteInfo info = new AsignaturaDetalleDTO.DocenteInfo();
                            info.setIdDocente(d.getIdDocente());
                            info.setNombre(d.getNombre());
                            info.setApellido(d.getApellido());
                            return info;
                        })
                        .collect(Collectors.toList()));

        // Estudiantes matriculados
        dto.setEstudiantes(
                cursos.stream()
                        .flatMap(c -> matriculaRepository.findByCurso_IdCurso(c.getIdCurso()).stream())
                        .map(Matricula::getEstudiante)
                        .filter(Objects::nonNull)
                        .distinct()
                        .map(e -> {
                            AsignaturaDetalleDTO.EstudianteInfo info = new AsignaturaDetalleDTO.EstudianteInfo();
                            info.setIdEstudiante(e.getIdEstudiante());
                            info.setNombre(e.getNombre());
                            info.setApellido(e.getApellido());
                            info.setRut(e.getRut());
                            return info;
                        })
                        .collect(Collectors.toList()));

        // Clases asociadas
        dto.setClases(
                cursos.stream()
                        .flatMap(c -> claseRepository.findByCurso_IdCurso(c.getIdCurso()).stream())
                        .map(cl -> {
                            AsignaturaDetalleDTO.ClaseInfo info = new AsignaturaDetalleDTO.ClaseInfo();
                            info.setIdClase(cl.getIdClase());
                            info.setTema(cl.getTema());
                            info.setFecha(cl.getFecha().toString());
                            return info;
                        })
                        .collect(Collectors.toList()));

        return dto;
    }
}

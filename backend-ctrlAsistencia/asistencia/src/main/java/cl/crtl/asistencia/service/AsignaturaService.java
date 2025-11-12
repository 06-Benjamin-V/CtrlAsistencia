package cl.crtl.asistencia.service;

import cl.crtl.asistencia.dto.AsignaturaDetalleDTO;
import cl.crtl.asistencia.model.*;
import cl.crtl.asistencia.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

// Servicio con la lógica de negocio de las asignaturas
@Service
@RequiredArgsConstructor
public class AsignaturaService {

    private final AsignaturaRepository asignaturaRepository;
    private final CursoRepository cursoRepository;
    private final MatriculaRepository matriculaRepository;
    private final ClaseRepository claseRepository;
    private final DocenteRepository docenteRepository;
    private final EstudianteRepository estudianteRepository;

    // Listar todas las asignaturas
    public List<Asignatura> listarTodos() {
        return asignaturaRepository.findAll();
    }

    // Obtener una asignatura por ID
    public Asignatura obtenerPorId(Long id) {
        return asignaturaRepository.findById(id).orElse(null);
    }

    // Guardar una nueva asignatura
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

    // Eliminar una asignatura por ID
    public boolean eliminar(Long id) {
        if (asignaturaRepository.existsById(id)) {
            asignaturaRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Obtener detalle completo filtrado según rol
    @Transactional(readOnly = true)
    public AsignaturaDetalleDTO obtenerDetalle(Long idAsignatura) {
        Asignatura asignatura = asignaturaRepository.findById(idAsignatura).orElse(null);
        if (asignatura == null)
            return null;

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        String rol = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("");

        List<Curso> cursosVisibles = obtenerCursosVisibles(idAsignatura, rol, username);
        return construirDetalleDTO(asignatura, cursosVisibles);
    }

    // Determina los cursos visibles para el usuario según su rol
    private List<Curso> obtenerCursosVisibles(Long idAsignatura, String rol, String username) {
        List<Curso> todos = cursoRepository.findByAsignatura_IdAsignatura(idAsignatura);

        if (rol.contains("ADMINISTRATIVO"))
            return todos;

        if (rol.contains("DOCENTE")) {
            return docenteRepository.findByCorreo(username)
                    .map(docente -> todos.stream()
                            .filter(c -> c.getDocente() != null &&
                                    Objects.equals(c.getDocente().getIdDocente(), docente.getIdDocente()))
                            .collect(Collectors.toList()))
                    .orElse(Collections.emptyList());
        }

        if (rol.contains("ESTUDIANTE")) {
            return estudianteRepository.findByCorreo(username)
                    .map(est -> todos.stream()
                            .filter(c -> matriculaRepository
                                    .existsByEstudiante_IdEstudianteAndCurso_IdCurso(
                                            est.getIdEstudiante(), c.getIdCurso()))
                            .collect(Collectors.toList()))
                    .orElse(Collections.emptyList());
        }

        return Collections.emptyList();
    }

    // Construye el DTO del detalle con docentes, estudiantes y clases
    private AsignaturaDetalleDTO construirDetalleDTO(Asignatura asignatura, List<Curso> cursos) {
        AsignaturaDetalleDTO dto = new AsignaturaDetalleDTO();
        dto.setIdAsignatura(asignatura.getIdAsignatura());
        dto.setNombre(asignatura.getNombre());
        dto.setCodigo(asignatura.getCodigo());
        dto.setCreditos(asignatura.getCreditos());
        dto.setDepartamento(asignatura.getDepartamento() != null ? asignatura.getDepartamento().getNombre() : null);

        dto.setDocentes(obtenerDocentesDeCursos(cursos));
        dto.setEstudiantes(obtenerEstudiantesDeCursos(cursos));
        dto.setClases(obtenerClasesDeCursos(cursos));

        return dto;
    }

    // Extrae los docentes de los cursos visibles
    private List<AsignaturaDetalleDTO.DocenteInfo> obtenerDocentesDeCursos(List<Curso> cursos) {
        return cursos.stream()
                .map(Curso::getDocente)
                .filter(Objects::nonNull)
                .collect(Collectors.toMap(
                        Docente::getIdDocente,
                        d -> {
                            AsignaturaDetalleDTO.DocenteInfo info = new AsignaturaDetalleDTO.DocenteInfo();
                            info.setIdDocente(d.getIdDocente());
                            info.setNombre(d.getNombre());
                            info.setApellido(d.getApellido());
                            return info;
                        },
                        (a, b) -> a,
                        LinkedHashMap::new))
                .values()
                .stream()
                .collect(Collectors.toList());
    }

    // Extrae los estudiantes de los cursos visibles
    private List<AsignaturaDetalleDTO.EstudianteInfo> obtenerEstudiantesDeCursos(List<Curso> cursos) {
        return cursos.stream()
                .flatMap(c -> matriculaRepository.findByCurso_IdCurso(c.getIdCurso()).stream())
                .map(Matricula::getEstudiante)
                .filter(Objects::nonNull)
                .collect(Collectors.toMap(
                        Estudiante::getIdEstudiante,
                        e -> {
                            AsignaturaDetalleDTO.EstudianteInfo info = new AsignaturaDetalleDTO.EstudianteInfo();
                            info.setIdEstudiante(e.getIdEstudiante());
                            info.setNombre(e.getNombre());
                            info.setApellido(e.getApellido());
                            info.setRut(e.getRut());
                            return info;
                        },
                        (a, b) -> a,
                        LinkedHashMap::new))
                .values()
                .stream()
                .collect(Collectors.toList());
    }

    // Extrae las clases asociadas a los cursos visibles
    private List<AsignaturaDetalleDTO.ClaseInfo> obtenerClasesDeCursos(List<Curso> cursos) {
        return cursos.stream()
                .flatMap(c -> claseRepository.findByCurso_IdCurso(c.getIdCurso()).stream())
                .map(cl -> {
                    AsignaturaDetalleDTO.ClaseInfo info = new AsignaturaDetalleDTO.ClaseInfo();
                    info.setIdClase(cl.getIdClase());
                    info.setTema(cl.getTema());
                    info.setFecha(cl.getFecha() != null ? cl.getFecha().toString() : null);
                    return info;
                })
                .collect(Collectors.toList());
    }
}

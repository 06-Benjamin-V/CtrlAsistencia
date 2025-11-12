package cl.crtl.asistencia.dto;

import lombok.Data;
import java.util.List;

// DTO para enviar el detalle completo de una asignatura
@Data
public class AsignaturaDetalleDTO {
    private Long idAsignatura;
    private String nombre;
    private String codigo;
    private Integer creditos;
    private String departamento;
    private List<DocenteInfo> docentes;
    private List<EstudianteInfo> estudiantes;
    private List<ClaseInfo> clases;

    @Data
    public static class DocenteInfo {
        private Long idDocente;
        private String nombre;
        private String apellido;
    }

    @Data
    public static class EstudianteInfo {
        private Long idEstudiante;
        private String nombre;
        private String apellido;
        private String rut;
    }

    @Data
    public static class ClaseInfo {
        private Long idClase;
        private String tema;
        private String fecha;
    }
}

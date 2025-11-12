package cl.crtl.asistencia.dto;

import lombok.Data;

@Data
public class ClaseRequest {
    private Long idCurso;
    private String tema;
    private int duracionMinutos;
}

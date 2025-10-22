package cl.crtl.asistencia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AsignaturaDTO {
    private Long id;                    
    private String nombre;               
    private String docente;              
    private Integer totalClases;         
    private Integer asistencias;         
    private Double porcentajeAsistencia; 
    private String estado;               
}

package cl.crtl.asistencia.dto.csv;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EstudianteImportDTO {
    private String nombre;
    private String apellido;
    private String rut;
    private String correo;
    private Long idCarrera;
}
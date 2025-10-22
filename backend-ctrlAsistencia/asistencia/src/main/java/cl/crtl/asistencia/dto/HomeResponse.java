package cl.crtl.asistencia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HomeResponse {
    private String nombreCompleto;
    private String rol;
    private List<AsignaturaDTO> asignaturas;
}

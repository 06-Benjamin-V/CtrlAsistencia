package cl.crtl.asistencia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ClaseResponse {
    private Long idClase;
    private String codigoAsistencia;
    private LocalDateTime expiraEn;
    private long segundosRestantes;
}

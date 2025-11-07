package cl.crtl.asistencia.dto.csv;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImportRowResult<T> {
    private T data;
    private boolean valido;
    private String mensaje;
    private String carreraNombre; // ✅ debe existir
}

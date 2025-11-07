package cl.crtl.asistencia.controller.csv;

import cl.crtl.asistencia.dto.csv.EstudianteImportDTO;
import cl.crtl.asistencia.dto.csv.ImportRowResult;
import cl.crtl.asistencia.service.csv.CsvEstudianteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/api/csv/estudiantes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CsvEstudianteController {

    private final CsvEstudianteService csvEstudianteService;

    @PostMapping("/preview")
    public ResponseEntity<?> preview(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(csvEstudianteService.previewCsv(file));
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validate(@RequestBody EstudianteImportDTO dto) {
        String val = csvEstudianteService.validarEdicion(dto);

        Map<String, Object> r = new HashMap<>();
        r.put("valido", val == null);
        r.put("mensaje", val == null ? "OK" : val);

        return ResponseEntity.ok(r);
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirm(@RequestBody List<EstudianteImportDTO> lista) {
        try {
            csvEstudianteService.confirmImport(lista);
            return ResponseEntity.ok(Map.of("ok", true, "mensaje", "Importación exitosa"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "ok", false,
                    "error", e.getMessage()));
        }
    }

}

package cl.crtl.asistencia.controller.csv;

import cl.crtl.asistencia.dto.csv.DocenteImportDTO;
import cl.crtl.asistencia.dto.csv.ImportRowResult;
import cl.crtl.asistencia.service.csv.CsvDocenteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/csv/docentes")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class CsvDocenteController {

    private final CsvDocenteService csvDocenteService;

    // ✅ Vista previa del CSV
    @PostMapping("/preview")
    public ResponseEntity<List<ImportRowResult<DocenteImportDTO>>> preview(
            @RequestParam("file") MultipartFile file) {

        return ResponseEntity.ok(csvDocenteService.previewCsv(file));
    }

    // ✅ Validación fila por fila al editar manualmente
    @PostMapping("/validate")
    public ResponseEntity<?> validate(@RequestBody DocenteImportDTO dto) {
        String val = csvDocenteService.validarEdicion(dto);
        return ResponseEntity.ok(
                Map.of(
                        "valido", val == null,
                        "mensaje", val == null ? "OK" : val));
    }

    // ✅ Confirmar importación final
    @PostMapping("/confirm")
    public ResponseEntity<?> confirm(@RequestBody List<DocenteImportDTO> lista) {
        try {
            csvDocenteService.confirmImport(lista);

            return ResponseEntity.ok(
                    Map.of(
                            "ok", true,
                            "mensaje", "Importación exitosa"));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "ok", false,
                            "error", e.getMessage()));
        }
    }
}

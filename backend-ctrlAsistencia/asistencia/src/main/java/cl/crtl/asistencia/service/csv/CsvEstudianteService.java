package cl.crtl.asistencia.service.csv;

import cl.crtl.asistencia.dto.csv.EstudianteImportDTO;
import cl.crtl.asistencia.dto.csv.ImportRowResult;
import cl.crtl.asistencia.model.Carrera;
import cl.crtl.asistencia.model.Estudiante;
import cl.crtl.asistencia.repository.EstudianteRepository;
import cl.crtl.asistencia.repository.CarreraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.opencsv.CSVReader;

import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CsvEstudianteService {

    private final EstudianteRepository estudianteRepo;
    private final CarreraRepository carreraRepo;
    private final PasswordEncoder encoder;

    // ---------------- PREVIEW CSV ----------------
    public List<ImportRowResult<EstudianteImportDTO>> previewCsv(MultipartFile file) {
        List<ImportRowResult<EstudianteImportDTO>> list = new ArrayList<>();

        try (CSVReader csv = new CSVReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            csv.readNext(); // saltar cabecera
            String[] row;

            while ((row = csv.readNext()) != null) {
                EstudianteImportDTO dto = new EstudianteImportDTO(
                        col(row, 0),
                        col(row, 1),
                        col(row, 2),
                        col(row, 3),
                        null);

                String validation = validar(dto);
                list.add(new ImportRowResult<>(dto, validation == null, validation == null ? "OK" : validation));
            }

        } catch (Exception e) {
            throw new RuntimeException("Error procesando CSV: " + e.getMessage());
        }

        return list;
    }

    // ---------------- VALIDACIONES ----------------
    public String validarEdicion(EstudianteImportDTO dto) {
        return validar(dto);
    }

    private String validar(EstudianteImportDTO dto) {

        if (dto.getNombre().isBlank() || dto.getApellido().isBlank() ||
                dto.getRut().isBlank() || dto.getCorreo().isBlank())
            return "Campos obligatorios vacíos";

        if (!dto.getCorreo().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$"))
            return "Correo inválido";

        if (!dto.getRut().matches("^[0-9]+-[0-9kK]$"))
            return "RUT inválido";

        return null;
    }

    private String col(String[] row, int i) {
        return row.length > i ? row[i].trim() : "";
    }

    // ---------------- CONFIRM IMPORT ----------------
    public void confirmImport(List<EstudianteImportDTO> lista) {

        for (EstudianteImportDTO dto : lista) {

            // Validar carrera seleccionada
            if (dto.getIdCarrera() == null) {
                throw new RuntimeException("Debe seleccionar una carrera para " + dto.getNombre());
            }

            Carrera carrera = carreraRepo.findById(dto.getIdCarrera())
                    .orElseThrow(() -> new RuntimeException("Carrera no válida para " + dto.getNombre()));

            // Validar duplicado por RUT
            if (estudianteRepo.findByRut(dto.getRut()).isPresent()) {
                throw new RuntimeException("El estudiante con RUT " + dto.getRut() + " ya existe");
            }

            // Validar duplicado por Correo
            if (estudianteRepo.findByCorreo(dto.getCorreo()).isPresent()) {
                throw new RuntimeException("El estudiante con correo " + dto.getCorreo() + " ya existe");
            }

            Estudiante estudiante = Estudiante.builder()
                    .nombre(dto.getNombre())
                    .apellido(dto.getApellido())
                    .rut(dto.getRut())
                    .correo(dto.getCorreo())
                    .contrasenia(encoder.encode("123456"))
                    .carrera(carrera)
                    .activo(true)
                    .build();

            estudianteRepo.save(estudiante);
        }
    }

}

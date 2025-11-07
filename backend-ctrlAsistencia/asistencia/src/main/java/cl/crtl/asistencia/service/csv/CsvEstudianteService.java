package cl.crtl.asistencia.service.csv;

import cl.crtl.asistencia.dto.csv.EstudianteImportDTO;
import cl.crtl.asistencia.dto.csv.ImportRowResult;
import cl.crtl.asistencia.model.Carrera;
import cl.crtl.asistencia.model.Estudiante;
import cl.crtl.asistencia.repository.CarreraRepository;
import cl.crtl.asistencia.repository.EstudianteRepository;
import com.opencsv.CSVReader;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CsvEstudianteService {

    private final EstudianteRepository estudianteRepo;
    private final CarreraRepository carreraRepo;
    private final PasswordEncoder encoder;

    // =============== PREVIEW ===============
    public List<ImportRowResult<EstudianteImportDTO>> previewCsv(MultipartFile file) {
        List<ImportRowResult<EstudianteImportDTO>> results = new ArrayList<>();
        Set<String> rutsVistos = new HashSet<>();
        Set<String> correosVistos = new HashSet<>();

        try (CSVReader csv = new CSVReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            csv.readNext();
            String[] row;

            while ((row = csv.readNext()) != null) {
                Long idCarrera = null;
                try {
                    idCarrera = Long.parseLong(col(row, 4));
                } catch (Exception ignored) {
                }

                EstudianteImportDTO dto = new EstudianteImportDTO(
                        col(row, 0),
                        col(row, 1),
                        col(row, 2), // ahora NO normalizamos ni validamos formato
                        col(row, 3),
                        idCarrera);

                String error = validar(dto, rutsVistos, correosVistos);

                if (error == null) {
                    if (dto.getRut() != null)
                        rutsVistos.add(dto.getRut());
                    if (dto.getCorreo() != null)
                        correosVistos.add(dto.getCorreo());
                }

                String carreraNombre = carreraNombre(dto.getIdCarrera());

                results.add(new ImportRowResult<>(
                        dto,
                        error == null,
                        error == null ? "✅ OK" : error,
                        carreraNombre));
            }
        } catch (Exception e) {
            throw new RuntimeException("Error leyendo CSV: " + e.getMessage());
        }

        return results;
    }

    public String validarEdicion(EstudianteImportDTO dto) {
        return validar(dto, new HashSet<>(), new HashSet<>());
    }

    // =============== CONFIRM IMPORTACIÓN ===============
    public void confirmImport(List<EstudianteImportDTO> lista) {
        for (EstudianteImportDTO dto : lista) {
            String err = validar(dto, new HashSet<>(), new HashSet<>());
            if (err != null)
                throw new RuntimeException(err);

            Carrera carrera = carreraRepo.findById(dto.getIdCarrera())
                    .orElseThrow(() -> new RuntimeException("Carrera no válida para " + dto.getNombre()));

            Estudiante e = Estudiante.builder()
                    .nombre(dto.getNombre())
                    .apellido(dto.getApellido())
                    .rut(dto.getRut())
                    .correo(dto.getCorreo())
                    .contrasenia(encoder.encode("123456"))
                    .carrera(carrera)
                    .activo(true)
                    .build();

            estudianteRepo.save(e);
        }
    }

    // =============== VALIDACIONES ===============
    private String validar(EstudianteImportDTO dto, Set<String> rutsVistos, Set<String> correosVistos) {
        if (isBlank(dto.getNombre()) || isBlank(dto.getApellido()) ||
                isBlank(dto.getRut()) || isBlank(dto.getCorreo())) {
            return "❌ Campos obligatorios vacíos";
        }

        if (!dto.getCorreo().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$"))
            return "❌ Correo inválido";

        if (dto.getIdCarrera() == null)
            return "❌ Carrera no indicada";

        if (carreraRepo.findById(dto.getIdCarrera()).isEmpty())
            return "❌ Carrera no existe";

        // Duplicados dentro del CSV
        if (rutsVistos.contains(dto.getRut()))
            return "❌ RUT duplicado en archivo";

        if (correosVistos.contains(dto.getCorreo()))
            return "❌ Correo duplicado en archivo";

        // Duplicados en BD
        if (estudianteRepo.findByRut(dto.getRut()).isPresent())
            return "❌ RUT ya existe en sistema";

        if (estudianteRepo.findByCorreo(dto.getCorreo()).isPresent())
            return "❌ Correo ya existe en sistema";

        return null;
    }

    private String carreraNombre(Long id) {
        if (id == null)
            return "—";
        return carreraRepo.findById(id).map(Carrera::getNombre).orElse("No encontrada");
    }

    private String col(String[] row, int i) {
        return row.length > i ? row[i].trim() : "";
    }

    private boolean isBlank(String s) {
        return s == null || s.isBlank();
    }
}

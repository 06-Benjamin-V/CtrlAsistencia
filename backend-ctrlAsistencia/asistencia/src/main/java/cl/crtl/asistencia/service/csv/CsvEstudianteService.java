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

    public List<ImportRowResult<EstudianteImportDTO>> previewCsv(MultipartFile file) {
        List<ImportRowResult<EstudianteImportDTO>> results = new ArrayList<>();
        Set<String> rutsVistos = new HashSet<>();
        Set<String> correosVistos = new HashSet<>();

        try (CSVReader csv = new CSVReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            csv.readNext();
            String[] row;

            while ((row = csv.readNext()) != null) {

                Long idCarrera = null;
                try { idCarrera = Long.parseLong(col(row, 4)); } catch (Exception ignored) {}

                EstudianteImportDTO dto = new EstudianteImportDTO(
                        col(row, 0),
                        col(row, 1),
                        col(row, 2),
                        col(row, 3),
                        idCarrera
                );

                String error = validar(dto, rutsVistos, correosVistos);

                if (error == null) {
                    rutsVistos.add(dto.getRut());
                    correosVistos.add(dto.getCorreo());
                }

                String carreraNombre = carreraNombre(dto.getIdCarrera());

                results.add(new ImportRowResult<>(
                        dto,
                        error == null,
                        error == null ? "OK" : error,
                        carreraNombre
                ));
            }
        } catch (Exception e) {
            throw new RuntimeException("Error leyendo CSV: " + e.getMessage());
        }
        return results;
    }

    public String validarEdicion(EstudianteImportDTO dto) {
        return validar(dto, new HashSet<>(), new HashSet<>());
    }

    public void confirmImport(List<EstudianteImportDTO> lista) {
        for (EstudianteImportDTO dto : lista) {
            String err = validar(dto, new HashSet<>(), new HashSet<>());
            if (err != null) throw new RuntimeException(err);

            Carrera carrera = carreraRepo.findById(dto.getIdCarrera())
                    .orElseThrow(() -> new RuntimeException("Carrera no valida"));

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

    private String validar(EstudianteImportDTO dto, Set<String> rutsVistos, Set<String> correosVistos) {

        if (blank(dto.getNombre()) || blank(dto.getApellido()) ||
                blank(dto.getRut()) || blank(dto.getCorreo())) {
            return "Campos obligatorios vacios";
        }

        if (!dto.getCorreo().matches("^[A-Za-z0-9+_.-]+@(ufromail|ufrontera)\\.(cl|com)$"))
            return "Correo no permitido";

        if (!dto.getRut().contains("-")) return "Formato RUT incorrecto";

        String[] partes = dto.getRut().split("-");
        if (partes.length != 2) return "Formato RUT incorrecto";

        if (!partes[0].matches("^[0-9]{8}$"))
            return "RUT debe tener 8 numeros";

        if (!partes[1].matches("^[0-9Kk]$"))
            return "DV debe ser numero o K";

        if (dto.getIdCarrera() == null) return "Carrera requerida";
        if (carreraRepo.findById(dto.getIdCarrera()).isEmpty()) return "Carrera no existe";

        if (rutsVistos.contains(dto.getRut())) return "RUT repetido en archivo";
        if (correosVistos.contains(dto.getCorreo())) return "Correo repetido en archivo";

        if (estudianteRepo.findByRut(dto.getRut()).isPresent()) return "RUT ya existe";
        if (estudianteRepo.findByCorreo(dto.getCorreo()).isPresent()) return "Correo ya existe";

        return null;
    }

    private String carreraNombre(Long id) {
        if (id == null) return "";
        return carreraRepo.findById(id).map(Carrera::getNombre).orElse("");
    }

    private String col(String[] row, int i) {
        return row.length > i ? row[i].trim() : "";
    }

    private boolean blank(String s) {
        return s == null || s.isBlank();
    }
}

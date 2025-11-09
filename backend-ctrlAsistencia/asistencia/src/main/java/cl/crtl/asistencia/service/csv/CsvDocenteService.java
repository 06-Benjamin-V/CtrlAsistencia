package cl.crtl.asistencia.service.csv;

import cl.crtl.asistencia.dto.csv.DocenteImportDTO;
import cl.crtl.asistencia.dto.csv.ImportRowResult;
import cl.crtl.asistencia.model.Departamento;
import cl.crtl.asistencia.model.Docente;
import cl.crtl.asistencia.repository.DepartamentoRepository;
import cl.crtl.asistencia.repository.DocenteRepository;
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
public class CsvDocenteService {

    private final DocenteRepository docenteRepo;
    private final DepartamentoRepository departamentoRepo;
    private final PasswordEncoder encoder;

    public List<ImportRowResult<DocenteImportDTO>> previewCsv(MultipartFile file) {
        List<ImportRowResult<DocenteImportDTO>> results = new ArrayList<>();
        Set<String> rutsVistos = new HashSet<>();
        Set<String> correosVistos = new HashSet<>();

        try (CSVReader csv = new CSVReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            csv.readNext();
            String[] row;

            while ((row = csv.readNext()) != null) {

                Long idDepartamento = null;
                try {
                    idDepartamento = Long.parseLong(col(row, 4));
                } catch (Exception ignored) {
                }

                // ✅ ahora leemos contraseña desde la columna 5
                String contrasenia = row.length > 5 ? col(row, 5) : "";

                DocenteImportDTO dto = new DocenteImportDTO(
                        col(row, 0),
                        col(row, 1),
                        col(row, 2),
                        col(row, 3),
                        idDepartamento,
                        contrasenia);

                String error = validar(dto, rutsVistos, correosVistos);

                if (error == null) {
                    rutsVistos.add(dto.getRut());
                    correosVistos.add(dto.getCorreo());
                }

                String departamentoNombre = departamentoNombre(dto.getIdDepartamento());

                results.add(new ImportRowResult<>(
                        dto,
                        error == null,
                        error == null ? "OK" : error,
                        departamentoNombre));
            }
        } catch (Exception e) {
            throw new RuntimeException("Error leyendo CSV: " + e.getMessage());
        }
        return results;
    }

    public String validarEdicion(DocenteImportDTO dto) {
        return validar(dto, new HashSet<>(), new HashSet<>());
    }

    public void confirmImport(List<DocenteImportDTO> lista) {
        for (DocenteImportDTO dto : lista) {
            String err = validar(dto, new HashSet<>(), new HashSet<>());
            if (err != null)
                throw new RuntimeException(err);

            Departamento d = departamentoRepo.findById(dto.getIdDepartamento())
                    .orElseThrow(() -> new RuntimeException("Departamento no válido"));

            // ✅ Guardar contraseña cifrada
            Docente doc = Docente.builder()
                    .nombre(dto.getNombre())
                    .apellido(dto.getApellido())
                    .rut(dto.getRut())
                    .correo(dto.getCorreo())
                    .contrasenia(encoder.encode(dto.getContrasenia()))
                    .departamento(d)
                    .activo(true)
                    .build();

            docenteRepo.save(doc);
        }
    }

    private String validar(DocenteImportDTO dto, Set<String> rutsVistos, Set<String> correosVistos) {

        if (blank(dto.getNombre()) || blank(dto.getApellido()) ||
                blank(dto.getRut()) || blank(dto.getCorreo()) || blank(dto.getContrasenia())) {

            return "Campos obligatorios vacíos";
        }

        if (!dto.getCorreo().matches("^[A-Za-z0-9+_.-]+@(ufromail|ufrontera)\\.(cl|com)$"))
            return "Correo no permitido";

        if (!dto.getRut().contains("-"))
            return "Formato RUT incorrecto";

        String[] partes = dto.getRut().split("-");
        if (partes.length != 2)
            return "Formato RUT incorrecto";

        if (!partes[0].matches("^[0-9]{8}$"))
            return "RUT debe tener 8 números";

        if (!partes[1].matches("^[0-9Kk]$"))
            return "DV debe ser número o K";

        if (dto.getIdDepartamento() == null)
            return "Departamento requerido";
        if (departamentoRepo.findById(dto.getIdDepartamento()).isEmpty())
            return "Departamento no existe";

        if (rutsVistos.contains(dto.getRut()))
            return "RUT repetido en archivo";
        if (correosVistos.contains(dto.getCorreo()))
            return "Correo repetido en archivo";

        if (docenteRepo.findByRut(dto.getRut()).isPresent())
            return "RUT ya existe";
        if (docenteRepo.findByCorreo(dto.getCorreo()).isPresent())
            return "Correo ya existe";

        return null;
    }

    private String departamentoNombre(Long id) {
        if (id == null)
            return "";
        return departamentoRepo.findById(id).map(Departamento::getNombre).orElse("");
    }

    private String col(String[] row, int i) {
        return row.length > i ? row[i].trim() : "";
    }

    private boolean blank(String s) {
        return s == null || s.isBlank();
    }
}

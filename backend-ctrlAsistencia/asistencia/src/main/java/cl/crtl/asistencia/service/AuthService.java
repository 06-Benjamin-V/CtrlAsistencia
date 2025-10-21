package cl.crtl.asistencia.service;

import cl.crtl.asistencia.config.JwtUtil;
import cl.crtl.asistencia.dto.LoginRequest;
import cl.crtl.asistencia.dto.LoginResponse;
import cl.crtl.asistencia.model.Administrativo;
import cl.crtl.asistencia.model.Docente;
import cl.crtl.asistencia.model.Estudiante;
import cl.crtl.asistencia.repository.AdministrativoRepository;
import cl.crtl.asistencia.repository.DocenteRepository;
import cl.crtl.asistencia.repository.EstudianteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final EstudianteRepository estudianteRepository;
    private final DocenteRepository docenteRepository;
    private final AdministrativoRepository administrativoRepository;
    private final JwtUtil jwtUtil;

    public LoginResponse unifiedLogin(LoginRequest request) {
        // Buscar en Estudiante
        Optional<Estudiante> estudiante = estudianteRepository.findByCorreo(request.getCorreo());
        if (estudiante.isPresent()) {
            if (estudiante.get().getContrasenia().equals(request.getContrasenia())) {
                String token = jwtUtil.generateToken(
                    estudiante.get().getCorreo(),
                    "ESTUDIANTE",
                    estudiante.get().getIdEstudiante()
                );
                return new LoginResponse(
                    "success",
                    "Login exitoso",
                    estudiante.get().getNombre() + " " + estudiante.get().getApellido(),
                    token,
                    "ESTUDIANTE"
                );
            } else {
                return new LoginResponse("error", "Contraseña incorrecta", null, null, null);
            }
        }

        // Buscar en Docente
        Optional<Docente> docente = docenteRepository.findByCorreo(request.getCorreo());
        if (docente.isPresent()) {
            if (docente.get().getContrasenia().equals(request.getContrasenia())) {
                String token = jwtUtil.generateToken(
                    docente.get().getCorreo(),
                    "DOCENTE",
                    docente.get().getIdDocente()
                );
                return new LoginResponse(
                    "success",
                    "Login exitoso",
                    docente.get().getNombre() + " " + docente.get().getApellido(),
                    token,
                    "DOCENTE"
                );
            } else {
                return new LoginResponse("error", "Contraseña incorrecta", null, null, null);
            }
        }

        // Buscar en Administrativo
        Optional<Administrativo> administrativo = administrativoRepository.findByCorreo(request.getCorreo());
        if (administrativo.isPresent()) {
            if (administrativo.get().getContrasenia().equals(request.getContrasenia())) {
                String token = jwtUtil.generateToken(
                    administrativo.get().getCorreo(),
                    "ADMINISTRATIVO",
                    administrativo.get().getIdAdministrativo()
                );
                return new LoginResponse(
                    "success",
                    "Login exitoso",
                    administrativo.get().getNombre() + " " + administrativo.get().getApellido(),
                    token,
                    "ADMINISTRATIVO"
                );
            } else {
                return new LoginResponse("error", "Contraseña incorrecta", null, null, null);
            }
        }

        // Usuario no encontrado
        return new LoginResponse("error", "Usuario no encontrado", null, null, null);
    }
}
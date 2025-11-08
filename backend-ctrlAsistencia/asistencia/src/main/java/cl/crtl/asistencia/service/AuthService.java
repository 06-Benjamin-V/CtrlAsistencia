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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final EstudianteRepository estudianteRepository;
    private final DocenteRepository docenteRepository;
    private final AdministrativoRepository administrativoRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public LoginResponse unifiedLogin(LoginRequest request) {
        final String correo = request.getCorreo().trim();
        final String plain = request.getContrasenia();

        // Estudiante
        var estudianteOpt = estudianteRepository.findByCorreo(correo);
        if (estudianteOpt.isPresent()) {
            return loginGeneric(estudianteOpt.get(), plain, "ESTUDIANTE",
                    estudianteOpt.get().getIdEstudiante());
        }

        // Docente
        var docenteOpt = docenteRepository.findByCorreo(correo);
        if (docenteOpt.isPresent()) {
            return loginGeneric(docenteOpt.get(), plain, "DOCENTE",
                    docenteOpt.get().getIdDocente());
        }

        // Administrativo
        var adminOpt = administrativoRepository.findByCorreo(correo);
        if (adminOpt.isPresent()) {
            return loginGeneric(adminOpt.get(), plain, "ADMINISTRATIVO",
                    adminOpt.get().getIdAdministrativo());
        }

        // No encontrado
        throw new IllegalArgumentException("Credenciales inválidas");
    }

    private LoginResponse loginGeneric(Object user, String plainPassword, String role, Long userId) {
        String correo;
        String contrasenia;
        String nombreCompleto;

        if (user instanceof Estudiante e) {
            correo = e.getCorreo();
            contrasenia = e.getContrasenia();
            nombreCompleto = e.getNombre() + " " + e.getApellido();
        } else if (user instanceof Docente d) {
            correo = d.getCorreo();
            contrasenia = d.getContrasenia();
            nombreCompleto = d.getNombre() + " " + d.getApellido();
        } else if (user instanceof Administrativo a) {
            correo = a.getCorreo();
            contrasenia = a.getContrasenia();
            nombreCompleto = a.getNombre() + " " + a.getApellido();
        } else {
            throw new IllegalArgumentException("Usuario inválido");
        }

        if (!passwordEncoder.matches(plainPassword, contrasenia)) {
            throw new IllegalArgumentException("Credenciales inválidas");
        }

        String token = jwtUtil.generateToken(correo, role, userId);
        return new LoginResponse("success", "Login exitoso", nombreCompleto, token, role);
    }
}

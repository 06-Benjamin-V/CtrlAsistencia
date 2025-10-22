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

        // 1) Estudiante
        var est = estudianteRepository.findByCorreo(correo);
        if (est.isPresent()) {
            Estudiante e = est.get();
            if (!passwordEncoder.matches(plain, e.getContrasenia())) {
                throw new IllegalArgumentException("Credenciales inválidas");
            }
            String token = jwtUtil.generateToken(e.getCorreo(), "ESTUDIANTE", e.getIdEstudiante());
            return new LoginResponse("success", "Login exitoso",
                    e.getNombre() + " " + e.getApellido(), token, "ESTUDIANTE");
        }

        // 2) Docente
        var doc = docenteRepository.findByCorreo(correo);
        if (doc.isPresent()) {
            Docente d = doc.get();
            if (!passwordEncoder.matches(plain, d.getContrasenia())) {
                throw new IllegalArgumentException("Credenciales inválidas");
            }
            String token = jwtUtil.generateToken(d.getCorreo(), "DOCENTE", d.getIdDocente());
            return new LoginResponse("success", "Login exitoso",
                    d.getNombre() + " " + d.getApellido(), token, "DOCENTE");
        }

        // 3) Administrativo
        var adm = administrativoRepository.findByCorreo(correo);
        if (adm.isPresent()) {
            Administrativo a = adm.get();
            if (!passwordEncoder.matches(plain, a.getContrasenia())) {
                throw new IllegalArgumentException("Credenciales inválidas");
            }
            String token = jwtUtil.generateToken(a.getCorreo(), "ADMINISTRATIVO", a.getIdAdministrativo());
            return new LoginResponse("success", "Login exitoso",
                    a.getNombre() + " " + a.getApellido(), token, "ADMINISTRATIVO");
        }

        // No encontrado → misma respuesta para no filtrar info
        throw new IllegalArgumentException("Credenciales inválidas");
    }
}

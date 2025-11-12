package cl.crtl.asistencia.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // Encriptador de contraseñas
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    // Configuración principal de seguridad
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {
                }) // mantiene configuración CORS externa
                .authorizeHttpRequests(auth -> auth

                        // Endpoints públicos (login, registro, etc.)
                        .requestMatchers("/api/auth/**").permitAll()

                        // Endpoints de clase (solo docentes)
                        .requestMatchers(HttpMethod.POST, "/api/clase/crear-con-codigo")
                        .hasRole("DOCENTE")

                        // Endpoints de asistencia (solo estudiantes)
                        .requestMatchers(HttpMethod.POST, "/api/asistencia/registrar-codigo/**")
                        .hasRole("ESTUDIANTE")

                        // Importación CSV (solo administrativos)
                        .requestMatchers("/api/csv/estudiantes/**").hasRole("ADMINISTRATIVO")
                        .requestMatchers(HttpMethod.OPTIONS, "/api/csv/estudiantes/**").permitAll()

                        // Carreras (accesibles a administrativos y docentes)
                        .requestMatchers("/api/carrera/**")
                        .hasAnyRole("ADMINISTRATIVO", "DOCENTE")

                        // Gestión completa de asignaturas (solo administrativos)
                        .requestMatchers(HttpMethod.POST, "/api/asignatura/**").hasRole("ADMINISTRATIVO")
                        .requestMatchers(HttpMethod.PUT, "/api/asignatura/**").hasRole("ADMINISTRATIVO")
                        .requestMatchers(HttpMethod.DELETE, "/api/asignatura/**").hasRole("ADMINISTRATIVO")

                        // Consultar asignaturas (todos los roles autenticados)
                        .requestMatchers(HttpMethod.GET, "/api/asignatura/**")
                        .hasAnyRole("ADMINISTRATIVO", "DOCENTE", "ESTUDIANTE")

                        // Rutas específicas por rol
                        .requestMatchers("/api/administrativo/**").hasRole("ADMINISTRATIVO")
                        .requestMatchers("/api/docente/**").hasAnyRole("DOCENTE", "ADMINISTRATIVO")
                        .requestMatchers("/api/estudiante/**")
                        .hasAnyRole("ESTUDIANTE", "DOCENTE", "ADMINISTRATIVO")

                        // Cualquier otra ruta requiere autenticación
                        .anyRequest().authenticated())

                // JWT sin sesiones de servidor
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Filtro JWT antes del UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

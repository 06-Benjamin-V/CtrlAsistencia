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

// Configuración de seguridad de la aplicación con Spring Security
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // Bean para encriptar contraseñas usando BCrypt
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    // Configura la cadena de filtros de seguridad y las reglas de acceso por rol
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {
                })
                .authorizeHttpRequests(auth -> auth
                        // Endpoint de autenticación accesible públicamente
                        .requestMatchers("/api/auth/**").permitAll()

                        // Importación de CSV solo para administrativos
                        .requestMatchers("/api/csv/estudiantes/**").hasRole("ADMINISTRATIVO")
                        .requestMatchers(HttpMethod.OPTIONS, "/api/csv/estudiantes/**").permitAll()

                        // Endpoints de carreras accesibles para administrativos y docentes
                        .requestMatchers("/api/carrera/**").hasAnyRole("ADMINISTRATIVO", "DOCENTE")

                        // Gestión completa de asignaturas solo para administrativos
                        .requestMatchers(HttpMethod.POST, "/api/asignatura/**").hasRole("ADMINISTRATIVO")
                        .requestMatchers(HttpMethod.PUT, "/api/asignatura/**").hasRole("ADMINISTRATIVO")
                        .requestMatchers(HttpMethod.DELETE, "/api/asignatura/**").hasRole("ADMINISTRATIVO")

                        // Permitir consultar asignaturas a cualquier usuario autenticado
                        .requestMatchers(HttpMethod.GET, "/api/asignatura/**")
                        .hasAnyRole("ADMINISTRATIVO", "DOCENTE", "ESTUDIANTE")

                        // Endpoints administrativos solo para administrativos
                        .requestMatchers("/api/administrativo/**").hasRole("ADMINISTRATIVO")

                        // Endpoints de docentes accesibles para docentes y administrativos
                        .requestMatchers("/api/docente/**").hasAnyRole("DOCENTE", "ADMINISTRATIVO")

                        // Endpoints de estudiantes accesibles según rol
                        .requestMatchers("/api/estudiante/**")
                        .hasAnyRole("ESTUDIANTE", "DOCENTE", "ADMINISTRATIVO")

                        // Cualquier otro endpoint requiere autenticación
                        .anyRequest().authenticated())
                // Configura sesiones sin estado para usar JWT
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Agrega el filtro JWT antes del filtro estándar de autenticación
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

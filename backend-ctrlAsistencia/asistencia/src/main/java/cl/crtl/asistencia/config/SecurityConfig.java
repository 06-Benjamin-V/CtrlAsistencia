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

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {
                })
                .authorizeHttpRequests(auth -> auth
                        // login público
                        .requestMatchers("/api/auth/**").permitAll()

                        // CSV estudiantes (import)
                        .requestMatchers("/api/csv/estudiantes/**").hasRole("ADMINISTRATIVO")
                        .requestMatchers(HttpMethod.OPTIONS, "/api/csv/estudiantes/**").permitAll()

                        // Carreras
                        .requestMatchers("/api/carrera/**").hasAnyRole("ADMINISTRATIVO", "DOCENTE")

                        // Administración
                        .requestMatchers("/api/asignatura/**").hasRole("ADMINISTRATIVO")
                        .requestMatchers("/api/administrativo/**").hasRole("ADMINISTRATIVO")

                        // Docentes
                        .requestMatchers("/api/docente/**").hasAnyRole("DOCENTE", "ADMINISTRATIVO")

                        // Estudiantes
                        .requestMatchers("/api/estudiante/**").hasAnyRole("ESTUDIANTE", "DOCENTE", "ADMINISTRATIVO")

                        // 🔥 QUITAMOS ESTA BASURA GENERAL
                        // .requestMatchers("/api/csv/**").hasRole("ADMINISTRATIVO")

                        .anyRequest().authenticated())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}

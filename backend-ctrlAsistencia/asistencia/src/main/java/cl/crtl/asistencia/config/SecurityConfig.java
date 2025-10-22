package cl.crtl.asistencia.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
            .cors(cors -> {}) // CORS ya lo manejas en CorsConfig
            .authorizeHttpRequests(auth -> auth
                // único login público
                .requestMatchers("/api/auth/**").permitAll()

                // solo ADMINISTRATIVO puede crear/gestionar asignaturas
                .requestMatchers("/api/asignatura/**").hasRole("ADMINISTRATIVO")

                // solo ADMINISTRATIVO puede ver/gestionar administrativos
                .requestMatchers("/api/administrativo/**").hasRole("ADMINISTRATIVO")

                // docentes y administrativos
                .requestMatchers("/api/docente/**").hasAnyRole("DOCENTE", "ADMINISTRATIVO")

                // estudiantes, docentes y administrativos
                .requestMatchers("/api/estudiante/**").hasAnyRole("ESTUDIANTE", "DOCENTE", "ADMINISTRATIVO")

                // cualquier otra request debe estar autenticada
                .anyRequest().authenticated()
            )
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

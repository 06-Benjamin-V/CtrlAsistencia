package cl.crtl.asistencia.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Permite peticiones desde el frontend en desarrollo
        config.setAllowedOrigins(List.of("http://localhost:3000"));

        // metodos HTTP permitidos
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Permite todos los headers en las peticiones
        // Configuración permisiba por ahorita
        config.setAllowedHeaders(List.of("*"));

        // Expone el header Authorization en las respuestas para que el frontend pueda
        // leerlo
        config.setExposedHeaders(Arrays.asList("Authorization"));

        // Permite el envío de credenciales
        config.setAllowCredentials(true);

        // Registra la configuración CORS para las rutas de la aplicacion
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}

package cl.crtl.asistencia.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        // Extrae el header Authorization de la peticion
        final String authHeader = request.getHeader("Authorization");

        // Si no hay header o no comienza con Bearer, continúa sin autenticar
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {

            // Extrae el token JWT removiendo el prefijo Bearer
            final String jwt = authHeader.substring(7);

            // Extrae la información del usuario desde el token
            final String userEmail = jwtUtil.extractEmail(jwt);
            final String userRole = jwtUtil.extractRole(jwt);

            // Si el email existe y no hay autenticación previa en el contexto
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                // Valida el token JWT
                if (jwtUtil.validateToken(jwt, userEmail)) {

                    // Crea la autoridad con el rol del usuario
                    SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + userRole);

                    // Crea el objeto de autenticación con el email y el rol
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userEmail,
                            null,
                            Collections.singletonList(authority));

                    // Agrega detalles adicionales de la petición al token de autenticación
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Establece la autenticación en el contexto de seguridad de Spring
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {

            // Registra cualquier error durante la validación del token
            logger.error("Cannot set user authentication: {}", e);
        }
        // Continúa con la cadena de filtros
        filterChain.doFilter(request, response);
    }
}
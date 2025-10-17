package cl.crtl.asistencia.service;

import cl.crtl.asistencia.model.Administrativo;
import cl.crtl.asistencia.repository.AdministrativoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdministrativoServiceTest {

    @Mock
    private AdministrativoRepository administrativoRepository;

    @InjectMocks
    private AdministrativoService administrativoService;

    private Administrativo administrativo;

    @BeforeEach
    void setUp() {
        administrativo = new Administrativo();
        administrativo.setCorreo("admin@test.com");
        administrativo.setContrasenia("password123");
    }

    @Test
    void login_ConCredencialesCorrectas_DebeRetornarAdministrativo() {
        // Arrange
        when(administrativoRepository.findByCorreoAndContrasenia("admin@test.com", "password123"))
                .thenReturn(Optional.of(administrativo));

        // Act
        Administrativo resultado = administrativoService.login("admin@test.com", "password123");

        // Assert
        assertNotNull(resultado);
        assertEquals("admin@test.com", resultado.getCorreo());
        verify(administrativoRepository, times(1))
                .findByCorreoAndContrasenia("admin@test.com", "password123");
    }

    @Test
    void login_ConCredencialesIncorrectas_DebeRetornarNull() {
        // Arrange
        when(administrativoRepository.findByCorreoAndContrasenia(anyString(), anyString()))
                .thenReturn(Optional.empty());

        // Act
        Administrativo resultado = administrativoService.login("admin@test.com", "wrongpassword");

        // Assert
        assertNull(resultado);
        verify(administrativoRepository, times(1))
                .findByCorreoAndContrasenia("admin@test.com", "wrongpassword");
    }

    @Test
    void login_ConCorreoConEspacios_DebeHacerTrim() {
        // Arrange
        when(administrativoRepository.findByCorreoAndContrasenia("admin@test.com", "password123"))
                .thenReturn(Optional.of(administrativo));

        // Act
        Administrativo resultado = administrativoService.login("  admin@test.com  ", "  password123  ");

        // Assert
        assertNotNull(resultado);
        verify(administrativoRepository, times(1))
                .findByCorreoAndContrasenia("admin@test.com", "password123");
    }

    @Test
    void login_ConCorreoNull_DebeUsarStringVacio() {
        // Arrange
        when(administrativoRepository.findByCorreoAndContrasenia("", "password123"))
                .thenReturn(Optional.empty());

        // Act
        Administrativo resultado = administrativoService.login(null, "password123");

        // Assert
        assertNull(resultado);
        verify(administrativoRepository, times(1))
                .findByCorreoAndContrasenia("", "password123");
    }

    @Test
    void login_ConContraseniaNull_DebeUsarStringVacio() {
        // Arrange
        when(administrativoRepository.findByCorreoAndContrasenia("admin@test.com", ""))
                .thenReturn(Optional.empty());

        // Act
        Administrativo resultado = administrativoService.login("admin@test.com", null);

        // Assert
        assertNull(resultado);
        verify(administrativoRepository, times(1))
                .findByCorreoAndContrasenia("admin@test.com", "");
    }

    @Test
    void login_ConAmbosParametrosNull_DebeUsarStringsVacios() {
        // Arrange
        when(administrativoRepository.findByCorreoAndContrasenia("", ""))
                .thenReturn(Optional.empty());

        // Act
        Administrativo resultado = administrativoService.login(null, null);

        // Assert
        assertNull(resultado);
        verify(administrativoRepository, times(1))
                .findByCorreoAndContrasenia("", "");
    }

    @Test
    void buscarPorCorreo_ConCorreoExistente_DebeRetornarOptionalConAdministrativo() {
        // Arrange
        when(administrativoRepository.findByCorreo("admin@test.com"))
                .thenReturn(Optional.of(administrativo));

        // Act
        Optional<Administrativo> resultado = administrativoService.buscarPorCorreo("admin@test.com");

        // Assert
        assertTrue(resultado.isPresent());
        assertEquals("admin@test.com", resultado.get().getCorreo());
        verify(administrativoRepository, times(1)).findByCorreo("admin@test.com");
    }

    @Test
    void buscarPorCorreo_ConCorreoNoExistente_DebeRetornarOptionalVacio() {
        // Arrange
        when(administrativoRepository.findByCorreo(anyString()))
                .thenReturn(Optional.empty());

        // Act
        Optional<Administrativo> resultado = administrativoService.buscarPorCorreo("noexiste@test.com");

        // Assert
        assertFalse(resultado.isPresent());
        verify(administrativoRepository, times(1)).findByCorreo("noexiste@test.com");
    }

    @Test
    void buscarPorCorreo_ConCorreoConEspacios_DebeHacerTrim() {
        // Arrange
        when(administrativoRepository.findByCorreo("admin@test.com"))
                .thenReturn(Optional.of(administrativo));

        // Act
        Optional<Administrativo> resultado = administrativoService.buscarPorCorreo("  admin@test.com  ");

        // Assert
        assertTrue(resultado.isPresent());
        verify(administrativoRepository, times(1)).findByCorreo("admin@test.com");
    }
}
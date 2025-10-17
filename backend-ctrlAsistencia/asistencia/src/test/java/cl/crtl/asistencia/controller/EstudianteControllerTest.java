package cl.crtl.asistencia.controller;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import cl.crtl.asistencia.model.Estudiante;
import cl.crtl.asistencia.service.EstudianteService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

class EstudianteControllerTest {

    private MockMvc mockMvc;

    @Mock
    private EstudianteService estudianteService;

    @InjectMocks
    private EstudianteController estudianteController;

    @BeforeEach
    void setUp() {
        org.mockito.MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(estudianteController).build();
    }

    @Test
    void login_CredencialesValidas_DeberiaRetornar200() throws Exception {
        Estudiante estudiante = new Estudiante();
        estudiante.setNombre("Ash Ketchum");

        when(estudianteService.login("alumno@correo.com", "1234"))
                .thenReturn(Optional.of(estudiante));

        mockMvc.perform(post("/api/estudiante/login")
                .param("correo", "alumno@correo.com")
                .param("contrasenia", "1234"))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Ash Ketchum")));
    }

    @Test
    void login_CredencialesInvalidas_DeberiaRetornar401() throws Exception {
        when(estudianteService.login("alumno@correo.com", "mal"))
                .thenReturn(Optional.empty());

        mockMvc.perform(post("/api/estudiante/login")
                .param("correo", "alumno@correo.com")
                .param("contrasenia", "mal"))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Credenciales inválidas"));
    }
}

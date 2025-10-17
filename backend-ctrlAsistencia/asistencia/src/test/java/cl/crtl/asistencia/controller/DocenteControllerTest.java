package cl.crtl.asistencia.controller;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import cl.crtl.asistencia.model.Docente;
import cl.crtl.asistencia.service.DocenteService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

class DocenteControllerTest {

    private MockMvc mockMvc;

    @Mock
    private DocenteService docenteService;

    @InjectMocks
    private DocenteController docenteController;

    @BeforeEach
    void setUp() {
        org.mockito.MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(docenteController).build();
    }

    @Test
    void login_CredencialesValidas_DeberiaRetornar200() throws Exception {
        Docente docente = new Docente();
        docente.setNombre("Profesor Oak");

        when(docenteService.login("docente@correo.com", "1234"))
                .thenReturn(Optional.of(docente));

        mockMvc.perform(post("/api/docente/login")
                .param("correo", "docente@correo.com")
                .param("contrasenia", "1234"))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Profesor Oak")));
    }

    @Test
    void login_CredencialesInvalidas_DeberiaRetornar401() throws Exception {
        when(docenteService.login("docente@correo.com", "mal"))
                .thenReturn(Optional.empty());

        mockMvc.perform(post("/api/docente/login")
                .param("correo", "docente@correo.com")
                .param("contrasenia", "mal"))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Credenciales inválidas"));
    }
}

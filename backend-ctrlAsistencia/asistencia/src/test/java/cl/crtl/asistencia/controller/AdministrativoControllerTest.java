package cl.crtl.asistencia.controller;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import cl.crtl.asistencia.model.Administrativo;
import cl.crtl.asistencia.service.AdministrativoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

class AdministrativoControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AdministrativoService administrativoService;

    @InjectMocks
    private AdministrativoController administrativoController;

    @BeforeEach
    void setUp() {
        org.mockito.MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(administrativoController).build();
    }

    @Test
    void login_CredencialesValidas_DeberiaRetornar200() throws Exception {
        Administrativo admin = new Administrativo();
        admin.setNombre("Juan Pérez");

        when(administrativoService.login("juan@correo.com", "1234")).thenReturn(admin);

        mockMvc.perform(get("/api/administrativo/login")
                .param("correo", "juan@correo.com")
                .param("contrasenia", "1234"))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Login exitoso")))
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Juan Pérez")));
    }

    @Test
    void login_CredencialesInvalidas_DeberiaRetornar401() throws Exception {
        when(administrativoService.login("falso@correo.com", "mal")).thenReturn(null);

        mockMvc.perform(get("/api/administrativo/login")
                .param("correo", "falso@correo.com")
                .param("contrasenia", "mal"))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Credenciales inválidas")));
    }
}

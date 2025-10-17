package cl.crtl.asistencia.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cl.crtl.asistencia.model.Administrativo;
import cl.crtl.asistencia.service.AdministrativoService;

@RestController
@RequestMapping("/api/administrativo")
@CrossOrigin(origins = "*")// NOSONAR: CORS abierto solo en entorno de desarrollo
public class AdministrativoController {
    
    @Autowired
    private AdministrativoService administrativoService;

   @GetMapping("/login")
    public ResponseEntity<String> login(@RequestParam String correo, @RequestParam String contrasenia) {
        Administrativo admin = administrativoService.login(correo, contrasenia);

        if (admin != null) {
            //si las credenciales tan joya, tira un 200 ok
            String body = "{\"status\":\"OK\",\"message\":\"Login exitoso\",\"nombre\":\"" + admin.getNombre() + "\"}";
            return ResponseEntity.ok().body(body);
        } else {
            // si no existen tira un 401 Unauthorized
            String body = "{\"status\":\"UNAUTHORIZED\",\"message\":\"Credenciales inválidas\"}";
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
        }
    }
}

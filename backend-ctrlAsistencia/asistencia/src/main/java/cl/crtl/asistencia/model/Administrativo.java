package cl.crtl.asistencia.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "administrativo")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Administrativo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_administrativo")
    private Long idAdministrativo;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String apellido;

    @Column(nullable = false, unique = true)
    private String rut;

    @Column(nullable = false, unique = true)
    private String correo;

    @Column(nullable = false)
    private String contrasenia;
}

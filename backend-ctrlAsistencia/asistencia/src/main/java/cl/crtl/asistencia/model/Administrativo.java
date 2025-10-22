package cl.crtl.asistencia.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

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

    @Column(nullable = false, length = 80)
    private String nombre;

    @Column(nullable = false, length = 80)
    private String apellido;

    @Column(nullable = false, unique = true, length = 20)
    private String rut;

    @Column(nullable = false, unique = true, length = 120)
    private String correo;

    @Column(nullable = false, length = 120)
    private String contrasenia;

    @Column(length = 100)
    private String cargo;

    @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 1")
    private Boolean activo = true;

    @Column(name = "creado_en", updatable = false, insertable = false)
    private LocalDateTime creadoEn;

    @Column(name = "actualizado_en", insertable = false)
    private LocalDateTime actualizadoEn;
}

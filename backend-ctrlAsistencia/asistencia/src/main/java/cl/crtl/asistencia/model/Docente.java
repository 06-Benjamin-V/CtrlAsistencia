package cl.crtl.asistencia.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "docente")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Docente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_docente")
    private Long idDocente;

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

    @ManyToOne
    @JoinColumn(name = "id_departamento")
    private Departamento departamento;

    @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 1")
    private Boolean activo = true;

    @Column(name = "creado_en", updatable = false, insertable = false)
    private LocalDateTime creadoEn;

    @Column(name = "actualizado_en", insertable = false)
    private LocalDateTime actualizadoEn;
}

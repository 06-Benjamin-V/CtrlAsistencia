package cl.crtl.asistencia.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "asistencia", uniqueConstraints = @UniqueConstraint(columnNames = { "id_clase", "id_estudiante" }))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Asistencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_asistencia")
    private Long idAsistencia;

    @ManyToOne
    @JoinColumn(name = "id_clase", nullable = false)
    private Clase clase;

    @ManyToOne
    @JoinColumn(name = "id_estudiante", nullable = false)
    private Estudiante estudiante;

    @Column(nullable = false)
    private Boolean presente = false;
    @Column(nullable = false)
    private Boolean justificado = false;

    @Column(name = "fecha_registro", nullable = false)
    private LocalDateTime fechaRegistro;
}

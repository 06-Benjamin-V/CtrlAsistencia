package cl.crtl.asistencia.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "clase")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Clase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_clase")
    private Long idClase;

    @ManyToOne
    @JoinColumn(name = "id_curso", nullable = false)
    private Curso curso;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(length = 255)
    private String tema;

    @Column(name = "codigo_asistencia", length = 50, unique = true)
    private String codigoAsistencia;

    @Column(name = "codigo_expira_en")
    private LocalDateTime codigoExpiraEn;

    @Column(name = "creada_en", insertable = false, updatable = false)
    private LocalDateTime creadaEn;
}

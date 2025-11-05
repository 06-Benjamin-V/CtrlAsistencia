package cl.crtl.asistencia.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "clase")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Clase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idClase;

    @ManyToOne
    @JoinColumn(name = "id_docente", nullable = false)
    private Docente docente;

    @ManyToOne
    @JoinColumn(name = "id_asignatura", nullable = false)
    private Asignatura asignatura;

    @Column(nullable = false)
    private LocalDate fecha;

    @OneToMany(mappedBy = "clase", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Asistencia> asistencias;
}

package cl.crtl.asistencia.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "periodo_academico")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PeriodoAcademico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_periodo")
    private Long idPeriodo;

    @Column(nullable = false)
    private Integer anio;

    @Column(nullable = false)
    private Integer semestre;
}

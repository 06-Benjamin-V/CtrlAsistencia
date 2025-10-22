package cl.crtl.asistencia.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "carrera")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Carrera {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_carrera")
    private Long idCarrera;

    @Column(nullable = false, length = 100)
    private String nombre;
}

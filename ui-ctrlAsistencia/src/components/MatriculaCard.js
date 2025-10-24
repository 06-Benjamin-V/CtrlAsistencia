import React from "react";
import "./Card.css";

function MatriculaCard({ matricula }) {
  return (
    <div className="card">
      <h3>📌 Matrícula</h3>
      <p><strong>Estudiante:</strong> {matricula.estudiante?.nombre} {matricula.estudiante?.apellido}</p>
      <p><strong>Curso:</strong> {matricula.curso?.asignatura?.nombre} - Sección {matricula.curso?.seccion}</p>
      <p><strong>Estado:</strong> {matricula.estado}</p>
      <p><strong>Fecha:</strong> {new Date(matricula.fechaInscripcion).toLocaleString()}</p>
    </div>
  );
}

export default MatriculaCard;

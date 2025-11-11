import React from "react";
import "./Card.css";

function CursoCard({ curso }) {
  return (
    <div className="card">
      <h3>Curso {curso.seccion}</h3>
      <p><strong>Asignatura:</strong> {curso.asignatura?.nombre}</p>
      <p><strong>Docente:</strong> {curso.docente?.nombre} {curso.docente?.apellido}</p>
      <p><strong>Periodo:</strong> {curso.periodo?.anio} - Sem {curso.periodo?.semestre}</p>
    </div>
  );
}

export default CursoCard;

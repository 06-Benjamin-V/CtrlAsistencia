import React from "react";
import "./Card.css";

function AsignaturaCard({ asignatura }) {
  return (
    <div className="asignatura-card">
      <h3>{asignatura.nombre}</h3>
    </div>
  );
}

export default AsignaturaCard;

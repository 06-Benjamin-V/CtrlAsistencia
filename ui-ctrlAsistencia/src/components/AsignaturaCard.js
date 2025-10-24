import React from "react";
import "./AsignaturaCard.css";

function AsignaturaCard({ asignatura }) {
  return (
    <div className="asignatura-card">
      <h3>{asignatura.nombre}</h3>
    </div>
  );
}

export default AsignaturaCard;

import React from "react";
import "./Card.css";

function DocenteCard({ docente }) {
  return (
    <div className="card">
      <h3>{docente.nombre} {docente.apellido}</h3>
      <p><strong>RUT:</strong> {docente.rut}</p>
      <p><strong>Correo:</strong> {docente.correo}</p>
      <p><strong>Departamento:</strong> {docente.departamento?.nombre || "Sin asignar"}</p>
      <p><strong>Activo:</strong> {docente.activo ? "Sí" : "No"}</p>
    </div>
  );
}

export default DocenteCard;

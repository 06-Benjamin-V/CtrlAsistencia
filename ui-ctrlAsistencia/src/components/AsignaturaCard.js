import React from "react";
import "./Card.css";
import { FaBook } from "react-icons/fa";

function AsignaturaCard({ asignatura }) {
  return (
    <div className="asignatura-card">
      <div className="asignatura-card-header">
        <FaBook />
      </div>
      <div className="asignatura-card-body">
        <h3>{asignatura.nombre}</h3>
      </div>
    </div>
  );
}

export default AsignaturaCard;

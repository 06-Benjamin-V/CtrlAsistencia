import React from "react";
import { useNavigate } from "react-router-dom";
import "./Card.css";
import { FaBook } from "react-icons/fa";

function AsignaturaCard({ asignatura }) {
  const navigate = useNavigate();

const handleClick = () => {
  // Verifica qué propiedad tiene realmente la asignatura
  console.log("Asignatura clickeada:", asignatura); // <-- solo para verificar
  navigate(`/asignatura/${asignatura.idAsignatura || asignatura.id}`);
};


  return (
    <div
      className="asignatura-card"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
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

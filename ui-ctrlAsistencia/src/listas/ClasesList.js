import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import "./listas.css";

function ClasesList() {
  const [clases, setClases] = useState([]);
  const [search, setSearch] = useState("");
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    // Obtener datos del usuario
    fetch("http://localhost:8080/api/usuario/home", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsuario(data);
        // Obtener clases del docente
        if (data.rol === "DOCENTE") {
          fetch(`http://localhost:8080/api/clase/docente/${data.idDocente}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((res) => res.json())
            .then((clases) => setClases(clases))
            .catch((err) => console.error(err));
        }
      })
      .catch((err) => console.error(err));
  }, [navigate]);

  const filtered = clases.filter((item) =>
    item.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    item.codigo?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <h1>Mis Clases</h1>
      <SearchBar search={search} setSearch={setSearch} />
      <button className="btn-crear" onClick={() => navigate("/docente/clases/crear")}>
        + Nueva Clase
      </button>
      <div className="cards-container">
        {filtered.length > 0 ? (
          filtered.map((clase) => (
            <div key={clase.idClase} className="card">
              <h3>{clase.nombre}</h3>
              <p>Código: {clase.codigo}</p>
              <p>Asignatura: {clase.asignatura?.nombre}</p>
              <p>Año: {clase.anio}</p>
            </div>
          ))
        ) : (
          <p>No hay clases registradas</p>
        )}
      </div>
    </div>
  );
}

export default ClasesList;

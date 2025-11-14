import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import EstudianteCard from "../components/EstudianteCard";
import "./listas.css";

function EstudiantesList() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    fetch("http://localhost:8080/api/estudiante/lista", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setEstudiantes(data))
      .catch((err) => console.error(err));
  }, [navigate]);

  const filtered = estudiantes.filter((item) =>
    item.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    item.apellido?.toLowerCase().includes(search.toLowerCase()) ||
    item.rut?.includes(search)
  );

  return (
    <div className="page-container">
      <h1>Estudiantes</h1>
      <SearchBar search={search} setSearch={setSearch} />
      <button className="btn-crear" onClick={() => navigate("/admin/estudiantes/crear")}>
        + Nuevo Estudiante
      </button>
      <div className="cards-container">
        {filtered.map((estudiante) => (
          <EstudianteCard key={estudiante.idEstudiante} estudiante={estudiante} />
        ))}
      </div>
    </div>
  );
}

export default EstudiantesList;

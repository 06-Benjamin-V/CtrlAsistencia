import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import AsignaturaCard from "../components/AsignaturaCard";
import "./listas.css";

function AsignaturasList() {
  const [asignaturas, setAsignaturas] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    fetch("http://localhost:8080/api/asignatura/lista", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAsignaturas(data))
      .catch((err) => console.error(err));
  }, [navigate]);

  const filtered = asignaturas.filter((item) =>
    item.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    item.codigo?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <h1>Asignaturas</h1>
      <SearchBar search={search} setSearch={setSearch} />
      <button className="btn-crear" onClick={() => navigate("/admin/asignaturas/crear")}>
        + Nueva Asignatura
      </button>
      <div className="cards-container">
        {filtered.map((asignatura) => (
          <AsignaturaCard key={asignatura.idAsignatura} asignatura={asignatura} />
        ))}
      </div>
    </div>
  );
}

export default AsignaturasList;

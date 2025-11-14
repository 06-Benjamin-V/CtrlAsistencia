import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import DocenteCard from "../components/DocenteCard";
import "./listas.css";

function DocentesList() {
  const [docentes, setDocentes] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    fetch("http://localhost:8080/api/docente/lista", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setDocentes(data))
      .catch((err) => console.error(err));
  }, [navigate]);

  const filtered = docentes.filter((item) =>
    item.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    item.apellido?.toLowerCase().includes(search.toLowerCase()) ||
    item.rut?.includes(search)
  );

  return (
    <div className="page-container">
      <h1>Docentes</h1>
      <SearchBar search={search} setSearch={setSearch} />
      <button className="btn-crear" onClick={() => navigate("/admin/docentes/crear")}>
        + Nuevo Docente
      </button>
      <div className="cards-container">
        {filtered.map((docente) => (
          <DocenteCard key={docente.idDocente} docente={docente} />
        ))}
      </div>
    </div>
  );
}

export default DocentesList;

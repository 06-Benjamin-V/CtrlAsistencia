import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import CursoCard from "../components/CursoCard";
import "./listas.css";

function CursosList() {
  const [cursos, setCursos] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    fetch("http://localhost:8080/api/curso/lista", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCursos(data))
      .catch((err) => console.error(err));
  }, [navigate]);

  const filtered = cursos.filter((item) =>
    item.nombre?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <h1>Cursos</h1>
      <SearchBar search={search} setSearch={setSearch} />
      <button className="btn-crear" onClick={() => navigate("/admin/cursos/crear")}>
        + Nuevo Curso
      </button>
      <div className="cards-container">
        {filtered.map((curso) => (
          <CursoCard key={curso.idCurso} curso={curso} />
        ))}
      </div>
    </div>
  );
}

export default CursosList;

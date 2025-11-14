import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import MatriculaCard from "../components/MatriculaCard";
import "./listas.css";

function MatriculasList() {
  const [matriculas, setMatriculas] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    fetch("http://localhost:8080/api/matricula/lista", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setMatriculas(data))
      .catch((err) => console.error(err));
  }, [navigate]);

  const filtered = matriculas.filter((item) =>
    item.idEstudiante?.toString().includes(search) ||
    item.idCurso?.toString().includes(search)
  );

  return (
    <div className="page-container">
      <h1>Matrículas</h1>
      <SearchBar search={search} setSearch={setSearch} />
      <button className="btn-crear" onClick={() => navigate("/admin/matriculas/crear")}>
        + Nueva Matrícula
      </button>
      <div className="cards-container">
        {filtered.map((matricula) => (
          <MatriculaCard key={matricula.idMatricula} matricula={matricula} />
        ))}
      </div>
    </div>
  );
}

export default MatriculasList;

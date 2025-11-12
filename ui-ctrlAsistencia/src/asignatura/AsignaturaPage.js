import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function AsignaturaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asignatura, setAsignatura] = useState(null);
  const [activeTab, setActiveTab] = useState("general");
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return (window.location.href = "/login");

    fetch(`http://localhost:8080/api/asignatura/${id}/detalle`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar la asignatura");
        return res.json();
      })
      .then(setAsignatura)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p>Error: {error}</p>;
  if (!asignatura) return <p>Cargando información...</p>;

  return (
    <div className="asig-wrapper">
      <aside className="asig-sidebar">
        <button className="asig-back" onClick={() => navigate(-1)}>
          Volver
        </button>
        <button
          className={`asig-tab ${activeTab === "general" ? "active" : ""}`}
          onClick={() => setActiveTab("general")}
        >
          General
        </button>
        <button
          className={`asig-tab ${activeTab === "docentes" ? "active" : ""}`}
          onClick={() => setActiveTab("docentes")}
        >
          Docentes
        </button>
        <button
          className={`asig-tab ${activeTab === "estudiantes" ? "active" : ""}`}
          onClick={() => setActiveTab("estudiantes")}
        >
          Estudiantes
        </button>
        <button
          className={`asig-tab ${activeTab === "clases" ? "active" : ""}`}
          onClick={() => setActiveTab("clases")}
        >
          Clases
        </button>
      </aside>

      <main className="asig-content">
        {activeTab === "general" && (
          <div>
            <h1 className="asig-title">{asignatura.nombre}</h1>
            <div className="asig-meta">
              <p>
                <span className="asig-label">Código:</span> {asignatura.codigo}
              </p>
              <p>
                <span className="asig-label">Créditos:</span> {asignatura.creditos}
              </p>
              <p>
                <span className="asig-label">Departamento:</span>{" "}
                {asignatura.departamento?.nombre}
              </p>
            </div>
          </div>
        )}

        {activeTab === "docentes" && (
          <div>
            <h3>Docentes</h3>
            <ul className="asig-list">
              {asignatura.docentes?.length > 0 ? (
                asignatura.docentes.map((d) => (
                  <li key={d.idDocente}>
                    {d.nombre} {d.apellido}
                  </li>
                ))
              ) : (
                <li>No hay docentes registrados.</li>
              )}
            </ul>
          </div>
        )}

        {activeTab === "estudiantes" && (
          <div>
            <h3>Estudiantes</h3>
            <ul className="asig-list">
              {asignatura.estudiantes?.length > 0 ? (
                asignatura.estudiantes.map((e) => (
                  <li key={e.idEstudiante}>
                    {e.nombre} {e.apellido} — {e.rut}
                  </li>
                ))
              ) : (
                <li>No hay estudiantes registrados.</li>
              )}
            </ul>
          </div>
        )}

        {activeTab === "clases" && (
          <div>
            <h3>Clases</h3>
            <ul className="asig-list">
              {asignatura.clases?.length > 0 ? (
                asignatura.clases.map((c) => (
                  <li key={c.idClase}>
                    {c.tema} — {c.fecha}
                  </li>
                ))
              ) : (
                <li>No hay clases registradas.</li>
              )}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}

export default AsignaturaPage;

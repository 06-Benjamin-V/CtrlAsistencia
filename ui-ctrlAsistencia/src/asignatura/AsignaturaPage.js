import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Página de detalle: muestra información completa de la asignatura
function AsignaturaPage() {
  const { id } = useParams(); // ID desde la URL
  const navigate = useNavigate();
  const [asignatura, setAsignatura] = useState(null);
  const [error, setError] = useState(null);

  // Carga el detalle de la asignatura
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return (window.location.href = "/login");

    fetch(`http://localhost:8080/api/asignatura/${id}/detalle`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el detalle de la asignatura");
        return res.json();
      })
      .then(setAsignatura)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p>Error: {error}</p>;
  if (!asignatura) return <p>Cargando información de la asignatura...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <button
        onClick={() => navigate(-1)}
        style={{ marginBottom: "1rem" }}
        title="Volver"
      >
        Volver
      </button>

      <h1>{asignatura.nombre}</h1>
      <p><strong>ID:</strong> {asignatura.idAsignatura}</p>
      <p><strong>Código:</strong> {asignatura.codigo}</p>
      <p><strong>Créditos:</strong> {asignatura.creditos}</p>
      <p><strong>Departamento:</strong> {asignatura.departamento}</p>

      {/* Docentes */}
      {asignatura.docentes?.length > 0 && (
        <>
          <h3>Docentes</h3>
          <ul>
            {asignatura.docentes.map((d) => (
              <li key={d.idDocente}>
                {d.nombre} {d.apellido}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Estudiantes */}
      {asignatura.estudiantes?.length > 0 && (
        <>
          <h3>Estudiantes</h3>
          <ul>
            {asignatura.estudiantes.map((e) => (
              <li key={e.idEstudiante}>
                {e.nombre} {e.apellido} — {e.rut}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Clases */}
      {asignatura.clases?.length > 0 && (
        <>
          <h3>Clases</h3>
          <ul>
            {asignatura.clases.map((c) => (
              <li key={c.idClase}>
                {c.tema} ({c.fecha})
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default AsignaturaPage;

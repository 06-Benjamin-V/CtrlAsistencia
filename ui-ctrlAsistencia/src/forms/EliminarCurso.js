import React, { useEffect, useState } from "react";
import "./Form.css";

function EliminarCurso() {
  const [cursos, setCursos] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8080/api/curso/lista", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setCursos(data))
      .catch(() => setCursos([]));
  }, [token]);

  const handleDelete = async () => {
    if (!seleccionado) return;
    if (!window.confirm(`¿Eliminar curso sección ${seleccionado.seccion}?`)) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/curso/eliminar/${seleccionado.idCurso}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        alert("Curso eliminado");
        setCursos(cursos.filter((c) => c.idCurso !== seleccionado.idCurso));
        setSeleccionado(null);
      } else {
        alert("No se pudo eliminar");
      }
    } catch {
      alert("Error de conexión");
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <h2>Eliminar Curso</h2>

        <select
          value={seleccionado?.idCurso || ""}
          onChange={(e) => {
            const id = e.target.value;
            setSeleccionado(cursos.find((c) => c.idCurso == id));
          }}
        >
          <option value="" disabled>Selecciona un curso</option>
          {cursos.map((c) => (
            <option key={c.idCurso} value={c.idCurso}>
              {c.asignatura?.nombre} - {c.docente?.nombre} {c.docente?.apellido} - Sec {c.seccion}
            </option>
          ))}
        </select>

        {seleccionado && (
          <button className="danger" onClick={handleDelete}>Eliminar</button>
        )}
      </div>
    </div>
  );
}

export default EliminarCurso;

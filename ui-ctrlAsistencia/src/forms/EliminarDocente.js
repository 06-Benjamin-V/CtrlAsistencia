import React, { useEffect, useState } from "react";
import "./Form.css";

function EliminarDocente() {
  const [docentes, setDocentes] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8080/api/docente/lista", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setDocentes(data))
      .catch(() => setDocentes([]));
  }, [token]);

  const handleDelete = async () => {
    if (!seleccionado) return;
    if (!window.confirm(`¿Eliminar a ${seleccionado.nombre} ${seleccionado.apellido}?`)) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/docente/eliminar/${seleccionado.idDocente}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        alert("Docente eliminado");
        setDocentes(docentes.filter((d) => d.idDocente !== seleccionado.idDocente));
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
        <h2>Eliminar Docente</h2>

        <select
          onChange={(e) => {
            const id = e.target.value;
            setSeleccionado(docentes.find((d) => d.idDocente == id));
          }}
          value={seleccionado?.idDocente || ""}
        >
          <option value="" disabled>Selecciona un docente</option>
          {docentes.map((d) => (
            <option key={d.idDocente} value={d.idDocente}>
              {d.nombre} {d.apellido} - {d.rut}
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

export default EliminarDocente;

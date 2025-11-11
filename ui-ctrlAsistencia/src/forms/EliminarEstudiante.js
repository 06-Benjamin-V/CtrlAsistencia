import React, { useEffect, useState } from "react";
import "./Form.css";

function EliminarEstudiante() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8080/api/estudiante/lista", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setEstudiantes(data))
      .catch(() => setEstudiantes([]));
  }, [token]);

  const handleDelete = async () => {
    if (!seleccionado) return;
    if (!window.confirm(`¿Eliminar a ${seleccionado.nombre} ${seleccionado.apellido}?`)) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/estudiante/eliminar/${seleccionado.idEstudiante}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        alert("Estudiante eliminado");
        setEstudiantes(estudiantes.filter((e) => e.idEstudiante !== seleccionado.idEstudiante));
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
        <h2>Eliminar Estudiante</h2>

        <select
          onChange={(e) => {
            const id = e.target.value;
            setSeleccionado(estudiantes.find((e) => e.idEstudiante == id));
          }}
          value={seleccionado?.idEstudiante || ""}
        >
          <option value="" disabled>Selecciona un estudiante</option>
          {estudiantes.map((e) => (
            <option key={e.idEstudiante} value={e.idEstudiante}>
              {e.nombre} {e.apellido} - {e.rut}
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

export default EliminarEstudiante;

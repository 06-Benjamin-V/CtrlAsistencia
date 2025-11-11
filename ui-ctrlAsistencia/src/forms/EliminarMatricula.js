import React, { useEffect, useState } from "react";
import "./Form.css";

function EliminarMatricula() {
  const [matriculas, setMatriculas] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8080/api/matricula/lista", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setMatriculas(data))
      .catch(() => setMatriculas([]));
  }, [token]);

  const handleDelete = async () => {
    if (!seleccionada) return;
    if (!window.confirm(`¿Eliminar matrícula de ${seleccionada.estudiante.nombre}?`)) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/matricula/eliminar/${seleccionada.idMatricula}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        alert("Matrícula eliminada");
        setMatriculas(matriculas.filter((m) => m.idMatricula !== seleccionada.idMatricula));
        setSeleccionada(null);
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
        <h2>Eliminar Matrícula</h2>

        <select
          value={seleccionada?.idMatricula || ""}
          onChange={(e) => {
            const id = e.target.value;
            setSeleccionada(matriculas.find((m) => m.idMatricula == id));
          }}
        >
          <option value="" disabled>Selecciona una matrícula</option>
          {matriculas.map((m) => (
            <option key={m.idMatricula} value={m.idMatricula}>
              {m.estudiante?.nombre} {m.estudiante?.apellido} - {m.curso?.asignatura?.nombre}
            </option>
          ))}
        </select>

        {seleccionada && (
          <button className="danger" onClick={handleDelete}>Eliminar</button>
        )}
      </div>
    </div>
  );
}

export default EliminarMatricula;

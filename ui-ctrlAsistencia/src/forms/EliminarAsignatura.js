import React, { useEffect, useState } from "react";
import "./Form.css";

function EliminarAsignatura() {
  const [asignaturas, setAsignaturas] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8080/api/asignatura/lista", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setAsignaturas(data));
  }, [token]);

  const handleDelete = async () => {
    if (!seleccionada) return;
    if (!window.confirm(`¿Seguro que deseas eliminar "${seleccionada.nombre}"?`)) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/asignatura/eliminar/${seleccionada.idAsignatura}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        alert("Asignatura eliminada");
        setAsignaturas(asignaturas.filter((a) => a.idAsignatura !== seleccionada.idAsignatura));
        setSeleccionada(null);
      } else {
        alert("Error al eliminar");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión");
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <h2>Eliminar Asignatura</h2>

        <select
          onChange={(e) => {
            const id = e.target.value;
            setSeleccionada(asignaturas.find((a) => a.idAsignatura == id));
          }}
          value={seleccionada?.idAsignatura || ""}
        >
          <option value="" disabled>Selecciona una asignatura</option>
          {asignaturas.map((a) => (
            <option key={a.idAsignatura} value={a.idAsignatura}>
              {a.nombre} ({a.codigo})
            </option>
          ))}
        </select>

        {seleccionada && (
          <button className="danger" onClick={handleDelete}>
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
}

export default EliminarAsignatura;

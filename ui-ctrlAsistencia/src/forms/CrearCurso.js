import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Form.css";

function CrearCurso() {
  const [form, setForm] = useState({
    idAsignatura: "",
    idDocente: "",
    idPeriodo: "",
    seccion: ""
  });

  const [asignaturas, setAsignaturas] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Cargar datos desde backend
  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch("http://localhost:8080/api/asignatura/lista", { headers }).then((res) => res.json()),
      fetch("http://localhost:8080/api/docente/lista", { headers }).then((res) => res.json()),
      fetch("http://localhost:8080/api/periodo/lista", { headers }).then((res) => res.json())
    ])
      .then(([asigs, docs, pers]) => {
        setAsignaturas(asigs);
        setDocentes(docs);
        setPeriodos(pers);
      })
      .catch((err) => console.error("Error cargando datos:", err));
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/curso/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          asignatura: { idAsignatura: parseInt(form.idAsignatura, 10) },
          docente: { idDocente: parseInt(form.idDocente, 10) },
          periodo: { idPeriodo: parseInt(form.idPeriodo, 10) },
          seccion: form.seccion
        })
      });

      if (res.ok) {
        alert("✅ Curso creado con éxito");
        navigate("/home");
      } else {
        alert("❌ Error al crear curso");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Error de conexión con el servidor");
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <h2>Crear Curso</h2>
        <form onSubmit={handleSubmit}>
          <label>Asignatura</label>
          <select
            name="idAsignatura"
            value={form.idAsignatura}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una asignatura</option>
            {asignaturas.map((a) => (
              <option key={a.idAsignatura} value={a.idAsignatura}>
                {a.nombre}
              </option>
            ))}
          </select>

          <label>Docente</label>
          <select
            name="idDocente"
            value={form.idDocente}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un docente</option>
            {docentes.map((d) => (
              <option key={d.idDocente} value={d.idDocente}>
                {d.nombre} {d.apellido}
              </option>
            ))}
          </select>

          <label>Periodo Académico</label>
          <select
            name="idPeriodo"
            value={form.idPeriodo}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un periodo</option>
            {periodos.map((p) => (
              <option key={p.idPeriodo} value={p.idPeriodo}>
                {p.anio} - Semestre {p.semestre}
              </option>
            ))}
          </select>

          <label>Sección</label>
          <input
            type="text"
            name="seccion"
            value={form.seccion}
            onChange={handleChange}
            placeholder="Ej: 1, A, B"
            required
          />

          <div className="form-buttons">
            <button type="submit">Crear</button>
            <button type="button" className="volver" onClick={() => navigate("/home")}>
              ⬅ Volver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearCurso;

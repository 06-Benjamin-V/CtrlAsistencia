import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Form.css";

function CrearMatricula() {
  const [form, setForm] = useState({
    idEstudiante: "",
    idCurso: ""
  });

  const [estudiantes, setEstudiantes] = useState([]);
  const [cursos, setCursos] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Cargar estudiantes y cursos
  useEffect(() => {
    fetch("http://localhost:8080/api/estudiante/lista", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setEstudiantes(data));

    fetch("http://localhost:8080/api/curso/lista", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setCursos(data));
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/matricula/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          estudiante: { idEstudiante: parseInt(form.idEstudiante, 10) },
          curso: { idCurso: parseInt(form.idCurso, 10) }
        })
      });

      if (res.ok) {
        alert("Estudiante matriculado con éxito");
        navigate("/home");
      } else {
        alert("Error al matricular estudiante");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <h2>Matricular Estudiante</h2>
        <form onSubmit={handleSubmit}>
          <label>Estudiante</label>
          <select name="idEstudiante" value={form.idEstudiante} onChange={handleChange} required>
            <option value="">Seleccione un estudiante</option>
            {estudiantes.map((e) => (
              <option key={e.idEstudiante} value={e.idEstudiante}>
                {e.nombre} {e.apellido} ({e.rut})
              </option>
            ))}
          </select>

          <label>Curso</label>
          <select name="idCurso" value={form.idCurso} onChange={handleChange} required>
            <option value="">Seleccione un curso</option>
            {cursos.map((c) => (
              <option key={c.idCurso} value={c.idCurso}>
                {c.asignatura.nombre} - {c.seccion}
              </option>
            ))}
          </select>

          <div className="form-buttons">
            <button type="button" className="volver" onClick={() => navigate("/home")}>
              ⬅ Volver
            </button>
            <button type="submit">Matricular</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearMatricula;

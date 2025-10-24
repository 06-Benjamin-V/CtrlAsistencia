import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Form.css";

function CrearClase() {
  const [form, setForm] = useState({
    idCurso: "",
    fecha: new Date().toISOString().split("T")[0],
    tema: "",
    codigoAsistencia: "",
    codigoExpiraEn: ""
  });

  const [cursos, setCursos] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Cargar cursos del docente
  useEffect(() => {
  const token = localStorage.getItem("token");
  const payload = JSON.parse(atob(token.split(".")[1]));
  
  fetch(`http://localhost:8080/api/curso/docente/${payload.userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(res => res.json())
    .then(data => setCursos(data))
    .catch(err => console.error("Error cargando cursos:", err));
  }, []);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/clase/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          curso: { idCurso: parseInt(form.idCurso, 10) },
          fecha: form.fecha,
          tema: form.tema,
          codigoAsistencia: form.codigoAsistencia,
          codigoExpiraEn: form.codigoExpiraEn
        })
      });

      if (res.ok) {
        alert("✅ Clase creada con éxito");
        navigate("/home");
      } else {
        alert("❌ Error al crear clase");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Error de conexión con el servidor");
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <h2>Crear Clase</h2>
        <form onSubmit={handleSubmit}>
          <label>Curso</label>
          <select name="idCurso" value={form.idCurso} onChange={handleChange} required>
            <option value="">Seleccione un curso</option>
            {cursos.map((c) => (
              <option key={c.idCurso} value={c.idCurso}>
                {c.asignatura.nombre} - Sección {c.seccion}
              </option>
            ))}
          </select>

          <label>Tema</label>
          <input type="text" name="tema" value={form.tema} onChange={handleChange} required />

          <label>Fecha</label>
          <input type="date" name="fecha" value={form.fecha} onChange={handleChange} required />

          <label>Código de Asistencia</label>
          <input type="text" name="codigoAsistencia" value={form.codigoAsistencia} onChange={handleChange} required />

          <label>Expira en (HH:mm)</label>
          <input type="datetime-local" name="codigoExpiraEn" value={form.codigoExpiraEn} onChange={handleChange} required />

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

export default CrearClase;

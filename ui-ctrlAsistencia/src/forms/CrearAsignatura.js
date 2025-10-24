import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Form.css";

function CrearAsignatura() {
  const [form, setForm] = useState({
    nombre: "",
    codigo: "",
    creditos: "",
    idDepartamento: "",
    porcentajeMinAsistencia: ""
  });

  const [departamentos, setDepartamentos] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Cargar departamentos desde backend
  useEffect(() => {
    fetch("http://localhost:8080/api/departamento/lista", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setDepartamentos(data))
      .catch(err => console.error("Error cargando departamentos", err));
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/asignatura/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: form.nombre,
          codigo: form.codigo,
          creditos: parseInt(form.creditos, 10),
          departamento: { idDepartamento: parseInt(form.idDepartamento, 10) },
          porcentajeMinAsistencia: parseInt(form.porcentajeMinAsistencia, 10),
        }),
      });

      if (res.ok) {
        alert("✅ Asignatura creada con éxito");
        navigate("/home"); // 👈 Redirige al home
      } else {
        alert("❌ Error al crear asignatura");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Error de conexión con el servidor");
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <h2>Crear Asignatura</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />

          <label>Código</label>
          <input
            type="text"
            name="codigo"
            value={form.codigo}
            onChange={handleChange}
            required
          />

          <label>Créditos</label>
          <input
            type="number"
            name="creditos"
            value={form.creditos}
            onChange={handleChange}
            required
          />

          <label>Departamento</label>
          <select
            name="idDepartamento"
            value={form.idDepartamento}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un departamento</option>
            {departamentos.map((d) => (
              <option key={d.idDepartamento} value={d.idDepartamento}>
                {d.nombre}
              </option>
            ))}
          </select>

          <label>% Mínimo de Asistencia</label>
          <input
            type="number"
            name="porcentajeMinAsistencia"
            value={form.porcentajeMinAsistencia}
            onChange={handleChange}
            min="0"
            max="100"
            required
          />

          <div className="form-buttons">
            <button type="submit">Crear</button>
            <button
              type="button"
              className="volver"
              onClick={() => navigate("/home")}
            >
              ⬅ Volver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearAsignatura;

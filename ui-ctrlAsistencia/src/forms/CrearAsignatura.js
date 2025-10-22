import React, { useState } from "react";
import "./CrearAsignatura.css";

//-----------------------------------

function CrearAsignatura() {
  const [form, setForm] = useState({
    nombre: "",
    codigo: "",
    creditos: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:8080/api/asignatura/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        alert("✅ Asignatura creada con éxito");
        setForm({ nombre: "", codigo: "", creditos: "" });
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
          <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />

          <label>Código</label>
          <input type="text" name="codigo" value={form.codigo} onChange={handleChange} required />

          <label>Créditos</label>
          <input type="number" name="creditos" value={form.creditos} onChange={handleChange} required />

          <button type="submit">Crear</button>
        </form>
      </div>
    </div>
  );
}

export default CrearAsignatura;

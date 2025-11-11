import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Form.css";

function CrearEstudiante() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    rut: "",
    correo: "",
    contrasenia: "",
    idCarrera: ""
  });

  const [carreras, setCarreras] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/api/carrera/lista", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setCarreras(data))
      .catch(err => console.error("Error cargando carreras:", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:8080/api/estudiante/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          carrera: { idCarrera: form.idCarrera }
        })
      });

      if (res.ok) {
        alert("Estudiante creado con éxito");
        navigate("/home");
      } else {
        alert("Error al crear estudiante");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <h2>Crear Estudiante</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre</label>
          <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />

          <label>Apellido</label>
          <input type="text" name="apellido" value={form.apellido} onChange={handleChange} required />

          <label>RUT</label>
          <input type="text" name="rut" value={form.rut} onChange={handleChange} required />

          <label>Correo</label>
          <input type="email" name="correo" value={form.correo} onChange={handleChange} required />

          <label>Contraseña</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="contrasenia"
              value={form.contrasenia}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>


          <label>Carrera</label>
          <select name="idCarrera" value={form.idCarrera} onChange={handleChange} required>
            <option value="">Seleccione una carrera</option>
            {carreras.map((carrera) => (
              <option key={carrera.idCarrera} value={carrera.idCarrera}>
                {carrera.nombre}
              </option>
            ))}
          </select>

          <div className="form-buttons">
            <button type="button" className="volver" onClick={() => navigate("/home")}>
              ⬅ Volver
            </button>
            <button type="button" className="volver" onClick={() => navigate("/admin/estudiantes/csv")}>
              Importar CSV
            </button>
            <button type="submit">Crear</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearEstudiante;

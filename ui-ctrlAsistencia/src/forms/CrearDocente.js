import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Form.css";

function CrearDocente() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    rut: "",
    correo: "",
    contrasenia: "",
    idDepartamento: ""
  });

  const [departamentos, setDepartamentos] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Cargar departamentos desde backend
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/api/departamento/lista", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setDepartamentos(data))
      .catch(err => console.error("Error cargando departamentos:", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:8080/api/docente/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          departamento: { idDepartamento: form.idDepartamento }
        })
      });

      if (res.ok) {
        alert("Docente creado con éxito");
        navigate("/home");
      } else {
        alert("Error al crear docente");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <h2>Crear Docente</h2>
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

          <label>Departamento</label>
          <select name="idDepartamento" value={form.idDepartamento} onChange={handleChange} required>
            <option value="">Seleccione un departamento</option>
            {departamentos.map((dep) => (
              <option key={dep.idDepartamento} value={dep.idDepartamento}>
                {dep.nombre}
              </option>
            ))}
          </select>

          <div className="form-buttons">
            <button type="button" className="volver" onClick={() => navigate("/home")}>
              ⬅ Volver
            </button>
            <button type="button" className="volver" onClick={() => navigate("/admin/docentes/csv")}>
              Importar CSV
            </button>
            <button type="submit">Crear</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearDocente;

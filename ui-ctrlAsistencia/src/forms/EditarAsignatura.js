import React, { useEffect, useState } from "react";
import "./Form.css";

function EditarAsignatura() {
  const [asignaturas, setAsignaturas] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    codigo: "",
    creditos: "",
    idDepartamento: "",
    porcentajeMinAsistencia: ""
  });

  const token = localStorage.getItem("token");

  // cargar asignaturas y departamentos
  useEffect(() => {
    fetch("http://localhost:8080/api/asignatura/lista", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setAsignaturas(data));

    fetch("http://localhost:8080/api/departamento/lista", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setDepartamentos(data));
  }, [token]);

  const handleSelect = (e) => {
    const id = e.target.value;
    const asignatura = asignaturas.find(a => a.idAsignatura == id);
    setSeleccionada(asignatura);
    setForm({
      nombre: asignatura.nombre,
      codigo: asignatura.codigo,
      creditos: asignatura.creditos,
      idDepartamento: asignatura.departamento?.idDepartamento || "",
      porcentajeMinAsistencia: asignatura.porcentajeMinAsistencia
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:8080/api/asignatura/actualizar/${seleccionada.idAsignatura}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nombre: form.nombre,
            codigo: form.codigo,
            creditos: parseInt(form.creditos, 10),
            departamento: { idDepartamento: parseInt(form.idDepartamento, 10) },
            porcentajeMinAsistencia: parseInt(form.porcentajeMinAsistencia, 10)
          }),
        }
      );

      if (res.ok) {
        alert("Asignatura actualizada");
      } else {
        alert("Error al actualizar");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión");
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <h2>Editar Asignatura</h2>

        <select onChange={handleSelect} defaultValue="">
          <option value="" disabled>Selecciona una asignatura</option>
          {asignaturas.map((a) => (
            <option key={a.idAsignatura} value={a.idAsignatura}>
              {a.nombre} ({a.codigo})
            </option>
          ))}
        </select>

        {seleccionada && (
          <form onSubmit={handleSubmit}>
            <label>Nombre</label>
            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />

            <label>Código</label>
            <input type="text" name="codigo" value={form.codigo} onChange={handleChange} required />

            <label>Créditos</label>
            <input type="number" name="creditos" value={form.creditos} onChange={handleChange} required />

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

            <label>Porcentaje mínimo de asistencia</label>
            <input
              type="number"
              name="porcentajeMinAsistencia"
              value={form.porcentajeMinAsistencia}
              onChange={handleChange}
              min="0"
              max="100"
              required
            />

            <button type="submit">Actualizar</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default EditarAsignatura;

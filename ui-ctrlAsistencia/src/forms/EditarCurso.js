import React, { useEffect, useState } from "react";
import "./Form.css";

function EditarCurso() {
  const [cursos, setCursos] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [form, setForm] = useState({
    idAsignatura: "",
    idDocente: "",
    idPeriodo: "",
    seccion: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const headers = { Authorization: "Bearer " + token };

    Promise.all([
      fetch("http://localhost:8080/api/curso/lista", { headers }).then(r => r.json()),
      fetch("http://localhost:8080/api/asignatura/lista", { headers }).then(r => r.json()),
      fetch("http://localhost:8080/api/docente/lista", { headers }).then(r => r.json()),
      fetch("http://localhost:8080/api/periodo/lista", { headers }).then(r => r.json())
    ])
      .then(([cData, aData, dData, pData]) => {
        setCursos(Array.isArray(cData) ? cData : []);
        setAsignaturas(Array.isArray(aData) ? aData : []);
        setDocentes(Array.isArray(dData) ? dData : []);
        setPeriodos(Array.isArray(pData) ? pData : []);
      })
      .catch(err => {
        console.error("Error cargando datos de curso:", err);
        setCursos([]); setAsignaturas([]); setDocentes([]); setPeriodos([]);
      });
  }, [token]);

  const handleSelect = (e) => {
    const id = e.target.value;
    const c = cursos.find(x => String(x.idCurso) === String(id));
    setSeleccionado(c || null);

    if (c) {
      setForm({
        idAsignatura: c.asignatura?.idAsignatura || "",
        idDocente: c.docente?.idDocente || "",
        idPeriodo: c.periodo?.idPeriodo || "",
        seccion: c.seccion || ""
      });
    } else {
      setForm({ idAsignatura: "", idDocente: "", idPeriodo: "", seccion: "" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!seleccionado) return alert("Seleccione un curso primero.");

    const payload = {
      asignatura: { idAsignatura: parseInt(form.idAsignatura, 10) },
      docente: { idDocente: parseInt(form.idDocente, 10) },
      periodo: { idPeriodo: parseInt(form.idPeriodo, 10) },
      seccion: form.seccion
    };

    try {
      const res = await fetch(`http://localhost:8080/api/curso/actualizar/${seleccionado.idCurso}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("Curso actualizado correctamente");
        // actualizar lista local (opcional)
      } else {
        const text = await res.text();
        console.error("Error actualizar curso:", res.status, text);
        alert("Error al actualizar curso");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
    }
  };

  const periodoLabel = (p) => {
    if (!p) return "Periodo desconocido";
    // usa año y semestre si están presentes
    const anio = p.anio !== undefined && p.anio !== null ? p.anio : "Año?";
    const sem = p.semestre !== undefined && p.semestre !== null ? p.semestre : "?";
    return `${anio} - Semestre ${sem}`;
  };

  return React.createElement("div", { className: "form-wrapper" },
    React.createElement("div", { className: "form-card" },
      React.createElement("h2", null, "Editar Curso"),
      React.createElement("select", { onChange: handleSelect, defaultValue: "" },
        React.createElement("option", { value: "", disabled: true }, "Selecciona un curso"),
        cursos.map(c =>
          React.createElement("option", { key: c.idCurso, value: c.idCurso },
            (c.asignatura?.nombre || "Sin asignatura") + " - Sección " + (c.seccion || "?") + " (" + (c.docente ? (c.docente.nombre + " " + (c.docente.apellido || "")) : "Sin docente") + ")"
          )
        )
      ),
      seleccionado && React.createElement("form", { onSubmit: handleSubmit },
        React.createElement("label", null, "Asignatura"),
        React.createElement("select", { name: "idAsignatura", value: form.idAsignatura, onChange: handleChange, required: true },
          React.createElement("option", { value: "" }, "Seleccione una asignatura"),
          asignaturas.map(a =>
            React.createElement("option", { key: a.idAsignatura, value: a.idAsignatura }, a.nombre)
          )
        ),
        React.createElement("label", null, "Docente"),
        React.createElement("select", { name: "idDocente", value: form.idDocente, onChange: handleChange, required: true },
          React.createElement("option", { value: "" }, "Seleccione un docente"),
          docentes.map(d =>
            React.createElement("option", { key: d.idDocente, value: d.idDocente }, (d.nombre || "") + " " + (d.apellido || ""))
          )
        ),
        React.createElement("label", null, "Periodo Académico"),
        React.createElement("select", { name: "idPeriodo", value: form.idPeriodo, onChange: handleChange, required: true },
          React.createElement("option", { value: "" }, "Seleccione un periodo"),
          periodos.map(p =>
            React.createElement("option", { key: p.idPeriodo, value: p.idPeriodo }, periodoLabel(p))
          )
        ),
        React.createElement("label", null, "Sección"),
        React.createElement("input", { type: "text", name: "seccion", value: form.seccion, onChange: handleChange, required: true }),
        React.createElement("div", { style: { marginTop: 12 } },
          React.createElement("button", { type: "submit" }, "Actualizar")
        )
      )
    )
  );
}

export default EditarCurso;

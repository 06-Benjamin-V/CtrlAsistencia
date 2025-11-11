import React, { useEffect, useState } from "react";
import "./Form.css";

function EditarEstudiante() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    rut: "",
    correo: "",
    contrasenia: "",
    idCarrera: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const headers = { Authorization: "Bearer " + token };

    Promise.all([
      fetch("http://localhost:8080/api/estudiante/lista", { headers }).then(r => r.json()),
      fetch("http://localhost:8080/api/carrera/lista", { headers }).then(r => r.json())
    ])
      .then(([estData, carData]) => {
        setEstudiantes(Array.isArray(estData) ? estData : []);
        setCarreras(Array.isArray(carData) ? carData : []);
      })
      .catch(err => {
        console.error("Error cargando estudiantes/carreras:", err);
        setEstudiantes([]);
        setCarreras([]);
      });
  }, [token]);

  const handleSelect = (e) => {
    const id = e.target.value;
    const s = estudiantes.find(x => String(x.idEstudiante) === String(id));
    setSeleccionado(s || null);

    if (s) {
      setForm({
        nombre: s.nombre || "",
        apellido: s.apellido || "",
        rut: s.rut || "",
        correo: s.correo || "",
        contrasenia: "", // no mostramos hash
        idCarrera: s.carrera?.idCarrera || ""
      });
    } else {
      setForm({ nombre: "", apellido: "", rut: "", correo: "", contrasenia: "", idCarrera: "" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!seleccionado) return alert("Seleccione un estudiante primero.");

    const payload = {
      nombre: form.nombre,
      apellido: form.apellido,
      rut: form.rut,
      correo: form.correo,
      carrera: { idCarrera: parseInt(form.idCarrera, 10) }
    };

    if (form.contrasenia && form.contrasenia.trim() !== "") {
      payload.contrasenia = form.contrasenia;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/estudiante/actualizar/${seleccionado.idEstudiante}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
          body: JSON.stringify(payload)
        }
      );

      if (res.ok) {
        alert("Estudiante actualizado correctamente");
        // actualizar lista localmente
        const updated = { ...seleccionado, ...payload };
        setEstudiantes(prev => prev.map(s => s.idEstudiante === seleccionado.idEstudiante ? updated : s));
        setSeleccionado(updated);
        setForm(prev => ({ ...prev, contrasenia: "" }));
      } else {
        const text = await res.text();
        console.error("Error actualizar estudiante:", res.status, text);
        alert("Error al actualizar estudiante");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
    }
  };

  return React.createElement("div", { className: "form-wrapper" },
    React.createElement("div", { className: "form-card" },
      React.createElement("h2", null, "Editar Estudiante"),
      React.createElement("select", { onChange: handleSelect, defaultValue: "" },
        React.createElement("option", { value: "", disabled: true }, "Selecciona un estudiante"),
        estudiantes.map(s =>
          React.createElement("option", { key: s.idEstudiante, value: s.idEstudiante },
            (s.nombre || "") + " " + (s.apellido || "") + (s.rut ? ` (${s.rut})` : "")
          )
        )
      ),
      seleccionado && React.createElement("form", { onSubmit: handleSubmit },
        React.createElement("label", null, "Nombre"),
        React.createElement("input", { type: "text", name: "nombre", value: form.nombre, onChange: handleChange, required: true }),
        React.createElement("label", null, "Apellido"),
        React.createElement("input", { type: "text", name: "apellido", value: form.apellido, onChange: handleChange, required: true }),
        React.createElement("label", null, "RUT"),
        React.createElement("input", { type: "text", name: "rut", value: form.rut, onChange: handleChange, required: true }),
        React.createElement("label", null, "Correo"),
        React.createElement("input", { type: "email", name: "correo", value: form.correo, onChange: handleChange, required: true }),
        React.createElement("label", null, "Nueva contraseña (opcional)"),
        React.createElement("input", { type: "password", name: "contrasenia", value: form.contrasenia, onChange: handleChange, placeholder: "Dejar vacío para no cambiar" }),
        React.createElement("label", null, "Carrera"),
        React.createElement("select", { name: "idCarrera", value: form.idCarrera, onChange: handleChange, required: true },
          React.createElement("option", { value: "" }, "Seleccione una carrera"),
          carreras.map(c =>
            React.createElement("option", { key: c.idCarrera, value: c.idCarrera }, c.nombre)
          )
        ),
        React.createElement("div", { style: { marginTop: 12 } },
          React.createElement("button", { type: "submit" }, "Actualizar")
        )
      )
    )
  );
}

export default EditarEstudiante;

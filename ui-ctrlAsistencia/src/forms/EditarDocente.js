import React, { useEffect, useState } from "react";
import "./Form.css";

function EditarDocente() {
  const [docentes, setDocentes] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    rut: "",
    correo: "",
    contrasenia: "",
    idDepartamento: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const headers = { Authorization: "Bearer " + token };

    // Cargar listas
    Promise.all([
      fetch("http://localhost:8080/api/docente/lista", { headers }).then(r => r.json()),
      fetch("http://localhost:8080/api/departamento/lista", { headers }).then(r => r.json())
    ])
      .then(([docData, depData]) => {
        setDocentes(Array.isArray(docData) ? docData : []);
        setDepartamentos(Array.isArray(depData) ? depData : []);
      })
      .catch(err => {
        console.error("Error cargando docentes/departamentos:", err);
        setDocentes([]);
        setDepartamentos([]);
      });
  }, [token]);

  const handleSelect = (e) => {
    const id = e.target.value;
    const d = docentes.find(x => String(x.idDocente) === String(id));
    setSeleccionado(d || null);

    if (d) {
      setForm({
        nombre: d.nombre || "",
        apellido: d.apellido || "",
        rut: d.rut || "",
        correo: d.correo || "",
        contrasenia: "", // nunca mostramos hash: campo vacío
        idDepartamento: d.departamento?.idDepartamento || ""
      });
    } else {
      setForm({
        nombre: "", apellido: "", rut: "", correo: "", contrasenia: "", idDepartamento: ""
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!seleccionado) return alert("Seleccione un docente primero.");

    const payload = {
      nombre: form.nombre,
      apellido: form.apellido,
      rut: form.rut,
      correo: form.correo,
      departamento: { idDepartamento: parseInt(form.idDepartamento, 10) }
    };

    // Solo enviar nueva contraseña si usuario escribió algo
    if (form.contrasenia && form.contrasenia.trim() !== "") {
      payload.contrasenia = form.contrasenia;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/docente/actualizar/${seleccionado.idDocente}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
          body: JSON.stringify(payload)
        }
      );

      if (res.ok) {
        alert("Docente actualizado correctamente");
        // actualizar lista localmente (opcional: refrescar desde backend)
        const updated = { ...seleccionado, ...payload };
        setDocentes(prev => prev.map(d => d.idDocente === seleccionado.idDocente ? updated : d));
        setSeleccionado(updated);
        setForm(prev => ({ ...prev, contrasenia: "" })); // limpiar campo contraseña
      } else {
        const text = await res.text();
        console.error("Error actualizar docente:", res.status, text);
        alert("Error al actualizar docente");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
    }
  };

  return React.createElement("div", { className: "form-wrapper" },
    React.createElement("div", { className: "form-card" },
      React.createElement("h2", null, "Editar Docente"),
      React.createElement("select", { onChange: handleSelect, defaultValue: "" },
        React.createElement("option", { value: "", disabled: true }, "Selecciona un docente"),
        docentes.map(d =>
          React.createElement("option", { key: d.idDocente, value: d.idDocente },
            (d.nombre || "") + " " + (d.apellido || "") + (d.rut ? ` (${d.rut})` : "")
          )
        )
      ),
      seleccionado && React.createElement("form", { onSubmit: handleSubmit },
        React.createElement("label", null, "Nombre"),
        React.createElement("input", {
          type: "text", name: "nombre", value: form.nombre, onChange: handleChange, required: true
        }),
        React.createElement("label", null, "Apellido"),
        React.createElement("input", {
          type: "text", name: "apellido", value: form.apellido, onChange: handleChange, required: true
        }),
        React.createElement("label", null, "RUT"),
        React.createElement("input", {
          type: "text", name: "rut", value: form.rut, onChange: handleChange, required: true
        }),
        React.createElement("label", null, "Correo"),
        React.createElement("input", {
          type: "email", name: "correo", value: form.correo, onChange: handleChange, required: true
        }),
        React.createElement("label", null, "Nueva contraseña (opcional)"),
        React.createElement("input", {
          type: "password", name: "contrasenia", value: form.contrasenia,
          onChange: handleChange, placeholder: "Dejar vacío para no cambiar"
        }),
        React.createElement("label", null, "Departamento"),
        React.createElement("select", {
          name: "idDepartamento", value: form.idDepartamento, onChange: handleChange, required: true
        },
          React.createElement("option", { value: "" }, "Seleccione un departamento"),
          departamentos.map(dep =>
            React.createElement("option", { key: dep.idDepartamento, value: dep.idDepartamento }, dep.nombre)
          )
        ),
        React.createElement("div", { style: { marginTop: 12 } },
          React.createElement("button", { type: "submit" }, "Actualizar")
        )
      )
    )
  );
}

export default EditarDocente;

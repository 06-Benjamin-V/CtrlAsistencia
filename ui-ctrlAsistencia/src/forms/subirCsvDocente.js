import React, { useEffect, useState } from "react";
import "./subirCsv.css";

// Componente para importar docentes mediante archivos CSV con validación en tiempo real
function SubirCsvDocentes() {
  // Estados para gestionar archivo, filas y lista de departamentos
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const token = localStorage.getItem("token");

  // Carga los departamentos disponibles al montar el componente
  useEffect(() => {
    fetch("http://localhost:8080/api/departamento/lista", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(setDepartamentos)
      .catch(() => setDepartamentos([]));
  }, []);

  // Retorna el nombre de un departamento según su ID
  const nombreDepartamento = (id) => {
    const found = departamentos.find(d => d.idDepartamento === id);
    return found ? found.nombre : "";
  };

  // Actualiza una fila específica con nuevos valores
  const updateRow = (idx, patch) => {
    setRows(prev => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  // Procesa el archivo CSV y obtiene vista previa validada
  const handleUpload = async () => {
    if (!file) return alert("Seleccione un archivo CSV");

    const fd = new FormData();
    fd.append("file", file);

    const r = await fetch("http://localhost:8080/api/csv/docentes/preview", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd
    });

    const data = await r.json();

    // Procesa los datos separando el RUT en sus componentes
    const flat = data.map(item => {
      const [cuerpo, dv] = item.data.rut ? item.data.rut.split("-") : ["", ""];
      return {
        ...item.data,
        rutCuerpo: cuerpo,
        rutDV: dv,
        rut: item.data.rut,
        valido: item.valido,
        mensaje: item.mensaje,
        departamentoNombre: nombreDepartamento(item.data.idDepartamento)
      };
    });

    setRows(flat);
  };

  // Valida una fila contra el backend
  const validarFila = async (idx, fila) => {
    const r = await fetch("http://localhost:8080/api/csv/docentes/validate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nombre: fila.nombre,
        apellido: fila.apellido,
        rut: fila.rut,
        correo: fila.correo,
        idDepartamento: fila.idDepartamento,
        contrasenia: fila.contrasenia
      })
    });

    const res = await r.json();

    updateRow(idx, {
      valido: res.valido,
      mensaje: res.mensaje || "",
      departamentoNombre: nombreDepartamento(fila.idDepartamento)
    });
  };

  // Maneja la edición de campos y revalida la fila automáticamente
  const handleEdit = (idx, field, value) => {
    setRows(prev => {
      const updated = prev.map((r, i) =>
        i === idx ? { ...r, [field]: value } : r
      );

      const fila = updated[idx];

      // Reconstruye el RUT completo cuando se editan sus partes
      fila.rut = `${fila.rutCuerpo || ""}-${fila.rutDV || ""}`;
      if (field === "idDepartamento") {
        fila.departamentoNombre = nombreDepartamento(value);
      }

      setTimeout(() => validarFila(idx, fila), 0);
      return updated;
    });
  };

  // Elimina una fila de la tabla
  const removeRow = (idx) => {
    setRows(prev => prev.filter((_, i) => i !== idx));
  };

  // Confirma la importación enviando solo filas válidas
  const handleConfirm = async () => {
    const payload = rows.filter(r => r.valido)
      .map(({ nombre, apellido, rut, correo, idDepartamento, contrasenia }) => ({
        nombre, apellido, rut, correo, idDepartamento, contrasenia
      }));

    if (payload.length === 0) return alert("No hay filas válidas");

    const r = await fetch("http://localhost:8080/api/csv/docentes/confirm", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const res = await r.json();

    if (res.ok) {
      alert("Docentes importados correctamente");
      setRows([]);
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="csv-page">
      <div className="csv-card">

        <div className="csv-head">
          <h2>Importar docentes</h2>
        </div>

        {/* Sección para seleccionar y cargar el archivo CSV */}
        <div className="csv-upload">
          <input type="file" accept=".csv" onChange={e => setFile(e.target.files[0])} />
          <button className="btn-primary" onClick={handleUpload}>Subir y validar</button>
        </div>

        {/* Tabla editable con los datos del CSV */}
        {rows.length > 0 && (
          <table className="csv-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>RUT</th>
                <th>Correo</th>
                <th>Departamento</th>
                <th>Contraseña</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {/* Filas editables con validación automática */}
              {rows.map((row, idx) => (
                <tr key={idx} className={row.valido ? "ok" : "bad"}>

                  <td><input value={row.nombre} onChange={e => handleEdit(idx, "nombre", e.target.value)} /></td>
                  <td><input value={row.apellido} onChange={e => handleEdit(idx, "apellido", e.target.value)} /></td>

                  {/* Campos separados para el RUT */}
                  <td className="rut-group">
                    <input
                      className="rut-input"
                      value={row.rutCuerpo || ""}
                      maxLength={8}
                      onChange={e => handleEdit(idx, "rutCuerpo", e.target.value.replace(/[^0-9]/g, ""))}
                    />
                    <span>-</span>
                    <input
                      className="dv-input"
                      value={row.rutDV || ""}
                      maxLength={1}
                      onChange={e => handleEdit(idx, "rutDV", e.target.value.toUpperCase().replace(/[^0-9K]/g, ""))}
                    />
                  </td>

                  <td><input value={row.correo} onChange={e => handleEdit(idx, "correo", e.target.value)} /></td>

                  {/* Selector de departamento */}
                  <td>
                    <select
                      value={row.idDepartamento ?? ""}
                      onChange={e => handleEdit(idx, "idDepartamento", Number(e.target.value))}
                    >
                      <option value="">Seleccionar</option>
                      {departamentos.map(d => (
                        <option key={d.idDepartamento} value={d.idDepartamento}>{d.nombre}</option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <input
                      type="text"
                      value={row.contrasenia || ""}
                      onChange={e => handleEdit(idx, "contrasenia", e.target.value)}
                    />
                  </td>

                  <td>{row.mensaje}</td>
                  <td><button className="btn-mini btn-red" onClick={() => removeRow(idx)}>X</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Botón de confirmación deshabilitado si existen filas inválidas */}
        {rows.length > 0 && (
          <button
            className="btn-success submit-btn"
            onClick={handleConfirm}
            disabled={rows.some(r => !r.valido)}
          >
            Confirmar
          </button>
        )}
      </div>
    </div>
  );
}

export default SubirCsvDocentes;
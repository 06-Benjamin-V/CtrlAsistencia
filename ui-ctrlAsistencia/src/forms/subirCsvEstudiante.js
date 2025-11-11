import React, { useEffect, useState } from "react";
import "./subirCsv.css";

// Componente para importar estudiantes mediante archivos CSV con validación en tiempo real
function SubirCsvEstudiantes() {
  // Estados para manejar el archivo, filas del CSV y lista de carreras disponibles
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const token = localStorage.getItem("token");

  // Carga la lista de carreras disponibles al iniciar el componente
  useEffect(() => {
    fetch("http://localhost:8080/api/carrera/lista", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(setCarreras)
      .catch(() => setCarreras([]));
  }, []);

  // Obtiene el nombre de una carrera dado su ID
  const nombreCarrera = (idCarrera) => {
    const found = carreras.find(c => c.idCarrera === idCarrera);
    return found ? found.nombre : "";
  };

  // Actualiza una fila específica del array con nuevos valores
  const updateRow = (idx, patch) => {
    setRows(prev => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  // Sube el CSV y obtiene una vista previa con validación inicial
  const handleUpload = async () => {
    if (!file) return alert("Seleccione un archivo CSV");

    const fd = new FormData();
    fd.append("file", file);

    const r = await fetch("http://localhost:8080/api/csv/estudiantes/preview", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd
    });

    const data = await r.json();

    // Procesa los datos recibidos, separando el RUT en cuerpo y dígito verificador
    const flat = data.map(item => {
      const [cuerpo, dv] = item.data.rut ? item.data.rut.split("-") : ["", ""];
      return {
        ...item.data,
        rutCuerpo: cuerpo,
        rutDV: dv,
        rut: item.data.rut,
        contrasenia: item.data.contrasenia || "",
        valido: item.valido,
        mensaje: item.mensaje,
        carreraNombre: nombreCarrera(item.data.idCarrera)
      };
    });

    setRows(flat);
  };

  // Valida una fila específica contra el backend
  const validarFila = async (idx, fila) => {
    const r = await fetch("http://localhost:8080/api/csv/estudiantes/validate", {
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
        idCarrera: fila.idCarrera,
        contrasenia: fila.contrasenia
      })
    });

    const res = await r.json();

    updateRow(idx, {
      valido: res.valido,
      mensaje: res.mensaje || "",
      carreraNombre: nombreCarrera(fila.idCarrera)
    });
  };

  // Maneja la edición de campos y revalida automáticamente
  const handleEdit = (idx, field, value) => {
    setRows(prev => {
      const updated = prev.map((r, i) =>
        i === idx ? { ...r, [field]: value } : r
      );

      const fila = updated[idx];

      // Reconstruye el RUT completo al editar sus componentes
      fila.rut = `${fila.rutCuerpo || ""}-${fila.rutDV || ""}`;
      if (field === "idCarrera") {
        fila.carreraNombre = nombreCarrera(value);
      }

      setTimeout(() => validarFila(idx, fila), 0);
      return updated;
    });
  };

  // Elimina una fila de la tabla
  const removeRow = (idx) => {
    setRows(prev => prev.filter((_, i) => i !== idx));
  };

  // Confirma la importación enviando solo las filas válidas al backend
  const handleConfirm = async () => {
    const payload = rows.filter(r => r.valido)
      .map(({ nombre, apellido, rut, correo, idCarrera, contrasenia }) => ({
        nombre, apellido, rut, correo, idCarrera, contrasenia
      }));

    if (payload.length === 0) return alert("No hay filas válidas");

    const r = await fetch("http://localhost:8080/api/csv/estudiantes/confirm", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const res = await r.json();

    if (res.ok) {
      alert("Importación realizada");
      setRows([]);
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="csv-page">
      <div className="csv-card">

        <div className="csv-head">
          <h2>Importar estudiantes</h2>
        </div>

        {/* Selector de archivo y botón de carga */}
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
                <th>Carrera</th>
                <th>Contraseña</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {/* Cada fila es editable y se valida en tiempo real */}
              {rows.map((row, idx) => (
                <tr key={idx} className={row.valido ? "ok" : "bad"}>

                  <td><input value={row.nombre} onChange={e => handleEdit(idx, "nombre", e.target.value)} /></td>
                  <td><input value={row.apellido} onChange={e => handleEdit(idx, "apellido", e.target.value)} /></td>

                  {/* Campos separados para cuerpo y dígito verificador del RUT */}
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

                  {/* Selector de carrera */}
                  <td>
                    <select
                      value={row.idCarrera ?? ""}
                      onChange={e => handleEdit(idx, "idCarrera", Number(e.target.value))}
                    >
                      <option value="">Seleccionar</option>
                      {carreras.map(c => (
                        <option key={c.idCarrera} value={c.idCarrera}>{c.nombre}</option>
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

        {/* Botón de confirmación deshabilitado si hay filas inválidas */}
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

export default SubirCsvEstudiantes;
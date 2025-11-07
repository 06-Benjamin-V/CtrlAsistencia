import React, { useEffect, useState } from "react";
import "./subirCsvEstudiante.css";

function SubirCsvEstudiantes() {
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8080/api/carrera/lista", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(setCarreras)
      .catch(() => setCarreras([]));
  }, []);

  const nombreCarrera = (idCarrera) => {
    const found = carreras.find(c => c.idCarrera === idCarrera);
    return found ? found.nombre : "—";
  };

  const updateRow = (idx, patch) => {
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, ...patch } : r));
  };

  const handleUpload = async () => {
    if (!file) return alert("Selecciona un CSV!");

    const fd = new FormData();
    fd.append("file", file);

    const r = await fetch("http://localhost:8080/api/csv/estudiantes/preview", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd
    });

    const data = await r.json();

    const flat = data.map(item => ({
      ...item.data,
      valido: item.valido,
      mensaje: item.mensaje,
      carreraNombre: nombreCarrera(item.data.idCarrera)
    }));

    setRows(flat);
  };

  const validarFila = async (idx, fila) => {
    const r = await fetch("http://localhost:8080/api/csv/estudiantes/validate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: fila.nombre,
        apellido: fila.apellido,
        rut: fila.rut,
        correo: fila.correo,
        idCarrera: fila.idCarrera
      })
    });

    const res = await r.json();

    updateRow(idx, {
      valido: res.valido,
      mensaje: res.valido ? "✅" : res.mensaje,
      carreraNombre: nombreCarrera(fila.idCarrera)
    });
  };

  // ✅ Fix react sync bug: validate AFTER updating state
  const handleEdit = (idx, field, value) => {
    setRows(prev => {
      const updated = prev.map((r, i) => 
        i === idx ? { ...r, [field]: value } : r
      );

      // actualizar nombre carrera
      if (field === "idCarrera") {
        updated[idx].carreraNombre = nombreCarrera(value);
      }

      // validar usando valores nuevos
      setTimeout(() => validarFila(idx, updated[idx]), 0);

      return updated;
    });
  };

  const removeRow = (idx) => {
    setRows(prev => prev.filter((_, i) => i !== idx));
  };

  const handleConfirm = async () => {
    const payload = rows.filter(r => r.valido)
      .map(({ nombre, apellido, rut, correo, idCarrera }) => ({
        nombre, apellido, rut, correo, idCarrera
      }));

    if (payload.length === 0) return alert("No hay filas válidas!");

    const r = await fetch("http://localhost:8080/api/csv/estudiantes/confirm", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    let res;
    try { res = await r.json(); }
    catch { return alert("⚠️ Error JSON backend"); }

    if (res.ok) {
      alert("✅ Importación exitosa!");
      setRows([]);
    } else {
      alert("❌ Error: " + res.error);
    }
  };

  const descargarPlantilla = () => {
    const csv = [
      "nombre,apellido,rut,correo,idCarrera",
      "Juan,Perez,12345678-5,juan.perez@ufromail.cl,1",
      "Ana,Gonzalez,23456789-K,ana.gonzalez@ufromail.cl,2"
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plantilla_estudiantes.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="csv-page">
      <div className="csv-card">

        <div className="csv-head">
          <h2>Importar Estudiantes (CSV)</h2>
          <button className="btn-secondary" onClick={descargarPlantilla}>
            Descargar plantilla
          </button>
        </div>

        <div className="csv-upload">
          <input type="file" accept=".csv" onChange={e => setFile(e.target.files[0])} />
          <button className="btn-primary" onClick={handleUpload}>Subir y verificar</button>
        </div>

        {rows.length > 0 && (
          <table className="csv-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>RUT</th>
                <th>Correo</th>
                <th>Carrera</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} className={row.valido ? "ok" : "bad"}>
                  
                  <td><input value={row.nombre} onChange={e => handleEdit(idx, "nombre", e.target.value)} /></td>
                  <td><input value={row.apellido} onChange={e => handleEdit(idx, "apellido", e.target.value)} /></td>
                  <td><input value={row.rut} onChange={e => handleEdit(idx, "rut", e.target.value)} /></td>
                  <td><input value={row.correo} onChange={e => handleEdit(idx, "correo", e.target.value)} /></td>

                  <td>
                    <select
                      value={row.idCarrera ?? ""}
                      onChange={e => handleEdit(idx, "idCarrera", Number(e.target.value))}
                    >
                      <option value="" disabled>Seleccionar…</option>
                      {carreras.map(c => (
                        <option key={c.idCarrera} value={c.idCarrera}>{c.nombre}</option>
                      ))}
                    </select>
                    <div className="hint">{row.carreraNombre}</div>
                  </td>

                  <td>{row.valido ? "✅" : row.mensaje}</td>

                  <td><button className="btn-mini btn-red" onClick={() => removeRow(idx)}>X</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {rows.length > 0 && (
          <button
            className="btn-success submit-btn"
            onClick={handleConfirm}
            disabled={rows.some(r => !r.valido)}
          >
            Confirmar importación
          </button>
        )}
      </div>
    </div>
  );
}

export default SubirCsvEstudiantes;

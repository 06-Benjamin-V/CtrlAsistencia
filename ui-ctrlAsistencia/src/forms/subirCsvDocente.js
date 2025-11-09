import React, { useEffect, useState } from "react";
import "./subirCsv.css";

function SubirCsvDocentes() {
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8080/api/departamento/lista", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(setDepartamentos)
      .catch(() => setDepartamentos([]));
  }, []);

  const nombreDepartamento = (id) => {
    const found = departamentos.find(d => d.idDepartamento === id);
    return found ? found.nombre : "";
  };

  const updateRow = (idx, patch) => {
    setRows(prev => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

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
        contrasenia: fila.contrasenia   // ✅ validar password también
      })
    });

    const res = await r.json();

    updateRow(idx, {
      valido: res.valido,
      mensaje: res.mensaje || "",
      departamentoNombre: nombreDepartamento(fila.idDepartamento)
    });
  };

  const handleEdit = (idx, field, value) => {
    setRows(prev => {
      const updated = prev.map((r, i) =>
        i === idx ? { ...r, [field]: value } : r
      );

      const fila = updated[idx];

      fila.rut = `${fila.rutCuerpo || ""}-${fila.rutDV || ""}`;
      if (field === "idDepartamento") {
        fila.departamentoNombre = nombreDepartamento(value);
      }

      setTimeout(() => validarFila(idx, fila), 0);
      return updated;
    });
  };

  const removeRow = (idx) => {
    setRows(prev => prev.filter((_, i) => i !== idx));
  };

  const handleConfirm = async () => {
    const payload = rows.filter(r => r.valido)
      .map(({ nombre, apellido, rut, correo, idDepartamento, contrasenia }) => ({
        nombre, apellido, rut, correo, idDepartamento, contrasenia // ✅ mandar contraseña
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

        <div className="csv-upload">
          <input type="file" accept=".csv" onChange={e => setFile(e.target.files[0])} />
          <button className="btn-primary" onClick={handleUpload}>Subir y validar</button>
        </div>

        {rows.length > 0 && (
          <table className="csv-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>RUT</th>
                <th>Correo</th>
                <th>Departamento</th>
                <th>Contraseña</th> {/* ✅ Nuevo */}
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} className={row.valido ? "ok" : "bad"}>

                  <td><input value={row.nombre} onChange={e => handleEdit(idx, "nombre", e.target.value)} /></td>
                  <td><input value={row.apellido} onChange={e => handleEdit(idx, "apellido", e.target.value)} /></td>

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

                  {/* ✅ Campo contraseña editable */}
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

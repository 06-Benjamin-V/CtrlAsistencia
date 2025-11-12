import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Form.css";

function MarcarAsistencia() {
  const [codigo, setCodigo] = useState("");
  const [clase, setClase] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Obtener id del estudiante desde el JWT
  const getUserId = () => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.userId;
    } catch {
      return null;
    }
  };

  // Enviar código al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError(false);
    setClase(null);

    const idEstudiante = getUserId();
    if (!idEstudiante) {
      setMensaje("Error: no se pudo identificar al estudiante.");
      setError(true);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/asistencia/registrar-codigo/${codigo}/${idEstudiante}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Código inválido o expirado");
      }

      //Si el backend devuelve un JSON con los datos de la clase
      const data = await res.json().catch(() => null);

      if (data) {
        setClase(data);
        setMensaje("Te pusiste presente correctamente.");
      } else {
        setMensaje("Asistencia registrada correctamente.");
      }
    } catch (err) {
      setError(true);
      setMensaje(`❌ ${err.message}`);
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <h2>Registrar Asistencia</h2>

        {!clase ? (
          <form onSubmit={handleSubmit}>
            <label>Ingrese el código de la clase</label>
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              placeholder="Ej: AB1234"
              required
              maxLength={6}
            />

            <div className="form-buttons">
              <button type="submit">Confirmar asistencia</button>
              <button
                type="button"
                className="volver"
                onClick={() => navigate("/home")}
              >
                ⬅ Volver
              </button>
            </div>

            {mensaje && (
              <p
                style={{
                  color: error ? "red" : "green",
                  marginTop: "10px",
                  fontWeight: "bold",
                }}
              >
                {mensaje}
              </p>
            )}
          </form>
        ) : (
          <div className="codigo-generado">
            <h3 style={{ color: "green" }}>{mensaje}</h3>
            <p><b>Tema:</b> {clase.tema}</p>
            <p><b>Asignatura:</b> {clase.curso?.asignatura?.nombre}</p>
            <p><b>Sección:</b> {clase.curso?.seccion}</p>
            <p><b>Docente:</b> {clase.curso?.docente?.nombre}</p>
            <p><b>Fecha:</b> {clase.fecha}</p>

            <button className="volver" onClick={() => navigate("/home")}>
              Volver al inicio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MarcarAsistencia;

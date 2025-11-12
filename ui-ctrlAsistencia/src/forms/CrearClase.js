import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Form.css";

function CrearClase() {
  const [form, setForm] = useState({
    idCurso: "",
    tema: "",
    duracionMinutos: 5,
  });

  const [cursos, setCursos] = useState([]);
  const [codigo, setCodigo] = useState(null);
  const [expiraEn, setExpiraEn] = useState(null);
  const [segundosRestantes, setSegundosRestantes] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Cargar cursos del docente
  useEffect(() => {
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      fetch(`http://localhost:8080/api/curso/docente/${payload.userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Error al obtener cursos");
          return res.json();
        })
        .then(setCursos)
        .catch((err) => console.error("Error cargando cursos:", err));
    } catch (err) {
      console.error("Token inválido o corrupto:", err);
    }
  }, [token]);

  // Crear clase con código generado automáticamente
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = `http://localhost:8080/api/clase/crear-con-codigo?duracionMinutos=${parseInt(
        form.duracionMinutos,
        10
      )}`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          curso: { idCurso: parseInt(form.idCurso, 10) },
          fecha: new Date().toISOString().split("T")[0],
          tema: form.tema,
        }),
      });

      if (!res.ok) throw new Error("Error al crear clase");

      const data = await res.json();
      setCodigo(data.codigoAsistencia);
      setExpiraEn(data.codigoExpiraEn);

      const diff = Math.max(
        0,
        Math.floor((new Date(data.codigoExpiraEn).getTime() - Date.now()) / 1000)
      );
      setSegundosRestantes(diff);
    } catch (err) {
      console.error(err);
      alert("Error al crear clase");
    }
  };

  // Temporizador visual calculado en el front
  useEffect(() => {
    if (segundosRestantes === null) return;
    if (segundosRestantes <= 0) return;

    const interval = setInterval(() => {
      setSegundosRestantes((s) => Math.max(0, s - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [segundosRestantes]);

  // 🚀 Redirigir automáticamente cuando termine el contador
  useEffect(() => {
    if (segundosRestantes === 0 && codigo) {
      // Espera 1 segundo antes de redirigir para que se vea el 0s
      const timeout = setTimeout(() => {
        navigate("/home"); // 👈 cambia a "/asignaturas" si prefieres
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [segundosRestantes, codigo, navigate]);

  // Formato de hora local
  const formatHora = (fechaIso) => {
    if (!fechaIso) return "—";
    const fecha = new Date(fechaIso);
    if (isNaN(fecha)) return "—";
    return fecha.toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <h2>Crear Clase</h2>

        {!codigo ? (
          <form onSubmit={handleSubmit}>
            <label>Curso</label>
            <select
              name="idCurso"
              value={form.idCurso}
              onChange={(e) => setForm({ ...form, idCurso: e.target.value })}
              required
            >
              <option value="">Seleccione un curso</option>
              {cursos.map((c) => (
                <option key={c.idCurso} value={c.idCurso}>
                  {c.asignatura?.nombre} - Sección {c.seccion}
                </option>
              ))}
            </select>

            <label>Tema</label>
            <input
              type="text"
              name="tema"
              value={form.tema}
              onChange={(e) => setForm({ ...form, tema: e.target.value })}
              required
            />

            <label>Duración (minutos)</label>
            <input
              type="number"
              name="duracionMinutos"
              min="1"
              max="120"
              value={form.duracionMinutos}
              onChange={(e) =>
                setForm({ ...form, duracionMinutos: e.target.value })
              }
              required
            />

            <div className="form-buttons">
              <button
                type="button"
                className="volver"
                onClick={() => navigate("/home")}
              >
                ⬅ Volver
              </button>
              <button type="submit">Generar código</button>
            </div>
          </form>
        ) : (
          <div className="codigo-generado">
            <h3>Código generado:</h3>
            <div className="codigo-box">{codigo}</div>
            <p>
              Expira en: <b>{formatHora(expiraEn)}</b>
            </p>
            <p>Tiempo restante: {segundosRestantes ?? 0}s</p>
            <p style={{ color: segundosRestantes === 0 ? "red" : "inherit" }}>
              {segundosRestantes === 0 && "Código expirado, redirigiendo..."}
            </p>

            <button
              className="volver"
              onClick={() => navigate("/home")}
              disabled={(segundosRestantes ?? 0) > 0}
            >
              Volver al inicio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CrearClase;

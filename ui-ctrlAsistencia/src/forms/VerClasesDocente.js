import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function VerClasesDocente() {
  const [clases, setClases] = useState([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState(null);
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Cargar clases del docente
  useEffect(() => {
    const fetchClases = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/clase/lista", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al cargar las clases");
        const data = await res.json();
        setClases(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchClases();
  }, [token]);

  // Obtener resumen de asistencia
  const verResumen = async (idClase) => {
    setLoading(true);
    setResumen(null);
    setClaseSeleccionada(idClase);
    try {
      const res = await fetch(
        `http://localhost:8080/api/asistencia/clase/${idClase}/resumen`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Error al obtener resumen de asistencia");
      const data = await res.json();
      setResumen(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar una clase
  const eliminarClase = async (idClase) => {
    const confirmar = window.confirm("¿Seguro que deseas eliminar esta clase?");
    if (!confirmar) return;

    try {
      setEliminando(true);
      const res = await fetch(`http://localhost:8080/api/clase/eliminar/${idClase}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al eliminar la clase");

      // Eliminar localmente del estado
      setClases((prev) => prev.filter((c) => c.idClase !== idClase));
      setClaseSeleccionada(null);
      setResumen(null);
      alert("Clase eliminada correctamente.");
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar la clase.");
    } finally {
      setEliminando(false);
    }
  };

  // Volver al listado
  const volverAClases = () => {
    setResumen(null);
    setClaseSeleccionada(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-800">Mis Clases</h2>
          <button
            onClick={() => navigate("/home")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            ← Volver
          </button>
        </div>

        {/* === LISTADO DE CLASES === */}
        {!claseSeleccionada ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {clases.length > 0 ? (
              clases.map((c) => (
                <div
                  key={c.idClase}
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{c.tema}</h3>
                  <p className="text-gray-700">
                    <span className="font-semibold">Asignatura:</span>{" "}
                    {c.curso?.asignatura?.nombre}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Sección:</span> {c.curso?.seccion}
                  </p>
                  <p className="text-gray-700 mb-3">
                    <span className="font-semibold">Fecha:</span> {c.fecha}
                  </p>

                  <div className="flex justify-between">
                    <button
                      onClick={() => verResumen(c.idClase)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Ver asistencia
                    </button>
                    <button
                      onClick={() => eliminarClase(c.idClase)}
                      disabled={eliminando}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      {eliminando ? "Eliminando..." : "Eliminar"}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No hay clases registradas.</p>
            )}
          </div>
        ) : (
          // === RESUMEN DE CLASE ===
          <div className="bg-white rounded-lg p-6 shadow-md">
            {loading ? (
              <p className="text-gray-600">Cargando resumen...</p>
            ) : resumen ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {resumen.asignatura} — {resumen.tema}
                  </h3>
                  <button
                    onClick={() => eliminarClase(claseSeleccionada)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm"
                  >
                    🗑 Eliminar clase
                  </button>
                </div>

                <p className="text-gray-700 mb-6">
                  <span className="font-semibold">Fecha:</span> {resumen.fecha} |{" "}
                  <span className="font-semibold">Sección:</span> {resumen.seccion}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Presentes */}
                  <div>
                    <h4 className="text-xl font-semibold text-green-600 mb-2">
                      🟢 Presentes ({resumen.presentes.length})
                    </h4>
                    {resumen.presentes.length > 0 ? (
                      <ul className="space-y-2">
                        {resumen.presentes.map((e) => (
                          <li
                            key={e.idEstudiante}
                            className="bg-green-50 border border-green-200 rounded-md p-2 text-gray-800"
                          >
                            <b>
                              {e.nombre} {e.apellido}
                            </b>{" "}
                            — {e.rut}
                            <span className="text-sm text-gray-500 ml-1">
                              ({new Date(e.fechaRegistro).toLocaleTimeString()})
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">Ningún estudiante presente.</p>
                    )}
                  </div>

                  {/* Ausentes */}
                  <div>
                    <h4 className="text-xl font-semibold text-red-600 mb-2">
                      🔴 Ausentes ({resumen.ausentes.length})
                    </h4>
                    {resumen.ausentes.length > 0 ? (
                      <ul className="space-y-2">
                        {resumen.ausentes.map((e) => (
                          <li
                            key={e.idEstudiante}
                            className="bg-red-50 border border-red-200 rounded-md p-2 text-gray-800"
                          >
                            <b>
                              {e.nombre} {e.apellido}
                            </b>{" "}
                            — {e.rut}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">Todos asistieron 👏</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={volverAClases}
                  className="mt-6 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
                >
                  ← Volver a clases
                </button>
              </>
            ) : (
              <p className="text-gray-600">No hay información disponible.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default VerClasesDocente;

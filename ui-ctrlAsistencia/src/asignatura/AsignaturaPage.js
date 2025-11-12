import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function AsignaturaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asignatura, setAsignatura] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return (window.location.href = "/login");

    fetch(`http://localhost:8080/api/asignatura/${id}/detalle`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar la asignatura");
        return res.json();
      })
      .then(setAsignatura)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p>Error: {error}</p>;
  if (!asignatura) return <p>Cargando información...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
        >
          ← Volver
        </button>

        {/* Grid principal: 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* === Tarjeta 1: General === */}
          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">General</h2>
            <div className="text-gray-700 space-y-2">
              <p>
                <span className="font-semibold">Nombre:</span>{" "}
                {asignatura.nombre}
              </p>
              <p>
                <span className="font-semibold">Código:</span>{" "}
                {asignatura.codigo}
              </p>
              <p>
                <span className="font-semibold">Créditos:</span>{" "}
                {asignatura.creditos}
              </p>
              <p>
                <span className="font-semibold">Departamento:</span>{" "}
                {asignatura.departamento?.nombre}
              </p>
            </div>
          </div>

          {/* === Tarjeta 2: Docentes === */}
          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Docentes</h2>
            {asignatura.docentes?.length > 0 ? (
              <ul className="space-y-2 text-gray-700">
                {asignatura.docentes.map((d) => (
                  <li key={d.idDocente} className="border-b pb-2 last:border-none">
                    <p className="font-medium">
                      {d.nombre} {d.apellido}
                    </p>
                    {d.correo && (
                      <p className="text-gray-600 text-sm">{d.correo}</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No hay docentes registrados.</p>
            )}
          </div>

          {/* === Tarjeta 3: Estudiantes === */}
          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Estudiantes</h2>
            {asignatura.estudiantes?.length > 0 ? (
              <ul className="space-y-2 text-gray-700">
                {asignatura.estudiantes.slice(0, 5).map((e) => (
                  <li key={e.idEstudiante} className="border-b pb-2 last:border-none">
                    <p className="font-medium">
                      {e.nombre} {e.apellido}
                    </p>
                    <p className="text-gray-600 text-sm">{e.rut}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No hay estudiantes registrados.</p>
            )}
            {asignatura.estudiantes?.length > 5 && (
              <p className="text-blue-500 text-sm mt-2">
                +{asignatura.estudiantes.length - 5} más
              </p>
            )}
          </div>

          {/* === Tarjeta 4: Clases === */}
          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Clases</h2>
            {asignatura.clases?.length > 0 ? (
              <ul className="space-y-2 text-gray-700">
                {asignatura.clases.slice(0, 4).map((c) => (
                  <li key={c.idClase} className="border-b pb-2 last:border-none">
                    <p className="font-medium">{c.tema}</p>
                    <p className="text-gray-600 text-sm">📅 {c.fecha}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No hay clases registradas.</p>
            )}
            {asignatura.clases?.length > 4 && (
              <p className="text-blue-500 text-sm mt-2">
                +{asignatura.clases.length - 4} más
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default AsignaturaPage;

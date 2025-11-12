import React, { useState } from "react";
import "./UserMenu.css";

function UserMenu({ rol, onLogout, onSelectSection }) {
  const [menuSeleccionado, setMenuSeleccionado] = useState(null);

  const handleVolver = () => setMenuSeleccionado(null);

  const opciones = {
    ADMINISTRATIVO: [
      { key: "asignaturas", label: "Asignaturas", crear: "/admin/asignaturas/crear" },
      { key: "docentes", label: "Docentes", crear: "/admin/docentes/crear" },
      { key: "estudiantes", label: "Estudiantes", crear: "/admin/estudiantes/crear" },
      { key: "cursos", label: "Cursos", crear: "/admin/cursos/crear" },
      { key: "matriculas", label: "Matrículas", crear: "/admin/matriculas/crear" },
    ],
    DOCENTE: [
      { key: "asignaturas", label: "Mis Asignaturas" },
      { key: "clases", label: "Clases", sub: [
          { label: "Ver clases", href: "/docente/clases/ver" },
          { label: "Crear clase", href: "/docente/clases/crear" },
        ],
      },
    ],
    ESTUDIANTE: [
      { key: "asignaturas", label: "Mis Asignaturas" },
      { key: "asistencia", label: "Registrar Asistencia", crear: "/estudiante/asistencia" }
    ]
  };

  const opcionSeleccionada = opciones[rol]?.find((o) => o.key === menuSeleccionado);

  return (
    <div className="user-menu-horizontal">
      {!menuSeleccionado ? (
        <ul className="menu-principal">
          {opciones[rol]?.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => {
                  setMenuSeleccionado(item.key);
                  onSelectSection(item.key);
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
          <li>
            <button className="logout-btn" onClick={onLogout}>
              Cerrar sesión
            </button>
          </li>
        </ul>
      ) : (
        <div className="submenu-horizontal">
          <button className="volver" onClick={handleVolver}>
            ⬅ Volver
          </button>
          <ul>
            {/* 🔹 Submenú DOCENTE */}
            {rol === "DOCENTE" && menuSeleccionado === "clases" && (
              <>
                <li><a href="/docente/clases/ver">Ver clases</a></li>
                <li><a href="/docente/clases/crear">Crear clase</a></li>
              </>
            )}

            {/* 🔹 Submenú ESTUDIANTE */}
            {rol === "ESTUDIANTE" && menuSeleccionado === "asistencia" && (
              <li><a href="/estudiante/asistencia">Registrar asistencia</a></li>
            )}

            {/* 🔹 Submenú ADMIN */}
            {rol === "ADMINISTRATIVO" &&
              opcionSeleccionada?.crear && (
                <>
                  <li><a href={opcionSeleccionada.crear}>Crear {menuSeleccionado}</a></li>
                  {["asignaturas", "docentes", "estudiantes", "cursos"].includes(menuSeleccionado) && (
                    <>
                      <li><a href={`/admin/${menuSeleccionado}/editar`}>Editar {menuSeleccionado}</a></li>
                      <li><a href={`/admin/${menuSeleccionado}/eliminar`}>Eliminar {menuSeleccionado}</a></li>
                    </>
                  )}
                  {menuSeleccionado === "matriculas" && (
                    <li><a href="/admin/matriculas/eliminar">Eliminar Matrícula</a></li>
                  )}
                </>
              )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UserMenu;

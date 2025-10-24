import React, { useState } from "react";
import "./UserMenu.css";

function UserMenu({ rol, onLogout }) {
  const [menuSeleccionado, setMenuSeleccionado] = useState(null);

  const handleVolver = () => setMenuSeleccionado(null);

  // Opciones dinámicas según rol
  const opciones = {
    ADMINISTRATIVO: ["asignaturas", "clases", "docentes", "estudiantes"],
    DOCENTE: ["asistencia"],
    ESTUDIANTE: ["asignaturas"]
  };

  return (
    <div className="user-menu">
      {!menuSeleccionado ? (
        <ul>
          {opciones[rol]?.map((item) => (
            <li key={item}>
              <button onClick={() => setMenuSeleccionado(item)}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            </li>
          ))}
          <hr />
          <li>
            <button className="logout-btn" onClick={onLogout}>
              Cerrar sesión
            </button>
          </li>
        </ul>
      ) : (
        <div className="submenu">
          <button className="volver" onClick={handleVolver}>
            ⬅ Volver
          </button>
          <h4 className="submenu-titulo">
            {menuSeleccionado === "clases"
              ? "CURSOS"
              : menuSeleccionado.toUpperCase()}
          </h4>
          <ul>
            <li>
              <a href={`/admin/${menuSeleccionado}/crear`}>
                {menuSeleccionado === "clases"
                  ? "Crear Curso"
                  : `Crear ${menuSeleccionado}`}
              </a>
            </li>
            {rol === "ADMINISTRATIVO" && (
              <>
                <li>
                  <a href={`/admin/${menuSeleccionado}/editar`}>
                    {menuSeleccionado === "clases"
                      ? "Editar Curso"
                      : `Editar ${menuSeleccionado}`}
                  </a>
                </li>
                <li>
                  <a href={`/admin/${menuSeleccionado}/eliminar`}>
                    {menuSeleccionado === "clases"
                      ? "Eliminar Curso"
                      : `Eliminar ${menuSeleccionado}`}
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UserMenu;

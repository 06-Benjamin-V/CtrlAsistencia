import React, { useState } from "react";
import "./AdminMenu.css";

function AdminMenu() {
  const [menuSeleccionado, setMenuSeleccionado] = useState(null);

  const handleVolver = () => setMenuSeleccionado(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/login";
  };

  return (
    <div className="admin-menu">
      <input type="checkbox" id="menu-toggle" className="hidden" />
      <label htmlFor="menu-toggle" className="hamburger">
        <div className="line1"></div>
        <div className="line2"></div>
        <div className="line3"></div>
      </label>

      <div className="menu">
        {!menuSeleccionado ? (
          <ul>
            <li>
              <button onClick={() => setMenuSeleccionado("asignaturas")}>Asignaturas</button>
            </li>
            <li>
              <button onClick={() => setMenuSeleccionado("clases")}>Clases</button>
            </li>
            <li>
              <button onClick={() => setMenuSeleccionado("docentes")}>Docentes</button>
            </li>
            <li>
              <button onClick={() => setMenuSeleccionado("estudiantes")}>Estudiantes</button>
            </li>
            <hr />
            <li>
              <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
            </li>
          </ul>
        ) : (

          <div>
            <button className="volver" onClick={handleVolver}>
              ⬅ Volver
            </button>
            <h4 className="submenu-titulo">
              {menuSeleccionado.toUpperCase()}
            </h4>
            <ul>
              {menuSeleccionado === "asignaturas" ? (
                <li>
                  <a href="/admin/asignaturas/crear">Crear Asignatura</a>
                </li>
              ) : (
                <>
                  <li>
                    <a href={`/admin/${menuSeleccionado}/crear`}>
                      Crear {menuSeleccionado}
                    </a>
                  </li>
                  <li>
                    <a href={`/admin/${menuSeleccionado}/editar`}>
                      Editar {menuSeleccionado}
                    </a>
                  </li>
                  <li>
                    <a href={`/admin/${menuSeleccionado}/eliminar`}>
                      Eliminar {menuSeleccionado}
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminMenu;

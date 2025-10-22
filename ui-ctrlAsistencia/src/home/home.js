import React, { useEffect, useState } from 'react';
import './home.css';

function Home() {
  const [usuario, setUsuario] = useState(null);
  const [menuSeleccionado, setMenuSeleccionado] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const EXPIRATION_TIME = 60 * 60 * 1000;
    const timer = setTimeout(() => {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }, EXPIRATION_TIME);

    fetch('http://localhost:8080/api/usuario/home', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener usuario');
        return res.json();
      })
      .then(data => setUsuario(data))
      .catch(() => {
        localStorage.removeItem('token');
        window.location.href = '/login';
      });

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleVolver = () => setMenuSeleccionado(null);

  if (!usuario) return <p>Cargando...</p>;

  return (
    <div className="home-container">
      {/* Sección izquierda */}
      <div className="home-left">
        <h1>Bienvenido, {usuario.nombreCompleto}</h1>
        <p>Rol: {usuario.rol}</p>
      </div>

      {/* Sección derecha: menú */}
      {usuario.rol === 'ADMINISTRATIVO' && (
        <div className="admin-menu-box">
          {!menuSeleccionado ? (
            <ul>
              <li><button onClick={() => setMenuSeleccionado('asignaturas')}>Asignaturas</button></li>
              <li><button onClick={() => setMenuSeleccionado('clases')}>Clases</button></li>
              <li><button onClick={() => setMenuSeleccionado('docentes')}>Docentes</button></li>
              <li><button onClick={() => setMenuSeleccionado('estudiantes')}>Estudiantes</button></li>
              <hr />
              <li><button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button></li>
            </ul>
          ) : (
            <div className="submenu">
              <button className="volver" onClick={handleVolver}>⬅ Volver</button>
              <h4 className="submenu-titulo">{menuSeleccionado.toUpperCase()}</h4>
              <ul>
                {menuSeleccionado === 'asignaturas' ? (
                  <li><a href="/admin/asignaturas/crear">Crear Asignatura</a></li>
                ) : (
                  <>
                    <li><a href={`/admin/${menuSeleccionado}/crear`}>Crear {menuSeleccionado}</a></li>
                    <li><a href={`/admin/${menuSeleccionado}/editar`}>Editar {menuSeleccionado}</a></li>
                    <li><a href={`/admin/${menuSeleccionado}/eliminar`}>Eliminar {menuSeleccionado}</a></li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;

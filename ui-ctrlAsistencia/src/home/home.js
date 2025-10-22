import React, { useEffect, useState } from 'react';
import AdminMenu from '../components/AdminMenu';

function Home() {
  const [usuario, setUsuario] = useState(null);

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
//----------------------------------------------------------
    // Obtener info del usuario
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

  if (!usuario) return <p>Cargando...</p>;

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Bienvenido, {usuario.nombreCompleto}</h1>
      <p>Rol: {usuario.rol}</p>

      {/* Solo aparece si el rol es ADMINISTRATIVO */}
      {usuario.rol === 'ADMINISTRATIVO' && <AdminMenu />}

      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
}

export default Home;

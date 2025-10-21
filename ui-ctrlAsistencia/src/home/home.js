import React, { useEffect } from 'react';

function Home() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const EXPIRATION_TIME = 5000;

    setTimeout(() => {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }, EXPIRATION_TIME);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>¡Hola Mundo! 🌍</h1>
      <p>Has iniciado sesión correctamente.</p>
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
}

export default Home;

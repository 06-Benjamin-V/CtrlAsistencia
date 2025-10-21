import React, { useState } from 'react';
import './login.css';
import fondo from '../assets/images/ufro.png';
import bandurria from '../assets/images/bandurriaFun.svg';

function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const loginData = { correo, contrasenia };
      console.log('Intento de inicio de sesión:', loginData);

      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      const text = await response.text();

      if (!response.ok) {
        throw new Error(`Error en el login: ${response.status} - ${text}`);
      }

      const data = JSON.parse(text);
      console.log('Login exitoso:', data);

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('rol', data.rol);
        localStorage.setItem('nombre', data.nombreCompleto);
      }

      alert(`¡Bienvenido ${data.nombreCompleto}!`);
      window.location.href = '/home';

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  return (
    <div className="login-container">
      <div
        className="login-container-bg"
        style={{ backgroundImage: `url(${fondo})` }}
      ></div>

      <div className="login-box">
        <img src={bandurria} alt="Bandurria" className="bandurria-icon" />
        <h2>Iniciar Sesión</h2>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="********"
              value={contrasenia}
              onChange={(e) => setContrasenia(e.target.value)}
              required
            />
          </div>

          <div className="button flex items-center justify-center">
            <button
              type="submit"
              className="relative flex items-center px-6 py-3 overflow-hidden font-medium transition-all bg-indigo-500 rounded-md group"
            >
              <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-indigo-700 rounded group-hover:-mr-4 group-hover:-mt-4">
                <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white" />
              </span>
              <span className="absolute bottom-0 rotate-180 left-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-indigo-700 rounded group-hover:-ml-4 group-hover:-mb-4">
                <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white" />
              </span>
              <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full bg-indigo-600 rounded-md group-hover:translate-x-0" />
              <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white">
                Iniciar Sesión
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

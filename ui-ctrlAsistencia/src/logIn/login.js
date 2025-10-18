import React, { useState } from 'react';
import './login.css';
import fondo from '../assets/images/ufro.png';
import bandurria from '../assets/images/bandurriaFun.svg';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Intento de inicio de sesión:', { email, password });
  };

  return (
    <div className="login-container">
      <div className="login-container-bg" style={{ backgroundImage: `url(${fondo})` }}></div>
      <div className="login-box">
        <img src={bandurria} alt="Bandurria" className="bandurria-icon" />
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
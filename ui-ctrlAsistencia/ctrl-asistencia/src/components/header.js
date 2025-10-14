import React from 'react';
import './header.css';

const Header = () => {
  return (
    <header className="header">
      <h1>Ctrl Asistencia</h1>
      <nav>
        <ul className="nav-links">
          <li><a href="/">Inicio</a></li>
          <li><a href="/login">Login</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
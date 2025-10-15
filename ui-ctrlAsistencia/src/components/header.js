import React from 'react';
import './header.css';
import logo from '../assets/images/logoUfroVertical.svg';

function Header() {
  return (
    <header className="header">
      <img src={logo} alt="Logo" className="header-logo" />
      <h1 className="header-title">Control de Asistencia</h1>
    </header>
  );
}

export default Header;

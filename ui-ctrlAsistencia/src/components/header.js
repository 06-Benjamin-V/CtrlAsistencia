import React from 'react';
import './header.css';
import logo from '../assets/images/logoUfroHorizontal.svg';
import UserMenu from './UserMenu';

function Header({ usuario, onLogout, onSelectSection }) {
  const handleLogoClick = () => {
    window.location.href = '/home';
  };

  return (
    <header className="header">
      <div className="header-left" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <img src={logo} alt="Logo" className="header-logo" />
        <h1 className="header-title"></h1>
      </div>
      
      {usuario && (
        <div className="header-menu">
          <UserMenu
            rol={usuario.rol}
            onLogout={onLogout}
            onSelectSection={onSelectSection}
          />
        </div>
      )}
    </header>
  );
}

export default Header;

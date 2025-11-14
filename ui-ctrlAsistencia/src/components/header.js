import './header.css';
import logo from '../assets/images/logoUfroHorizontal.svg';

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
    </header>
  );
}

export default Header;

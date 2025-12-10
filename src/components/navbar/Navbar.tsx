import './navbar.css';
import { navbarLinks } from './navbarLinks';
import logoSF from '../../assets/images/logoSF.png'

function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar__logo">
        <img src={logoSF} alt="Habitta logo" className="navbar__logo-img" />
      </div>

      {/* Navigation Links */}
      <div className="navbar__links">
        {navbarLinks.map((link) => (
          <a key={link.label} href={link.href} className="navbar__link">
            <span className="navbar__link-text">{link.label}</span>
          </a>
        ))}
      </div>

      {/* Publish and User Icons */}
      <div className="navbar__actions">
        <button className="navbar__publish-btn">
          <span>+ Publicar</span>
        </button>
        <button className="navbar__user-btn">
          <span>👤</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

import "./navbar.css";
import logoSF from "../../assets/images/logoSF.png";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__inner">
        {/* Logo */}
        <div className="navbar__logo">
          <img src={logoSF} alt="Habitta logo" className="navbar__logo-img" />
        </div>
        {/* Navigation Links */}
        <nav className="navbar__links">
          <ul>
            <li>
              <Link to="/" className="navbar__link">Inicio</Link>
            </li>
            <li>
              <Link to="/properties" className="navbar__link">Propiedades</Link>
            </li>
            <li>
              <Link to="/favorites" className="navbar__link">Favoritos</Link>
            </li>
            <li>
              <Link to="/tools" className="navbar__link">Herramientas</Link>
            </li>
            <li>
              <Link to="/promotion" className="navbar__link">Promociones</Link>
            </li>
          </ul>
        </nav>

        {/* Publish and User Icons */}
        <div className="navbar__actions">
          <Link to="/registerpropeties" className="navbar__publish-btn">
            +Publicar
          </Link>
          <button className="navbar__user-btn">
            <span>👤</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

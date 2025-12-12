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
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/properties">Propiedades</Link>
            </li>
            <li>
              <Link to="/favorites">Favoritos</Link>
            </li>
            <li>
              <Link to="/tools">Herramientas</Link>
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

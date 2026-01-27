import "./navbar.css";
import logoSF from "../../assets/images/logoSF.png";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        {/* Logo */}
        <div className="navbar__logo">
          <Link to="/">
            <img src={logoSF} alt="Habitta logo" className="navbar__logo-img" />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="navbar__links">
          <ul>
            <li>
              <Link
                className={`navbar_link ${location.pathname === "/" ? "active" : ""}`}
                to="/"
              >
                <img
                  className="navbar_icon"
                  src="/src/assets/icons/house-01-svgrepo-com.svg"
                  alt=""
                />
                Inicio
              </Link>
            </li>
            <li>
              <Link
                className={`navbar_link ${location.pathname === "/properties" ? "active" : ""}`}
                to="/properties"
              >
                <img
                  className="navbar_icon"
                  src="/src/assets/icons/glass-magnifier-search-zoom-alert-notification-svgrepo-com.svg"
                  alt=""
                />
                Propiedades
              </Link>
            </li>
            <li>
              <Link
                className={`navbar_link ${location.pathname === "/favorites" ? "active" : ""}`}
                to="/favorites"
              >
                <img
                  className="navbar_icon"
                  src="/src/assets/icons/hearth-svgrepo-com.svg"
                  alt=""
                />
                Favoritos
              </Link>
            </li>
            <li>
              <Link
                className={`navbar_link ${location.pathname === "/tools" ? "active" : ""}`}
                to="/tools"
              >
                <img
                  className="navbar_icon"
                  src="/src/assets/icons/calculator-svgrepo-com.svg"
                  alt=""
                />
                Herramientas
              </Link>
            </li>
            <li>
              <Link
                className={`navbar_link ${location.pathname === "/promotion" ? "active" : ""}`}
                to="/promotion"
              >
                <img
                  className="navbar_icon"
                  src="/src/assets/icons/star-alt-4-svgrepo-com.svg"
                  alt=""
                />
                Promociones
              </Link>
            </li>
          </ul>
        </nav>

        {/* Notification Icon */}
        <div id="notificationButton">
          <img
            id="notificationIcon"
            src="/src/assets/icons/notification-9-svgrepo-com.svg"
            alt="Notificaciones"
          />
        </div>

        {/* Publish and User Icons */}
        <div className="navbar__actions">
          <Link to="/registerpropeties" className="navbar__publish-btn">
            + Publicar
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

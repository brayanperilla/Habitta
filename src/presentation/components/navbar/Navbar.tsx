import "./navbar.css";
import { useState } from "react";
// import logoSF from "../../assets/images/logoSF.png";
const logoSF = "/images/logoSF.png";
import { Link, useLocation } from "react-router-dom";
// import notificationIcon from "/public/notification-9-svgrepo-com.svg";
const notificationIcon = "/notification-9-svgrepo-com.svg";
import UserModal from "../userModal/UserModal";

// Navbar Component
function Navbar({ onToggleNotifications }: { onToggleNotifications?: () => void }) {
  const location = useLocation();

  // Estado para controlar la visibilidad del modal de usuario
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  /**
   * Alterna la visibilidad del modal de usuario
   */
  const toggleUserModal = () => {
    setIsUserModalOpen(!isUserModalOpen);
  };

  /**
   * Cierra el modal de usuario
   */
  const closeUserModal = () => {
    setIsUserModalOpen(false);
  };

  // Renderizamos la estructura visual de la barra de navegación.
  return (
    <nav className="navbar">
      <div className="navbar__inner">
        {/* Logo Section */}
        <div className="navbar__logo">
          <Link to="/">
            <img
              src={logoSF}
              alt="Logo de Habitta"
              className="navbar__logo-img"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="navbar__links">
          <ul>
            {/* Home */}
            <li>
              <Link
                className={`navbar_link ${location.pathname === "/" ? "active" : ""}`}
                to="/"
              >
                <img
                  className="navbar_icon"
                  src="/icons/UI/navbaricons/house-01-svgrepo-com.svg"
                  alt="Icono de inicio"
                />
                Inicio
              </Link>
            </li>

            {/* Properties */}
            <li>
              <Link
                className={`navbar_link ${location.pathname === "/properties" ? "active" : ""}`}
                to="/properties"
              >
                <img
                  className="navbar_icon"
                  src="/icons/UI/navbaricons/glass-magnifier-search-zoom-alert-notification-svgrepo-com.svg"
                  alt="Icono de buscar propiedades"
                />
                Propiedades
              </Link>
            </li>

            {/* Favorites */}
            <li>
              <Link
                className={`navbar_link ${location.pathname === "/favorites" ? "active" : ""}`}
                to="/favorites"
              >
                <img
                  className="navbar_icon"
                  src="/icons/UI/navbaricons/hearth-svgrepo-com.svg"
                  alt="Icono de favoritos"
                />
                Favoritos
              </Link>
            </li>

            {/* Tools */}
            <li>
              <Link
                className={`navbar_link ${location.pathname === "/tools" ? "active" : ""}`}
                to="/tools"
              >
                <img
                  className="navbar_icon"
                  src="/icons/UI/navbaricons/calculator-svgrepo-com.svg"
                  alt="Icono de herramientas"
                />
                Herramientas
              </Link>
            </li>
          </ul>
        </nav>

        {/* Notifications */}

        <Link to="/ModalN">
          <div id="notificationButton">
            <img
              id="notificationIcon"
              src={notificationIcon}
              alt="Notificaciones"
            />
          </div>
        </Link>

        {/* Actions */}
        <div className="navbar__actions">
          <Link to="/registerpropeties" className="navbar__publish-btn">
            + Publicar
          </Link>
          {/* User Profile */}
          <div style={{ position: "relative" }}>
            <button className="navbar__user-btn" onClick={toggleUserModal}>
              <img className="navbar_user-icon" src="/icons/UI/navbaricons/user-alt-1-svgrepo-com.svg" alt="Icono de usuario" />
            </button>
            {/* Modal de usuario */}
            <UserModal isOpen={isUserModalOpen} onClose={closeUserModal} />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

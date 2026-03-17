import "./navbar.css";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@application/context/AuthContext";
import UserModal from "../userModal/UserModal";
import ModalN from "../../pages/notification/Modal/ModalN";

const logoSF = "/images/logoSF.png";
const notificationIcon = "/notification-9-svgrepo-com.svg";

// Componente de Barra de Navegación
function Navbar() {
  const location = useLocation();
  const { usuario } = useAuth();

  // Estado para controlar la visibilidad del modal de usuario
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // Estado para controlar la visibilidad del modal de notificaciones
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

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

  /**
   * Alterna la visibilidad del modal de notificaciones
   */
  const toggleNotificationModal = () => {
    setIsNotificationModalOpen(!isNotificationModalOpen);
  };

  /**
   * Cierra el modal de notificaciones
   */
  const closeNotificationModal = () => {
    setIsNotificationModalOpen(false);
  };

  // Renderizamos la estructura visual de la barra de navegación.
  return (
    <nav className="navbar">
      <div className="navbar__inner">
        {/* Logo Section */}
        <div className="navbar__logo">
          <Link to={usuario?.rol === "admin" ? "/admin" : "/"}>
            <img
              src={logoSF}
              alt="Logo de Habitta"
              className="navbar__logo-img"
            />
          </Link>
        </div>

        {/* Navigation Links - Ocultar para admin */}
        {usuario?.rol !== "admin" && (
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
                  to={usuario ? "/favorites" : "/auth"}
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
                  to={usuario ? "/tools" : "/auth"}
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
        )}

        {/* Notifications - Ocultar para admin */}
        {usuario?.rol !== "admin" && (
          <div style={{ position: "relative" }}>
            <div
              id="notificationButton"
              onClick={toggleNotificationModal}
              style={{ cursor: "pointer" }}
            >
              <img
                id="notificationIcon"
                src={notificationIcon}
                alt="Notificaciones"
              />
            </div>
            {/* Modal de Notificaciones */}
            <ModalN
              isOpen={isNotificationModalOpen}
              onClose={closeNotificationModal}
            />
          </div>
        )}

        {/* Actions */}
        <div className="navbar__actions">
          {usuario ? (
            <>
              {/* Usuario autenticado */}
              {usuario?.rol !== "admin" && (
                <Link to="/registerpropeties" className="navbar__publish-btn">
                  + Publicar
                </Link>
              )}
              <div style={{ position: "relative" }}>
                <button className="navbar__user-btn" onClick={toggleUserModal}>
                  <span className="navbar__user-avatar" style={{ padding: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {usuario.fotoperfil ? (
                      <img
                        src={usuario.fotoperfil}
                        alt="Avatar"
                        style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                      />
                    ) : (
                      usuario.nombre
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    )}
                  </span>
                  <span className="navbar__user-name">{usuario.nombre}</span>
                </button>
                {/* Modal de usuario */}
                <UserModal isOpen={isUserModalOpen} onClose={closeUserModal} />
              </div>
            </>
          ) : (
            <>
              {/* Usuario NO autenticado */}
              <Link to="/auth" className="navbar__login-btn">
                Iniciar Sesión
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

import "./navbar.css";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@application/context/AuthContext";
import { useNotificaciones } from "@application/hooks/useNotificaciones";
import UserModal from "../userModal/UserModal";
import ModalN from "../../pages/notification/Modal/ModalN";

const notificationIcon = "/notification-9-svgrepo-com.svg";

function Navbar() {
  const location = useLocation();
  const { usuario } = useAuth();

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Única instancia del hook — se comparte con ModalN via props
  const { notificaciones, noLeidasCount, marcarTodasLeidas } =
    useNotificaciones(usuario?.idusuario);

  // Toggle correcto: si estaba abierto, cerrarlo; si cerrado, abrirlo
  const handleUserBtnClick = () => {
    setIsUserModalOpen((prev) => !prev);
  };

  const closeUserModal = () => {
    setIsUserModalOpen(false);
  };

  const toggleNotificationModal = () => {
    setIsNotificationModalOpen((prev) => !prev);
  };

  const closeNotificationModal = () => {
    setIsNotificationModalOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        {/* Contenedor Izquierdo: Logo + Hamburguesa */}
        <div className="navbar__left">
          <div className="navbar__logo">
            <Link to={usuario?.rol === "admin" ? "/admin" : "/"}>
              <div className="navbar__logo-container">
                <img
                  src="/images/logo_mobile.png"
                  alt="Logo Habitta"
                  className="navbar__logo-img"
                />
              </div>
            </Link>
          </div>

          {usuario?.rol !== "admin" && (
            <button
              className="navbar__hamburger"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Menú"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a202c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
            </button>
          )}
        </div>

        {/* Navegación y Botón Central de Publicar */}
        <div className="navbar__center">
          {usuario?.rol !== "admin" && (
            <nav className="navbar__links">
              <ul>
                <li>
                  <Link className={`navbar_link ${location.pathname === "/" ? "active" : ""}`} to="/">
                    <img className="navbar_icon" src="/icons/UI/navbaricons/house-01-svgrepo-com.svg" alt="Inicio" />
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link className={`navbar_link ${location.pathname === "/properties" ? "active" : ""}`} to="/properties">
                    <img className="navbar_icon" src="/icons/UI/navbaricons/glass-magnifier-search-zoom-alert-notification-svgrepo-com.svg" alt="Propiedades" />
                    Propiedades
                  </Link>
                </li>
                <li>
                  <Link className={`navbar_link ${location.pathname === "/favorites" ? "active" : ""}`} to={usuario ? "/favorites" : "/auth"}>
                    <img className="navbar_icon" src="/icons/UI/navbaricons/hearth-svgrepo-com.svg" alt="Favoritos" />
                    Favoritos
                  </Link>
                </li>
                <li>
                  <Link className={`navbar_link ${location.pathname === "/tools" ? "active" : ""}`} to={usuario ? "/tools" : "/auth"}>
                    <img className="navbar_icon" src="/icons/UI/navbaricons/calculator-svgrepo-com.svg" alt="Herramientas" />
                    Herramientas
                  </Link>
                </li>
              </ul>
            </nav>
          )}

        </div>

        {/* User Actions & Notifications */}
        <div className="navbar__actions">
          {usuario && usuario.rol !== "admin" && (
             <Link to="/registerpropeties" className="navbar__publish-btn">
                Publicar
             </Link>
          )}
          {/* Notifications */}
          {usuario?.rol !== "admin" && (
            <div style={{ position: "relative" }}>
              <div
                id="notificationButton"
                onClick={toggleNotificationModal}
                style={{ cursor: "pointer", position: "relative", display: "inline-flex" }}
              >
                <img id="notificationIcon" src={notificationIcon} alt="Notificaciones" />
                {noLeidasCount > 0 && (
                  <span style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-6px",
                    background: "#e74c3c",
                    color: "#fff",
                    borderRadius: "50%",
                    width: "18px",
                    height: "18px",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1,
                    pointerEvents: "none",
                    border: "2px solid #fff",
                  }}>
                    {noLeidasCount > 9 ? "9+" : noLeidasCount}
                  </span>
                )}
              </div>
              <ModalN
                isOpen={isNotificationModalOpen}
                onClose={closeNotificationModal}
                notificaciones={notificaciones}
                noLeidasCount={noLeidasCount}
                onMarcarTodasLeidas={marcarTodasLeidas}
              />
            </div>
          )}

          {usuario ? (
            <div className="navbar__user-actions-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ position: 'relative' }}>
                {/* id="userModalTrigger" allows UserModal to ignore clicks on this button */}
                <button
                  id="userModalTrigger"
                  className="navbar__user-btn"
                  onClick={handleUserBtnClick}
                >
                  <span className="navbar__user-avatar" style={{ padding: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {usuario.fotoperfil ? (
                      <img
                        src={usuario.fotoperfil}
                        alt="Avatar"
                        style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                      />
                    ) : (
                      usuario.nombre.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
                    )}
                  </span>
                  <span className="navbar__user-name">{usuario.nombre}</span>
                </button>
                <UserModal isOpen={isUserModalOpen} onClose={closeUserModal} />
              </div>
            </div>
            <Link to="/auth" className="navbar__login-btn" style={{ whiteSpace: "nowrap" }}>
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {usuario?.rol !== "admin" && (
        <div className={`navbar__mobile-menu ${mobileMenuOpen ? 'navbar__mobile-menu--open' : ''}`}>
          <Link
            className={`navbar_link ${location.pathname === "/" ? "active" : ""}`}
            to="/"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img className="navbar_icon" src="/icons/UI/navbaricons/house-01-svgrepo-com.svg" alt="Inicio" />
            Inicio
          </Link>
          <Link
            className={`navbar_link ${location.pathname === "/properties" ? "active" : ""}`}
            to="/properties"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img className="navbar_icon" src="/icons/UI/navbaricons/glass-magnifier-search-zoom-alert-notification-svgrepo-com.svg" alt="Propiedades" />
            Propiedades
          </Link>
          <Link
            className={`navbar_link ${location.pathname === "/favorites" ? "active" : ""}`}
            to={usuario ? "/favorites" : "/auth"}
            onClick={() => setMobileMenuOpen(false)}
          >
            <img className="navbar_icon" src="/icons/UI/navbaricons/hearth-svgrepo-com.svg" alt="Favoritos" />
            Favoritos
          </Link>
          <Link
            className={`navbar_link ${location.pathname === "/tools" ? "active" : ""}`}
            to={usuario ? "/tools" : "/auth"}
            onClick={() => setMobileMenuOpen(false)}
          >
            <img className="navbar_icon" src="/icons/UI/navbaricons/calculator-svgrepo-com.svg" alt="Herramientas" />
            Herramientas
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

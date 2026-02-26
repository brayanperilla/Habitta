import React, { useState, useEffect } from "react";
import "./sections.css";
import { useAuth } from "@application/context/AuthContext";
import ChangePasswordModal from "./ChangePasswordModal";

/**
 * Componente que muestra el perfil del usuario y opciones de configuración
 */
const PerfilSection: React.FC = () => {
  const { usuario, updatePerfil } = useAuth();

  // Estados para edición de perfil (RF09)
  const [isEditing, setIsEditing] = useState(false);
  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [biografia, setBiografia] = useState(usuario?.descripcion || "");
  const [telefono, setTelefono] = useState(usuario?.telefono || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado para modal de cambio de contraseña (RF08)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Escuchar evento para abrir el modal
  useEffect(() => {
    const handleOpenModal = () => setIsPasswordModalOpen(true);
    window.addEventListener("open-password-modal", handleOpenModal);
    return () =>
      window.removeEventListener("open-password-modal", handleOpenModal);
  }, []);

  // RF09 - Guardar cambios de perfil
  const handleSaveProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      await updatePerfil({
        nombre,
        descripcion: biografia,
        telefono,
      });
      setIsEditing(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar perfil",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) {
    return (
      <div className="section-content">
        <p>Inicia sesión para ver tu perfil.</p>
      </div>
    );
  }

  return (
    <div className="section-content">
      <div className="section-header-row">
        <h2 className="section-title">Mi Perfil</h2>
        {!isEditing ? (
          <button className="btn-secondary" onClick={() => setIsEditing(true)}>
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
              <path d="M12.146.854a.5.5 0 0 1 .708 0l2.292 2.292a.5.5 0 0 1 0 .708l-9 9a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l9-9z" />
            </svg>
            Editar Perfil
          </button>
        ) : (
          <div className="edit-actions">
            <button
              className="btn-primary"
              onClick={handleSaveProfile}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
            <button
              className="btn-text"
              onClick={() => setIsEditing(false)}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {error && <div className="auth-error-inline">{error}</div>}

      <div className="perfil-container">
        {/* Información del usuario */}
        <div className="perfil-info-card">
          <div className="perfil-avatar">
            {usuario.fotoperfil ? (
              <img src={usuario.fotoperfil} alt={usuario.nombre} />
            ) : (
              <svg
                width="60"
                height="60"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>
            )}
          </div>

          <div className="perfil-datos">
            {isEditing ? (
              <input
                className="edit-input-nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre completo"
              />
            ) : (
              <h3 className="perfil-nombre">{usuario.nombre}</h3>
            )}

            <div className="perfil-detalle">
              <svg
                className="icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <span>{usuario.correo}</span>
            </div>

            <div className="perfil-detalle">
              <svg
                className="icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              {isEditing ? (
                <input
                  className="edit-input-tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Tu teléfono"
                />
              ) : (
                <span>{usuario.telefono || "Sin teléfono"}</span>
              )}
            </div>

            <div className="perfil-detalle">
              <svg
                className="icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
              <span>
                Miembro desde{" "}
                {usuario.fecharegistro
                  ? new Date(usuario.fecharegistro).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>

          <div className="perfil-biografia">
            <h4>Biografía</h4>
            {isEditing ? (
              <textarea
                className="edit-textarea-bio"
                value={biografia}
                onChange={(e) => setBiografia(e.target.value)}
                placeholder="Cuéntanos un poco sobre ti..."
              />
            ) : (
              <p>{usuario.descripcion || "Sin descripción"}</p>
            )}
          </div>
        </div>

        {/* Opciones de configuración */}
        <div className="configuracion-grid">
          {/* RF08 - Solo implementamos el botón funcional para contraseña aquí */}
          <div
            className="configuracion-card clickable"
            onClick={() => setIsPasswordModalOpen(true)}
          >
            <div className="configuracion-card__icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div className="configuracion-card__content">
              <h4 className="configuracion-card__title">Cambiar Contraseña</h4>
              <p className="configuracion-card__description">
                Actualiza tu contraseña de acceso
              </p>
            </div>
            <svg
              className="configuracion-card__arrow"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>

          {/* Resto de opciones estáticas por ahora */}
          <div className="configuracion-card">
            <div className="configuracion-card__icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <div className="configuracion-card__content">
              <h4 className="configuracion-card__title">
                Configurar Notificaciones
              </h4>
              <p className="configuracion-card__description">
                Gestiona cómo recibes las notificaciones
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de cambio de contraseña */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};

export default PerfilSection;

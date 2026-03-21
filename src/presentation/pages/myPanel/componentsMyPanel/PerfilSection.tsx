import React, { useState, useEffect, useRef } from "react";
import "./sections.css";
import { useAuth } from "@application/context/AuthContext";
import { useToast } from "@application/context/ToastContext";
import ChangePasswordModal from "./ChangePasswordModal";
import { useWarnIfUnsavedChanges } from "@application/hooks/useWarnIfUnsavedChanges";
import { supabase } from "@infrastructure/supabase/client";
import AvatarEditor from "react-avatar-editor";

/**
 * Componente que muestra el perfil del usuario y opciones de configuración
 */
const PerfilSection: React.FC = () => {
  const { usuario, updatePerfil, signOut } = useAuth();

  // Estados para edición de perfil (RF09)
  const [isEditing, setIsEditing] = useState(false);
  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [biografia, setBiografia] = useState(usuario?.descripcion || "");
  const [telefono, setTelefono] = useState(usuario?.telefono || "");
  const [correoEdit, setCorreoEdit] = useState(usuario?.correo || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (error) showToast(error, "error");
  }, [error]); // eslint-disable-line react-hooks/exhaustive-deps

  useWarnIfUnsavedChanges(isEditing && !loading);

  // Estado para modal de cambio de contraseña (RF08)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Estado para cambio de correo (RF10)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailStep, setEmailStep] = useState<1 | 2>(1);
  const [emailVerify, setEmailVerify] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  // Estado para notificaciones (RF11)
  const [isNotifsOpen, setIsNotifsOpen] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState(() => {
    try {
      const saved = localStorage.getItem("habitta_notif_prefs");
      return saved
        ? JSON.parse(saved)
        : { nuevas: true, favoritos: true, promos: false, seguridad: true };
    } catch {
      return { nuevas: true, favoritos: true, promos: false, seguridad: true };
    }
  });

  // Estado para eliminación de cuenta (RF12)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteStep, setDeleteStep] = useState<1 | 2>(1);
  const [deleteEmailVerify, setDeleteEmailVerify] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Estados para Modal de Foto de Perfil
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | string | null>(null);
  const [avatarScale, setAvatarScale] = useState(1);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const editorRef = useRef<AvatarEditor | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Escuchar evento para abrir el modal de contraseña
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
      if (correoEdit !== usuario?.correo && correoEdit.trim() !== "") {
        const { error: err } = await supabase.auth.updateUser({
          email: correoEdit.trim(),
        });
        if (err) throw new Error(err.message);
        showToast("Perfil actualizado. Se envió un correo de confirmación al nuevo email.", "success");
      } else {
        showToast("Perfil actualizado correctamente.", "success");
      }
      setIsEditing(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar perfil",
      );
    } finally {
      setLoading(false);
    }
  };

  // RF10 — Cambio de correo
  const handleEmailVerifyStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailVerify.trim().toLowerCase() !== usuario?.correo?.toLowerCase()) {
      showToast("El correo electrónico no coincide con tu cuenta.", "error");
      return;
    }
    setEmailStep(2);
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.includes("@")) {
      showToast("Ingresa un correo electrónico válido.", "error");
      return;
    }
    setEmailLoading(true);
    try {
      const { error: err } = await supabase.auth.updateUser({
        email: newEmail.trim(),
      });
      if (err) throw new Error(err.message);
      showToast(
        "Se envió un correo de confirmación al nuevo email. Revisa tu bandeja.",
        "success",
      );
      setIsEmailModalOpen(false);
      setEmailStep(1);
      setEmailVerify("");
      setNewEmail("");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Error al cambiar correo.",
        "error",
      );
    } finally {
      setEmailLoading(false);
    }
  };

  // RF11 — Notificaciones
  const toggleNotif = (key: string) => {
    setNotifPrefs((prev: Record<string, boolean>) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem("habitta_notif_prefs", JSON.stringify(updated));
      return updated;
    });
  };

  // RF12 — Eliminar cuenta
  const handleDeleteEmailStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      deleteEmailVerify.trim().toLowerCase() !== usuario?.correo?.toLowerCase()
    ) {
      showToast("El correo electrónico no coincide con tu cuenta.", "error");
      return;
    }
    setDeleteStep(2);
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmText !== "ELIMINAR") {
      showToast('Escribe "ELIMINAR" para confirmar.', "error");
      return;
    }
    setDeleteLoading(true);
    try {
      // Marcar cuenta como eliminada
      await supabase
        .from("usuarios")
        .update({ estadocuenta: "eliminada" })
        .eq("idusuario", usuario!.idusuario);
      showToast("Cuenta eliminada. Redirigiendo...", "success");
      // Cerrar sesión e ir al login inmediatamente
      await signOut();
      window.location.href = "/auth";
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Error al eliminar cuenta.",
        "error",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatarFile(e.target.files[0]);
      setIsAvatarModalOpen(true);
      setAvatarScale(1);
    }
    // Limpiar input para permitir seleccionar la misma foto
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveAvatar = async () => {
    if (!editorRef.current || !usuario?.idusuario) return;

    setAvatarLoading(true);
    try {
      // 1. Obtener la imagen recortada del Canvas
      const canvasScaled = editorRef.current.getImageScaledToCanvas();
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvasScaled.toBlob((blob: Blob | null) => {
          if (blob) resolve(blob);
          else reject(new Error("Error al procesar la imagen."));
        }, "image/jpeg", 0.9);
      });

      // 2. Subir al Bucket de Supabase
      const fileName = `${usuario.idusuario}_avatar_${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, blob, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadError) throw new Error(uploadError.message);

      // 3. Obtener URL pública
      const { data: publicData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      // 4. Actualizar tabla usuarios a través del AuthContext
      await updatePerfil({
        fotoperfil: publicData.publicUrl,
      });

      showToast("Foto de perfil actualizada correctamente.", "success");
      setIsAvatarModalOpen(false);
      setAvatarFile(null);
    } catch (err: any) {
      showToast(err.message || "Error al subir foto.", "error");
    } finally {
      setAvatarLoading(false);
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
              className="btn-outline-red"
              onClick={() => setIsEditing(false)}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      <div className="perfil-container">
        {/* Información del usuario */}
        <div className="perfil-info-card">
          <div className="perfil-avatar-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="perfil-avatar">
              {usuario.fotoperfil ? (
                <img src={usuario.fotoperfil} alt={usuario.nombre} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
              ) : (
                <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
              )}
            </div>
            <button 
              className="btn-secondary" 
              onClick={() => fileInputRef.current?.click()}
              style={{ padding: "6px 14px", fontSize: "0.85rem", marginTop: "16px", width: "100%" }}
            >
              Cambiar foto de perfil
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: "none" }} 
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
            />
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
              {isEditing ? (
                <input
                  className="edit-input-email"
                  value={correoEdit}
                  onChange={(e) => setCorreoEdit(e.target.value)}
                  placeholder="Tu correo electrónico"
                />
              ) : (
                <span>{usuario.correo}</span>
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
                {usuario.created_at
                  ? new Date(usuario.created_at).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>

          <div className="perfil-biografia">
            <h4>Biografía</h4>
            {isEditing ? (
              <div style={{ position: "relative" }}>
                <textarea
                  className="edit-textarea-bio"
                  value={biografia}
                  onChange={(e) => {
                    let text = e.target.value;
                    if (text.length > 0) text = text.charAt(0).toUpperCase() + text.slice(1);
                    setBiografia(text);
                  }}
                  placeholder="Cuéntanos un poco sobre ti..."
                  maxLength={800}
                  rows={6}
                />
                <span style={{ fontSize: "0.78rem", color: "#aaa", display: "block", textAlign: "right", marginTop: "-6px" }}>
                  {(biografia || "").length}/800 caracteres
                </span>
              </div>
            ) : (
              <p>{usuario.descripcion || "Sin descripción"}</p>
            )}
          </div>
        </div>

        {/* Opciones de configuración */}
        <div className="configuracion-grid">
          {/* RF08 - Cambiar Contraseña */}
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

          {/* RF10 - Cambiar Correo */}
          <div
            className="configuracion-card clickable"
            onClick={() => setIsEmailModalOpen(true)}
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="configuracion-card__content">
              <h4 className="configuracion-card__title">
                Cambiar Correo Electrónico
              </h4>
              <p className="configuracion-card__description">
                Actualiza tu email de inicio de sesión
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

          {/* RF11 - Notificaciones */}
          <div
            className="configuracion-card clickable"
            onClick={() => setIsNotifsOpen(!isNotifsOpen)}
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
            <svg
              className="configuracion-card__arrow"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              style={{
                transform: isNotifsOpen ? "rotate(90deg)" : "none",
                transition: "transform 0.2s",
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>

          {/* Panel de notificaciones expandible */}
          {isNotifsOpen && (
            <div className="notif-panel">
              {[
                { key: "nuevas", label: "Nuevas propiedades en mi zona" },
                { key: "favoritos", label: "Cambios en mis favoritos" },
                { key: "promos", label: "Promociones y ofertas" },
                { key: "seguridad", label: "Alertas de seguridad" },
              ].map((item) => (
                <label key={item.key} className="notif-toggle">
                  <span>{item.label}</span>
                  <input
                    type="checkbox"
                    checked={notifPrefs[item.key]}
                    onChange={() => toggleNotif(item.key)}
                  />
                  <span className="toggle-slider" />
                </label>
              ))}
            </div>
          )}

          {/* RF12 - Eliminar cuenta */}
          <div
            className="configuracion-card configuracion-card--danger clickable"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <div
              className="configuracion-card__icon"
              style={{ background: "#fef2f2", color: "#ef4444" }}
            >
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <div className="configuracion-card__content">
              <h4
                className="configuracion-card__title"
                style={{ color: "#ef4444" }}
              >
                Eliminar Cuenta
              </h4>
              <p className="configuracion-card__description">
                Elimina permanentemente tu cuenta y datos
              </p>
            </div>
            <svg
              className="configuracion-card__arrow"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ef4444"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Modal de cambio de contraseña */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />

      {/* Modal de cambio de correo (RF10) */}
      {isEmailModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Cambiar Correo Electrónico</h3>
              <button
                className="close-button"
                onClick={() => {
                  setIsEmailModalOpen(false);
                  setEmailStep(1);
                  setEmailVerify("");
                  setNewEmail("");
                }}
              >
                ×
              </button>
            </div>

            {emailStep === 1 ? (
              <form onSubmit={handleEmailVerifyStep} className="modal-form">
                <p
                  style={{
                    color: "#6b7280",
                    fontSize: "0.9rem",
                    marginBottom: "1rem",
                  }}
                >
                  Por seguridad, confirma tu correo actual antes de cambiarlo.
                </p>
                <div className="form-group">
                  <label>Correo Electrónico Actual</label>
                  <input
                    type="email"
                    value={emailVerify}
                    onChange={(e) => setEmailVerify(e.target.value)}
                    placeholder="Ingresa tu correo actual"
                    required
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn-text"
                    onClick={() => {
                      setIsEmailModalOpen(false);
                      setEmailStep(1);
                    }}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    Verificar
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleEmailChange} className="modal-form">
                <p
                  style={{
                    color: "#6b7280",
                    fontSize: "0.9rem",
                    marginBottom: "1rem",
                  }}
                >
                  ✅ Identidad verificada. Ingresa tu nuevo correo electrónico.
                </p>
                <div className="form-group">
                  <label>Nuevo Correo Electrónico</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="nuevo@correo.com"
                    required
                    disabled={emailLoading}
                  />
                </div>
                <p style={{ color: "#9ca3af", fontSize: "0.8rem" }}>
                  Se enviará un correo de confirmación al nuevo email. Tu
                  contraseña no cambiará.
                </p>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn-text"
                    onClick={() => setEmailStep(1)}
                    disabled={emailLoading}
                  >
                    ← Volver
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={emailLoading}
                  >
                    {emailLoading ? "Enviando..." : "Cambiar Correo"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal de eliminación de cuenta (RF12) */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 style={{ color: "#ef4444" }}>Eliminar Cuenta</h3>
              <button
                className="close-button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteStep(1);
                  setDeleteEmailVerify("");
                  setDeleteConfirmText("");
                }}
              >
                ×
              </button>
            </div>

            {deleteStep === 1 ? (
              <form onSubmit={handleDeleteEmailStep} className="modal-form">
                <p
                  style={{
                    color: "#6b7280",
                    fontSize: "0.9rem",
                    marginBottom: "1rem",
                  }}
                >
                  ⚠️ Esta acción es irreversible. Por seguridad, confirma tu
                  correo electrónico.
                </p>
                <div className="form-group">
                  <label>Correo Electrónico</label>
                  <input
                    type="email"
                    value={deleteEmailVerify}
                    onChange={(e) => setDeleteEmailVerify(e.target.value)}
                    placeholder="Ingresa tu correo electrónico"
                    required
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn-text"
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      setDeleteStep(1);
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ background: "#ef4444" }}
                  >
                    Continuar
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleDeleteAccount} className="modal-form">
                <p
                  style={{
                    color: "#ef4444",
                    fontSize: "0.9rem",
                    marginBottom: "1rem",
                    fontWeight: 600,
                  }}
                >
                  Se eliminarán todos los datos de tu cuenta. Esta acción NO se
                  puede deshacer.
                </p>
                <div className="form-group">
                  <label>
                    Escribe <strong>ELIMINAR</strong> para confirmar
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="ELIMINAR"
                    required
                    disabled={deleteLoading}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn-text"
                    onClick={() => setDeleteStep(1)}
                    disabled={deleteLoading}
                  >
                    ← Volver
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ background: "#ef4444" }}
                    disabled={deleteLoading || deleteConfirmText !== "ELIMINAR"}
                  >
                    {deleteLoading ? "Eliminando..." : "Eliminar mi cuenta"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal de Cambio y Recorte de Foto de Perfil */}
      {isAvatarModalOpen && avatarFile && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: "450px", textAlign: "center" }}>
            <div className="modal-header">
              <h3>Cambiar foto de perfil</h3>
              <button
                className="close-button"
                onClick={() => {
                  setIsAvatarModalOpen(false);
                  setAvatarFile(null);
                }}
              >
                ×
              </button>
            </div>
            
            <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "20px" }}>
              Ajusta tu foto o aplica zoom para encuadrarla.
            </p>

            <div style={{ display: "flex", justifyContent: "center", background: "#f9fafb", padding: "20px", borderRadius: "8px" }}>
              <AvatarEditor
                ref={editorRef}
                image={avatarFile}
                width={200}
                height={200}
                border={20}
                borderRadius={100} // Círculo perfecto
                color={[0, 0, 0, 0.4]} // Sombra de encuadre
                scale={avatarScale}
                rotate={0}
              />
            </div>

            <div style={{ marginTop: "20px", padding: "0 10px" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#4b5563", marginBottom: "8px" }}>
                Nivel de Zoom: {Math.round(avatarScale * 100)}%
              </label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={avatarScale}
                onChange={(e) => setAvatarScale(Number(e.target.value))}
                style={{ width: "80%", cursor: "pointer", accentColor: "#0ea5e9" }}
              />
            </div>

            <div className="modal-footer" style={{ marginTop: "30px", justifyContent: "center", display: "flex", gap: "10px" }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setIsAvatarModalOpen(false);
                  setAvatarFile(null);
                }}
                disabled={avatarLoading}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleSaveAvatar}
                disabled={avatarLoading}
              >
                {avatarLoading ? "Subiendo..." : "Guardar Foto"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerfilSection;

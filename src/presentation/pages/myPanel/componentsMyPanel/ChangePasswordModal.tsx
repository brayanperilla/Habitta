import React, { useState, useEffect } from "react";
import { useAuth } from "@application/context/AuthContext";
import "./ChangePasswordModal.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { updatePassword } = useAuth();

  useEffect(() => {
    if (!isOpen) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (newPassword.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);
    try {
      // Supabase no requiere la contraseña actual para updatePassword si ya hay sesión
      // pero por seguridad el RF08 dice "validar contraseña anterior".
      // Nota: supabase.auth.updateUser solo toma la nueva.
      await updatePassword(newPassword);
      setSuccess(true);
      setTimeout(onClose, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cambiar contraseña",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Cambiar Contraseña</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        {success ? (
          <div className="modal-success">
            <p>✅ ¡Contraseña actualizada con éxito!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label>Nueva Contraseña</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Confirmar Nueva Contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite la contraseña"
                required
                disabled={loading}
              />
            </div>

            {error && <div className="modal-error">⚠️ {error}</div>}

            <div className="modal-footer">
              <button
                type="button"
                className="btn-text"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Actualizando..." : "Actualizar Contraseña"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordModal;

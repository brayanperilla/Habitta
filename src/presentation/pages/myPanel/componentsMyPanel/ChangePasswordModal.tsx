import React, { useState, useEffect } from "react";
import { useAuth } from "@application/context/AuthContext";
import { useToast } from "@application/context/ToastContext";
import "./ChangePasswordModal.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<Props> = ({ isOpen, onClose }) => {
  // Paso 1: verificación de email, Paso 2: nueva contraseña
  const [step, setStep] = useState<1 | 2>(1);
  const [emailInput, setEmailInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { usuario, updatePassword } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (error) showToast(error, "error");
  }, [error]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (success) showToast("¡Contraseña actualizada con éxito!", "success");
  }, [success]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setEmailInput("");
      setNewPassword("");
      setConfirmPassword("");
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  // Paso 1: Verificar que el email coincida con el de la cuenta
  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (emailInput.trim().toLowerCase() !== usuario?.correo?.toLowerCase()) {
      setError("El correo electrónico no coincide con tu cuenta.");
      return;
    }

    setStep(2);
  };

  // Paso 2: Cambiar la contraseña
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
            <p>Cerrando...</p>
          </div>
        ) : step === 1 ? (
          /* Paso 1: Verificación de identidad por email */
          <form onSubmit={handleVerifyEmail} className="modal-form">
            <p
              style={{
                color: "#6b7280",
                fontSize: "0.9rem",
                marginBottom: "1rem",
              }}
            >
              Por seguridad, confirma tu correo electrónico antes de cambiar la
              contraseña.
            </p>
            <div className="form-group">
              <label>Correo Electrónico</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Ingresa tu correo electrónico"
                required
              />
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-text" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Verificar
              </button>
            </div>
          </form>
        ) : (
          /* Paso 2: Ingresar nueva contraseña */
          <form onSubmit={handleSubmit} className="modal-form">
            <p
              style={{
                color: "#6b7280",
                fontSize: "0.9rem",
                marginBottom: "1rem",
              }}
            >
              ✅ Identidad verificada. Ingresa tu nueva contraseña.
            </p>
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

            <div className="modal-footer">
              <button
                type="button"
                className="btn-text"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                ← Volver
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

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

  // Validación de contraseña en tiempo real
  const passwordValidation = {
    hasLength: newPassword.length >= 8,
    hasUpper: /[A-Z]/.test(newPassword),
    hasLower: /[a-z]/.test(newPassword),
    hasNumberAndSafe: (() => {
      if (!/[0-9]/.test(newPassword)) return false;
      if (/(\d)\1{2,}/.test(newPassword)) return false; // Repetidos como 222

      // Secuenciales como 123 o 321
      for (let i = 0; i < newPassword.length - 2; i++) {
        const c1 = newPassword.charCodeAt(i);
        const c2 = newPassword.charCodeAt(i + 1);
        const c3 = newPassword.charCodeAt(i + 2);

        if (c1 >= 48 && c1 <= 57 && c2 >= 48 && c2 <= 57 && c3 >= 48 && c3 <= 57) {
          if ((c2 === c1 + 1 && c3 === c2 + 1) || (c2 === c1 - 1 && c3 === c2 - 1)) {
            return false;
          }
        }
      }
      return true;
    })(),
    hasSpecial: /[^A-Za-z0-9]/.test(newPassword),
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const passwordsMatch = newPassword.length > 0 && confirmPassword.length > 0 && newPassword === confirmPassword;

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

    if (!passwordsMatch) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (!isPasswordValid) {
      setError("La nueva contraseña no cumple con los requisitos de seguridad.");
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
            {newPassword.length > 0 && (
              <ul className="password-requirements" style={{ marginBottom: "16px" }}>
                <li className={passwordValidation.hasLength ? "valid" : "invalid"}>
                  {passwordValidation.hasLength ? "✓" : "✕"} Mínimo 8 caracteres
                </li>
                <li className={passwordValidation.hasUpper ? "valid" : "invalid"}>
                  {passwordValidation.hasUpper ? "✓" : "✕"} Al menos 1 mayúscula
                </li>
                <li className={passwordValidation.hasLower ? "valid" : "invalid"}>
                  {passwordValidation.hasLower ? "✓" : "✕"} Al menos 1 minúscula
                </li>
                <li className={passwordValidation.hasNumberAndSafe ? "valid" : "invalid"}>
                  {passwordValidation.hasNumberAndSafe ? "✓" : "✕"} Números (sin secuencias 123 ni repeticiones 222)
                </li>
                <li className={passwordValidation.hasSpecial ? "valid" : "invalid"}>
                  {passwordValidation.hasSpecial ? "✓" : "✕"} Al menos 1 carácter especial
                </li>
              </ul>
            )}
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
            {confirmPassword.length > 0 && (
              <small className={`password-match-hint ${passwordsMatch ? "valid" : "invalid"}`} style={{ display: "block", marginBottom: "16px" }}>
                {passwordsMatch ? "✓ Las contraseñas coinciden" : "✕ Las contraseñas no coinciden"}
              </small>
            )}

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

import { useEffect } from "react";
import { useResetPassword } from "./hooks/useResetPassword";
import { useToast } from "@application/context/ToastContext";

/** Componente de restablecimiento de contraseña (RF05) */
function ResetPassword() {
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    toggleVisibility,
    loading,
    error,
    success,
    handleSubmit,
  } = useResetPassword();

  const { showToast } = useToast();

  useEffect(() => {
    if (error) showToast(error, "error");
  }, [error]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (success) showToast("¡Contraseña actualizada correctamente!", "success");
  }, [success]); // eslint-disable-line react-hooks/exhaustive-deps

  if (success) {
    return (
      <div className="auth-success-state">
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <span style={{ fontSize: "3rem" }}>🔓</span>
          <h3 style={{ color: "#1a202c" }}>Contraseña Actualizada</h3>
          <p style={{ color: "#666", marginTop: "1rem" }}>
            Tu contraseña ha sido restablecida correctamente. Ya puedes iniciar
            sesión.
          </p>
          <button
            type="button"
            className="submit-button"
            style={{ marginTop: "2rem" }}
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent("switch-auth-mode", { detail: "login" }),
              );
            }}
          >
            Ir al Inicio de Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ color: "#1a202c" }}>Establecer Nueva Contraseña</h3>
        <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.5rem" }}>
          Crea una contraseña segura que no hayas usado antes.
        </p>
      </div>

      <div className="form-group">
        <label htmlFor="password">Nueva Contraseña</label>
        <div className="password-input">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={toggleVisibility}
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
        <div className="password-input">
          <input
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
          />
        </div>
        <small className="password-hint">Mínimo 8 caracteres</small>
      </div>

      <button type="submit" className="submit-button" disabled={loading}>
        {loading ? "Actualizando..." : "Actualizar Contraseña"}
      </button>
    </form>
  );
}

export default ResetPassword;

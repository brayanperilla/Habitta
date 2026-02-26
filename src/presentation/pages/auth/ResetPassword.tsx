import { useResetPassword } from "./hooks/useResetPassword";

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

  if (success) {
    return (
      <div className="auth-success-state">
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <span style={{ fontSize: "3rem" }}>🔓</span>
          <h3>Contraseña Actualizada</h3>
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
        <h3>Establecer Nueva Contraseña</h3>
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

      {error && (
        <div
          className="auth-error"
          style={{
            color: "#ff6b6b",
            backgroundColor: "rgba(255, 107, 107, 0.1)",
            border: "1px solid rgba(255, 107, 107, 0.3)",
            borderRadius: "8px",
            padding: "0.75rem 1rem",
            marginBottom: "0.75rem",
            fontSize: "0.9rem",
            textAlign: "center",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      <button type="submit" className="submit-button" disabled={loading}>
        {loading ? "Actualizando..." : "Actualizar Contraseña"}
      </button>
    </form>
  );
}

export default ResetPassword;

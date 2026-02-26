import { useForgotPassword } from "./hooks/useForgotPassword";

/** Componente de solicitud de recuperación de contraseña (RF05) */
function ForgotPassword() {
  const { email, setEmail, loading, error, success, handleSubmit } =
    useForgotPassword();

  if (success) {
    return (
      <div className="auth-success-state">
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <span style={{ fontSize: "3rem" }}>📧</span>
          <h3>¡Correo enviado!</h3>
          <p style={{ color: "#666", marginTop: "1rem" }}>
            Revisa tu bandeja de entrada para seguir las instrucciones y
            restablecer tu contraseña.
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
            Volver al Inicio de Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h3>Recuperar Contraseña</h3>
        <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.5rem" }}>
          Ingresa tu correo y te enviaremos un enlace para que vuelvas a entrar.
        </p>
      </div>

      <div className="form-group">
        <label htmlFor="email">Correo Electrónico</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@gmail.com"
          required
          disabled={loading}
        />
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
        {loading ? "Enviando..." : "Enviar Enlace"}
      </button>

      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <button
          type="button"
          style={{
            background: "none",
            border: "none",
            color: "#666",
            fontSize: "0.85rem",
            cursor: "pointer",
          }}
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent("switch-auth-mode", { detail: "login" }),
            );
          }}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default ForgotPassword;

import { useEffect } from "react";
import { useForgotPassword } from "./hooks/useForgotPassword";
import { useToast } from "@application/context/ToastContext";

/** Componente de solicitud de recuperación de contraseña (RF05) */
function ForgotPassword() {
  const { email, setEmail, loading, error, success, handleSubmit } =
    useForgotPassword();

  const { showToast } = useToast();

  useEffect(() => {
    if (error) showToast(error, "error");
  }, [error]); // eslint-disable-line react-hooks/exhaustive-deps

  if (success) {
    return (
      <div className="auth-success-state">
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <span style={{ fontSize: "3rem" }}>📧</span>
          <h3 style={{ color: "#1a202c" }}>¡Correo enviado!</h3>
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
        <h3 style={{ color: "#1a202c" }}>Recuperar Contraseña</h3>
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

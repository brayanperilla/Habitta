import { useEffect } from "react";
import { useLoginForm } from "./hooks/useLoginForm";
import { useToast } from "@application/context/ToastContext";
import "./Login.css";

// Componente de Formulario de Inicio de Sesión
function Login() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    togglePasswordVisibility,
    handleSubmit,
    error,
    loading,
    isBlocked,
    blockTimeLeft,
    handleResetFromBlock,
  } = useLoginForm();

  const { showToast } = useToast();

  useEffect(() => {
    if (error) showToast(error, "error");
  }, [error]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Modal de bloqueo por intentos fallidos */}
      {isBlocked && (
        <div className="block-modal-overlay">
          <div className="block-modal">
            <div className="block-modal__icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
            <h3 className="block-modal__title">
              Cuenta bloqueada temporalmente
            </h3>
            <p className="block-modal__text">
              Hemos detectado múltiples intentos fallidos de inicio de sesión en
              tu cuenta. Por seguridad, el acceso ha sido restringido
              temporalmente.
            </p>
            <p className="block-modal__timer">
              Se desbloqueará en aproximadamente{" "}
              <strong>
                {blockTimeLeft} minuto{blockTimeLeft !== 1 ? "s" : ""}
              </strong>
              .
            </p>
            <p className="block-modal__suggestion">
              ¿No recuerdas tu contraseña?
            </p>
            <button
              className="block-modal__reset-btn"
              onClick={handleResetFromBlock}
            >
              Restablecer Contraseña
            </button>
          </div>
        </div>
      )}

      <form className="login-form" onSubmit={handleSubmit}>
        {/* Campo de Email */}
        <div className="form-group-outlined">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=" "
            required
            disabled={loading || isBlocked}
          />
          <label htmlFor="email">Correo Electrónico</label>
        </div>

        {/* Campo de Contraseña */}
        <div className="form-group-outlined">
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              required
              disabled={loading || isBlocked}
            />
            <label htmlFor="password">Contraseña</label>
            <button
              type="button"
              className="toggle-password"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              )}
            </button>
          </div>
          <div style={{ textAlign: "right", marginTop: "4px" }}>
            <button
              type="button"
              className="forgot-password-link"
              style={{
                background: "none",
                border: "none",
                color: "#3498db",
                fontSize: "0.85rem",
                cursor: "pointer",
                padding: 0,
              }}
              onClick={() => {
                const event = new CustomEvent("switch-auth-mode", {
                  detail: "forgot",
                });
                window.dispatchEvent(event);
              }}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>

        {/* Botón de Envío */}
        <button
          type="submit"
          className="submit-button"
          disabled={loading || isBlocked}
        >
          {loading
            ? "Iniciando sesión..."
            : isBlocked
              ? "Cuenta bloqueada"
              : "Iniciar Sesión"}
        </button>
      </form>
    </>
  );
}

export default Login;

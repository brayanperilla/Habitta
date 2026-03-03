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
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@gmail.com"
            required
            disabled={loading || isBlocked}
          />
        </div>

        {/* Campo de Contraseña */}
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading || isBlocked}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
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

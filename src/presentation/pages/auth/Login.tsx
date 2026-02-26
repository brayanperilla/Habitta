import { useLoginForm } from "./hooks/useLoginForm";
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
  } = useLoginForm();

  return (
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
          disabled={loading}
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
            disabled={loading}
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
              // Emitir evento o llamar a prop para cambiar modo si Auth.tsx lo maneja
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

      {/* Mensaje de error (abajo, cerca del botón) */}
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

      {/* Botón de Envío */}
      <button type="submit" className="submit-button" disabled={loading}>
        {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
      </button>
    </form>
  );
}

export default Login;

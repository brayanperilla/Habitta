import { useRegisterForm } from "./hooks/useRegisterForm";
import "./Register.css";

// Componente de Formulario de Registro
function Register() {
  const {
    fullName,
    setFullName,
    email,
    setEmail,
    confirmationEmail,
    setConfirmationEmail,
    phone,
    setPhone,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,

    togglePasswordVisibility,
    handleSubmit,
  } = useRegisterForm();

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      {/* Nombre Completo */}
      <div className="form-group">
        <label htmlFor="fullName">Nombre Completo</label>
        <input
          type="text"
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Juan Pérez"
          required
        />
      </div>

      {/* Campo de Email */}
      <div className="form-group">
        <label htmlFor="email">Correo Electrónico</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
        />
      </div>
      {/* Campo de Confirmación de Email */}
      <div className="form-group">
        <label htmlFor="confirmationEmail">Confirmar Correo Electrónico</label>
        <input
          type="email"
          id="confirmationEmail"
          value={confirmationEmail}
          onChange={(e) => setConfirmationEmail(e.target.value)}
          placeholder="tu@email.com"
          required
        />
      </div>
      {/* Campo de teléfono */}
      <div className="form-group">
        <label htmlFor="phone">Teléfono</label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="3001234567"
          required
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
            minLength={8}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
        <small className="password-hint">Mínimo 8 caracteres</small>
      </div>

      {/* Campo de Confirmación de Contraseña */}
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
        <div className="password-input">
          <input
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            minLength={8}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
        <small className="password-hint">Mínimo 8 caracteres</small>
      </div>

      {/* Botón de Envío */}
      <button type="submit" className="submit-button">
        Crear Cuenta
      </button>
    </form>
  );
}

export default Register;

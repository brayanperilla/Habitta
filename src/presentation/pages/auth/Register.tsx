import { useEffect, useState } from "react";
import { useRegisterForm } from "./hooks/useRegisterForm";
import { useToast } from "@application/context/ToastContext";
import { useWarnIfUnsavedChanges } from "@application/hooks/useWarnIfUnsavedChanges";
import PremiumPromoModal from "@presentation/components/premiumPromoModal/PremiumPromoModal";
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
    error,
    loading,
    successMessage,
    emailDisponible,
    checkingEmail,
    showPromoModal,
    setShowPromoModal,
    passwordValidation,
    passwordsMatch,
  } = useRegisterForm();

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    if (error) showToast(error, "error");
  }, [error]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (successMessage) showToast(successMessage, "success");
  }, [successMessage]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasUnsavedChanges = Boolean(
    fullName ||
    email ||
    confirmationEmail ||
    phone ||
    password ||
    confirmPassword,
  );
  useWarnIfUnsavedChanges(hasUnsavedChanges && !successMessage);

  const EyeOpen = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  );

  const EyeClosed = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
  );

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      {/* Nombre Completo */}
      <div className="form-group-outlined">
        <input
          type="text"
          id="fullName"
          value={fullName}
          onChange={(e) => {
            const formattedName = e.target.value
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            setFullName(formattedName);
          }}
          placeholder=" "
          required
          disabled={loading}
        />
        <label htmlFor="fullName">Nombre Completo</label>
      </div>

      {/* Correo Electrónico */}
      <div className="form-group-outlined email-group">
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder=" "
          required
          disabled={loading}
        />
        <label htmlFor="email">
          Correo Electrónico
          {checkingEmail && <span className="email-status info"> 🔄</span>}
          {!checkingEmail && emailDisponible === true && (
            <span className="email-status success"> ✅</span>
          )}
          {!checkingEmail && emailDisponible === false && (
            <span className="email-status error"> ❌ (Ya registrado)</span>
          )}
        </label>
      </div>

      {/* Confirmar Correo Electrónico */}
      <div className="form-group-outlined">
        <input
          type="email"
          id="confirmationEmail"
          value={confirmationEmail}
          onChange={(e) => setConfirmationEmail(e.target.value)}
          placeholder=" "
          required
          disabled={loading}
        />
        <label htmlFor="confirmationEmail">Confirmar Correo Electrónico</label>
      </div>

      {/* Teléfono */}
      <div className="form-group-outlined">
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder=" "
          required
          disabled={loading}
        />
        <label htmlFor="phone">Teléfono</label>
      </div>

      {/* Contraseña */}
      <div className="form-group-outlined">
        <div className="password-input">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder=" "
            minLength={8}
            required
            disabled={loading}
          />
          <label htmlFor="password">Contraseña</label>
          <button
            type="button"
            className="toggle-password"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <EyeOpen /> : <EyeClosed />}
          </button>
        </div>
        {password.length > 0 && (
          <ul className="password-requirements">
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
      </div>

      {/* Confirmar Contraseña */}
      <div className="form-group-outlined">
        <div className="password-input">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder=" "
            minLength={8}
            required
            disabled={loading}
          />
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOpen /> : <EyeClosed />}
          </button>
        </div>
        {confirmPassword.length > 0 && (
          <small className={`password-match-hint ${passwordsMatch ? "valid" : "invalid"}`}>
            {passwordsMatch ? "✓ Las contraseñas coinciden" : "✕ Las contraseñas no coinciden"}
          </small>
        )}
      </div>

      {/* Términos y Condiciones */}
      <div className="form-group terms-checkbox-group" style={{ marginBottom: "1.5rem" }}>
        <label className="checkbox-label" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            required
            disabled={loading}
            style={{ marginTop: "4px", accentColor: "#35d2db", width: "18px", height: "18px", flexShrink: 0, cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.4' }}>
            He leído y acepto los <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: "#35d2db", textDecoration: "underline", fontWeight: "600" }}>Términos de uso</a> y la <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#35d2db", textDecoration: "underline", fontWeight: "600" }}>Política de privacidad</a>.
          </span>
        </label>
      </div>

      {/* Botón de Envío */}
      <button type="submit" className="submit-button" disabled={loading}>
        {loading ? "Creando cuenta..." : "Crear Cuenta"}
      </button>

      {/* Modal Promocional pos-registro */}
      <PremiumPromoModal
        isOpen={showPromoModal}
        onClose={() => setShowPromoModal(false)}
        title="¡Bienvenido a Habitta!"
        subtitle="Antes de continuar, elige cómo quieres destacar tus propiedades."
        fromAction="register"
      />
    </form>
  );
}

export default Register;

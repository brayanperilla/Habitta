import { useState, useEffect } from "react";
import { useAuth } from "@application/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { authApi } from "@infrastructure/api/auth.api";

/** Hook del formulario de registro — validaciones frontend + signUp */
export function useRegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validación de contraseña en tiempo real
  const passwordValidation = {
    hasLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumberAndSafe: (() => {
      if (!/[0-9]/.test(password)) return false;
      if (/(\d)\1{2,}/.test(password)) return false; // Repetidos como 222

      // Secuenciales como 123 o 321
      for (let i = 0; i < password.length - 2; i++) {
        const c1 = password.charCodeAt(i);
        const c2 = password.charCodeAt(i + 1);
        const c3 = password.charCodeAt(i + 2);

        if (c1 >= 48 && c1 <= 57 && c2 >= 48 && c2 <= 57 && c3 >= 48 && c3 <= 57) {
          if ((c2 === c1 + 1 && c3 === c2 + 1) || (c2 === c1 - 1 && c3 === c2 - 1)) {
            return false;
          }
        }
      }
      return true;
    })(),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // RF02 — Estados para validación de email en tiempo real
  const [emailDisponible, setEmailDisponible] = useState<boolean | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  // RF02 — Lógica de validación con debounce (500ms)
  useEffect(() => {
    if (!email.trim() || !email.includes("@")) {
      setEmailDisponible(null);
      return;
    }

    const timer = setTimeout(async () => {
      setCheckingEmail(true);
      try {
        const disponible = await authApi.checkEmailDisponible(email);
        setEmailDisponible(disponible);
      } catch {
        setEmailDisponible(null);
      } finally {
        setCheckingEmail(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validaciones frontend
    if (emailDisponible === false) {
      setError("Este correo ya está registrado.");
      return;
    }
    if (email.trim().toLowerCase() !== confirmationEmail.trim().toLowerCase()) {
      setError("Los correos electrónicos no coinciden.");
      return;
    }
    if (!isPasswordValid) {
      setError("La contraseña no cumple con los requisitos de seguridad.");
      return;
    }
    if (!passwordsMatch) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const result = await signUp(email, password, fullName, phone);

      if (result.needsConfirmation) {
        setSuccessMessage(
          "¡Cuenta creada! Revisa tu correo para confirmar tu cuenta.",
        );
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrarse.");
    } finally {
      setLoading(false);
    }
  };

  return {
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
    togglePasswordVisibility: () => setShowPassword(!showPassword),
    handleSubmit,
    error,
    loading,
    successMessage,
    emailDisponible,
    checkingEmail,
    passwordValidation,
    isPasswordValid,
    passwordsMatch,
  };
}

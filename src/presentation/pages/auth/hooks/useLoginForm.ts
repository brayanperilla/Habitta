import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@application/context/AuthContext";
import { useNavigate } from "react-router-dom";

const LOCK_KEY = "habitta_login_lock";
const ATTEMPTS_KEY = "habitta_login_attempts";
const MAX_ATTEMPTS = 4;
const LOCK_DURATION_MS = 10 * 60 * 1000; // 10 minutos

/** Hook del formulario de login — con timeout de 15s y bloqueo por intentos */
export function useLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Bloqueo por intentos
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeLeft, setBlockTimeLeft] = useState(0);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  // Verificar si está bloqueado al montar
  const checkBlock = useCallback(() => {
    const lockUntil = Number(localStorage.getItem(LOCK_KEY) || 0);
    if (lockUntil > Date.now()) {
      setIsBlocked(true);
      setBlockTimeLeft(Math.ceil((lockUntil - Date.now()) / 60000));
    } else {
      setIsBlocked(false);
      setBlockTimeLeft(0);
      // Limpiar si expiró
      if (lockUntil > 0) {
        localStorage.removeItem(LOCK_KEY);
        localStorage.removeItem(ATTEMPTS_KEY);
      }
    }
  }, []);

  useEffect(() => {
    checkBlock();
    const interval = setInterval(checkBlock, 30000); // re-check cada 30s
    return () => clearInterval(interval);
  }, [checkBlock]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Verificar bloqueo
    checkBlock();
    if (isBlocked) return;

    setLoading(true);

    try {
      // Timeout de 15s para evitar carga infinita (cold start de Supabase)
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(
          () =>
            reject(new Error("El servidor tardó demasiado. Intenta de nuevo.")),
          15000,
        ),
      );

      const profile = await Promise.race([signIn(email, password), timeout]);

      // Login exitoso — limpiar intentos
      localStorage.removeItem(ATTEMPTS_KEY);
      localStorage.removeItem(LOCK_KEY);

      // Redirigir según el rol
      if (profile.rol === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      // Incrementar intentos fallidos
      const attempts = Number(localStorage.getItem(ATTEMPTS_KEY) || 0) + 1;
      localStorage.setItem(ATTEMPTS_KEY, String(attempts));

      if (attempts >= MAX_ATTEMPTS) {
        const lockUntil = Date.now() + LOCK_DURATION_MS;
        localStorage.setItem(LOCK_KEY, String(lockUntil));
        setIsBlocked(true);
        setBlockTimeLeft(10);
      }

      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  // Función para restablecer — también limpia el bloqueo
  const handleResetFromBlock = () => {
    // Limpiar bloqueo al ir a restablecer contraseña
    localStorage.removeItem(LOCK_KEY);
    localStorage.removeItem(ATTEMPTS_KEY);
    setIsBlocked(false);
    setBlockTimeLeft(0);

    const event = new CustomEvent("switch-auth-mode", {
      detail: "forgot",
    });
    window.dispatchEvent(event);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    togglePasswordVisibility: () => setShowPassword(!showPassword),
    handleSubmit,
    error,
    loading,
    isBlocked,
    blockTimeLeft,
    handleResetFromBlock,
  };
}

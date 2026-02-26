import { useState } from "react";
import { useAuth } from "@application/context/AuthContext";

/** Hook para el formulario de recuperación de contraseña */
export function useForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!email.trim() || !email.includes("@")) {
        throw new Error("Ingresa un correo electrónico válido.");
      }
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al enviar el correo.",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    loading,
    error,
    success,
    handleSubmit,
  };
}

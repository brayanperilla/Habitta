import { supabase } from "@infrastructure/supabase/client";
import type { Usuario } from "@domain/entities/Usuario";

/** Traduce errores de Supabase Auth a español */
function traducirError(msg: string): string {
  const t: Record<string, string> = {
    "user already registered": "Este correo ya está registrado.",
    "invalid login credentials": "Correo o contraseña incorrectos.",
    "email not confirmed": "Debes confirmar tu correo antes de iniciar sesión.",
    "password should be at least 6 characters":
      "La contraseña debe tener al menos 6 caracteres.",
    "unable to validate email address: invalid format":
      "El formato del correo no es válido.",
    "signup requires a valid password": "Debes ingresar una contraseña válida.",
    "to signup, please provide your email":
      "Debes ingresar un correo electrónico.",
    "email rate limit exceeded":
      "Límite de correos excedido. Espera unos minutos.",
    "for security purposes, you can only request this once every 60 seconds":
      "Solo puedes intentar una vez cada 60 segundos.",
    over_email_send_rate_limit:
      "Límite de correos excedido. Espera unos minutos.",
    "error sending confirmation email":
      "Error al enviar correo de confirmación.",
  };
  return t[msg.toLowerCase().trim()] ?? msg;
}

/** Resultado de registro */
export interface SignUpResult {
  needsConfirmation: boolean;
}

/**
 * API de autenticación — Supabase Auth + tabla `usuarios`.
 *
 * Flujo: signUp → confirmar email → signIn (crea perfil en primer login) → signOut
 */
export const authApi = {
  /** Registrar usuario en Supabase Auth (metadata incluye nombre y teléfono) */
  signUp: async (
    email: string,
    password: string,
    nombre: string,
    telefono: string,
  ): Promise<SignUpResult> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre, telefono } },
    });

    if (error) throw new Error(traducirError(error.message));
    if (!data.user) throw new Error("No se pudo crear el usuario.");

    // Detectar email duplicado (Supabase retorna identities vacío)
    if (data.user.identities?.length === 0) {
      throw new Error("Este correo ya está registrado.");
    }

    const tieneSession = data.session !== null;
    if (tieneSession) await crearRegistroUsuario(email, nombre, telefono);

    return { needsConfirmation: !tieneSession };
  },

  /** Iniciar sesión — crea perfil en `usuarios` si es primer login */
  signIn: async (email: string, password: string): Promise<Usuario> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(traducirError(error.message));

    // Actualizar fecha de login (no crítico)
    await supabase
      .from("usuarios")
      .update({ fechalogin: new Date().toISOString() })
      .eq("correo", email);

    // Buscar perfil en tabla `usuarios`
    const { data: usuario, error: dbError } = await supabase
      .from("usuarios")
      .select("*")
      .eq("correo", email)
      .maybeSingle();

    if (dbError)
      throw new Error("Sesión iniciada, pero no se pudo cargar tu perfil.");

    // Primer login: crear perfil con metadata de Auth
    if (!usuario) {
      const meta = data.user?.user_metadata;
      const { data: nuevo, error: insertErr } = await supabase
        .from("usuarios")
        .insert({
          correo: email,
          nombre: meta?.nombre || email.split("@")[0],
          telefono: meta?.telefono || null,
          contrasena: "managed_by_supabase_auth",
          fotoperfil: null,
          descripcion: null,
        })
        .select()
        .maybeSingle();

      if (insertErr || !nuevo) throw new Error("No se pudo crear tu perfil.");
      return nuevo;
    }

    return usuario;
  },

  /** Cerrar sesión */
  signOut: async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(traducirError(error.message));
  },

  /** Obtener sesión activa (restaurar al recargar) */
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) return null;
    return data.session;
  },

  /** Buscar usuario por correo en tabla `usuarios` */
  getUsuarioByCorreo: async (correo: string): Promise<Usuario | null> => {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("correo", correo)
      .maybeSingle();

    if (error) return null;
    return data;
  },

  /** RF02 — Verificar si un correo ya está registrado (para validación en tiempo real) */
  checkEmailDisponible: async (correo: string): Promise<boolean> => {
    const { count, error } = await supabase
      .from("usuarios")
      .select("idusuario", { count: "exact", head: true })
      .eq("correo", correo.toLowerCase().trim());

    if (error) return true; // En caso de error, permitir continuar
    return (count ?? 0) === 0;
  },

  /** RF05 — Enviar enlace de recuperación de contraseña al correo */
  resetPassword: async (email: string): Promise<void> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?mode=reset`,
    });
    if (error) throw new Error(traducirError(error.message));
  },

  /** RF08 — Actualizar contraseña del usuario autenticado */
  updatePassword: async (newPassword: string): Promise<void> => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw new Error(traducirError(error.message));
  },
};

/** Crear registro en `usuarios` si no existe */
async function crearRegistroUsuario(
  correo: string,
  nombre: string,
  telefono: string,
) {
  const { data: existente } = await supabase
    .from("usuarios")
    .select("idusuario")
    .eq("correo", correo)
    .maybeSingle();

  if (existente) return;

  await supabase.from("usuarios").insert({
    correo,
    nombre,
    telefono: telefono || null,
    contrasena: "managed_by_supabase_auth",
    fotoperfil: null,
    descripcion: null,
  });
}

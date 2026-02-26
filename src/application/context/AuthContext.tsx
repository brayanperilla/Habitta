import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import type { Usuario } from "@domain/entities/Usuario";
import { authApi } from "@infrastructure/api/auth.api";
import type { SignUpResult } from "@infrastructure/api/auth.api";
import { supabase } from "@infrastructure/supabase/client";

/** Tiempo de inactividad para auto-logout: 15 minutos */
const INACTIVITY_MS = 15 * 60 * 1000;

// ─── Tipos ───────────────────────────────────────────────────────────

interface AuthContextType {
  usuario: Usuario | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<Usuario>;
  signUp: (
    email: string,
    password: string,
    nombre: string,
    telefono: string,
  ) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  updatePerfil: (datos: Partial<Usuario>) => Promise<Usuario>;
}

// ─── Contexto ────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

/** Hook para acceder al contexto de autenticación */
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}

// ─── Provider ────────────────────────────────────────────────────────

interface Props {
  children: ReactNode;
}

/**
 * AuthProvider — restaura sesión al recargar, escucha cambios de auth,
 * auto-logout por 15 min de inactividad.
 */
export function AuthProvider({ children }: Props) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Inactividad ─────────────────────────────────────────────────

  const cerrarPorInactividad = useCallback(async () => {
    console.log("Sesión cerrada por inactividad (15 min).");
    try {
      await authApi.signOut();
    } catch {
      /* silencioso */
    }
    setUsuario(null);
  }, []);

  const reiniciarTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(cerrarPorInactividad, INACTIVITY_MS);
  }, [cerrarPorInactividad]);

  // Escuchar actividad del usuario
  useEffect(() => {
    if (!usuario) return;

    const eventos = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    reiniciarTimer();
    eventos.forEach((ev) => window.addEventListener(ev, reiniciarTimer));

    return () => {
      eventos.forEach((ev) => window.removeEventListener(ev, reiniciarTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [usuario, reiniciarTimer]);

  // ─── Restaurar sesión al montar ──────────────────────────────────

  useEffect(() => {
    let mounted = true;

    const cargarPerfil = async (email: string) => {
      try {
        const perfil = await authApi.getUsuarioByCorreo(email);
        if (perfil && mounted) setUsuario(perfil);
      } catch {
        /* silencioso */
      }
    };

    // onAuthStateChange dispara INITIAL_SESSION al montar → restaura sesión
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === "SIGNED_OUT") {
        setUsuario(null);
        setLoading(false);
      } else if (session?.user?.email) {
        await cargarPerfil(session.user.email);
        if (mounted) setLoading(false);
      } else {
        if (mounted) setLoading(false);
      }
    });

    // Fallback: si no hay respuesta en 3s, dejar de mostrar loading
    const fallback = setTimeout(() => {
      if (mounted && loading) setLoading(false);
    }, 3000);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(fallback);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Funciones ────────────────────────────────────────────────────

  const signIn = async (email: string, password: string): Promise<Usuario> => {
    const perfil = await authApi.signIn(email, password);
    setUsuario(perfil);
    return perfil;
  };

  const signUp = async (
    email: string,
    password: string,
    nombre: string,
    telefono: string,
  ) => {
    return await authApi.signUp(email, password, nombre, telefono);
  };

  const signOut = async () => {
    await authApi.signOut();
    setUsuario(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetPassword = async (email: string) => {
    await authApi.resetPassword(email);
  };

  const updatePassword = async (newPassword: string) => {
    await authApi.updatePassword(newPassword);
  };

  const updatePerfil = async (datos: Partial<Usuario>) => {
    if (!usuario) throw new Error("No hay usuario autenticado.");
    const { usuariosApi } = await import("@infrastructure/api/usuarios.api");
    const actualizado = await usuariosApi.updatePerfil(
      usuario.idusuario,
      datos,
    );
    setUsuario(actualizado);
    return actualizado;
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        updatePerfil,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

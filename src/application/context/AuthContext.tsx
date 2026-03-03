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

/** Tiempo de inactividad para auto-logout: 5 minutos */
const INACTIVITY_MS = 5 * 60 * 1000;

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
    let dbProfileLoaded = false; // Solo cargar perfil DB una vez

    /**
     * Crea un Usuario mínimo a partir de session.user.
     */
    const crearUsuarioDesdeSession = (su: {
      email?: string;
      created_at?: string;
      user_metadata?: Record<string, unknown>;
    }): Usuario => ({
      idusuario: 0,
      correo: su.email ?? "",
      nombre: (su.user_metadata?.nombre as string) ?? su.email ?? "Usuario",
      telefono: (su.user_metadata?.telefono as string) ?? null,
      contrasena: "managed_by_supabase_auth",
      fotoperfil: null,
      descripcion: null,
      estadocuenta: null,
      ultimaactividad: null,
      fechalogin: null,
      fecharegistro: su.created_at ?? null,
      plan: "gratuito",
    });

    /**
     * Carga perfil completo de la tabla `usuarios` UNA SOLA VEZ.
     * Si falla, el usuario conserva los datos básicos.
     */
    const enriquecerConPerfilDB = async (email: string) => {
      if (dbProfileLoaded) return;
      dbProfileLoaded = true;
      try {
        const perfil = await authApi.getUsuarioByCorreo(email);
        if (perfil && mounted) {
          // Bloquear cuentas eliminadas incluso en restore de sesión
          if (perfil.estadocuenta === "eliminada") {
            console.warn("[AuthContext] Cuenta eliminada — cerrando sesión");
            await supabase.auth.signOut();
            setUsuario(null);
            return;
          }
          setUsuario(perfil);
          console.log("[AuthContext] Perfil DB cargado:", perfil.correo);
        }
      } catch (err) {
        console.warn(
          "[AuthContext] Error cargando perfil DB (sesión intacta):",
          err,
        );
        dbProfileLoaded = false; // Permitir reintento en siguiente evento
      }
    };

    // 1. Leer sesión existente de localStorage
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        console.log(
          "[AuthContext] getSession:",
          session ? session.user.email : "sin sesión",
        );
        if (!mounted) return;

        if (session?.user?.email) {
          setUsuario(crearUsuarioDesdeSession(session.user));
          setLoading(false);
          enriquecerConPerfilDB(session.user.email);
        } else {
          setUsuario(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("[AuthContext] Error en getSession:", err);
        if (mounted) setLoading(false);
      });

    // 2. Escuchar solo eventos relevantes (sin loops)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`[AuthContext] onAuthStateChange: ${event}`);
      if (!mounted) return;

      if (event === "SIGNED_OUT") {
        setUsuario(null);
        dbProfileLoaded = false;
        setLoading(false);
      } else if (event === "SIGNED_IN") {
        // Login fresco — cargar todo
        if (session?.user?.email) {
          setUsuario(crearUsuarioDesdeSession(session.user));
          setLoading(false);
          dbProfileLoaded = false;
          enriquecerConPerfilDB(session.user.email);
        }
      }
      // TOKEN_REFRESHED e INITIAL_SESSION: NO hacer nada.
      // getSession() ya manejó la carga inicial.
      // TOKEN_REFRESHED NO debe llamar a la DB para evitar el loop infinito.
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
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

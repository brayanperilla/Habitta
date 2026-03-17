import { supabase } from "@infrastructure/supabase/client";

/** API de usuarios — operaciones sobre la tabla `usuarios` */
export const usuariosApi = {
  /** Obtener perfil de usuario por ID (incluye teléfono del vendedor) */
  getById: async (idusuario: number) => {
    const { data, error } = await supabase
      .from("usuarios")
      .select("idusuario,nombre,telefono,correo,fotoperfil,descripcion,plan,estadocuenta")
      .eq("idusuario", idusuario)
      .maybeSingle();
    if (error) throw new Error(`Error obteniendo usuario: ${error.message}`);
    return data as import("@domain/entities/Usuario").Usuario | null;
  },

  cambiarPlan: async (
    idusuario: number,
    nuevoPlan: "gratuito" | "premium",
  ): Promise<void> => {
    const { data, error } = await supabase
      .from("usuarios")
      .update({ plan: nuevoPlan })
      .eq("idusuario", idusuario)
      .select();

    if (error) throw new Error(`Error cambiando plan: ${error.message}`);
    if (!data || data.length === 0) throw new Error("Acceso denegado. Configura las políticas RLS en Supabase para permitir a los administradores actualizar la tabla 'usuarios'.");
  },

  /** Obtener el plan actual del usuario */
  obtenerPlan: async (idusuario: number): Promise<"gratuito" | "premium"> => {
    const { data, error } = await supabase
      .from("usuarios")
      .select("plan")
      .eq("idusuario", idusuario)
      .single();

    if (error) throw new Error(`Error obteniendo plan: ${error.message}`);
    return data.plan ?? "gratuito";
  },

  /** Actualizar perfil del usuario (nombre, biografía, etc.) */
  updatePerfil: async (
    idusuario: number,
    datos: Partial<import("@domain/entities/Usuario").Usuario>,
  ): Promise<import("@domain/entities/Usuario").Usuario> => {
    const { data, error } = await supabase
      .from("usuarios")
      .update(datos)
      .eq("idusuario", idusuario)
      .select()
      .single();

    if (error) throw new Error(`Error actualizando perfil: ${error.message}`);
    return data as import("@domain/entities/Usuario").Usuario;
  },

  /** (Admin) Obtener todos los usuarios de la plataforma */
  getAllUsuarios: async (): Promise<import("@domain/entities/Usuario").Usuario[]> => {
    const { data, error } = await supabase
      .from("usuarios")
      .select("idusuario,nombre,correo,telefono,plan,estadocuenta,fechalogin,rol,ultimaactividad")
      .order("fechalogin", { ascending: false });

    if (error) throw new Error(`Error obteniendo lista de usuarios: ${error.message}`);
    return data as import("@domain/entities/Usuario").Usuario[];
  },

  updateUserState: async (
    idusuario: number,
    nuevoEstado: "Activa" | "Suspendida" | "Eliminada",
  ): Promise<void> => {
    const { data, error } = await supabase
      .from("usuarios")
      .update({ estadocuenta: nuevoEstado })
      .eq("idusuario", idusuario)
      .select();

    if (error) throw new Error(`Error cambiando estado de cuenta: ${error.message}`);
    if (!data || data.length === 0) throw new Error("Acceso denegado por base de datos. Debes habilitar permisos (UPDATE) a los administradores en las políticas RLS de Supabase.");
  },
};

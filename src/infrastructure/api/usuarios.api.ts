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

  /** Cambiar el plan del usuario (gratuito ↔ premium) */
  cambiarPlan: async (
    idusuario: number,
    nuevoPlan: "gratuito" | "premium",
  ): Promise<void> => {
    const { error } = await supabase
      .from("usuarios")
      .update({ plan: nuevoPlan })
      .eq("idusuario", idusuario);

    if (error) throw new Error(`Error cambiando plan: ${error.message}`);
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
};

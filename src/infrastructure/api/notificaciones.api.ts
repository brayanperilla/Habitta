import { supabase } from "@infrastructure/supabase/client";

export interface NotificacionPreferencia {
  id: number;
  idusuario: number;
  recibir_emails: boolean;
  alertas_mensajes: boolean;
  alertas_estado_propiedad: boolean;
}

export interface Notificacion {
  idnotificacion: number;
  idusuario: number;
  titulo: string;
  tipo: "propiedad_publicada" | "estado_propiedad" | "nueva_coincidencia" | string;
  descripcion: string | null;
  fechaEnvio: string | null;
  leido: boolean | null;
}

export const notificacionesApi = {
  /**
   * Obtiene las preferencias de un usuario. Si no existen, las crea por defecto.
   */
  getPreferencias: async (idusuario: number): Promise<NotificacionPreferencia> => {
    const { data, error } = await supabase
      .from("notificaciones_preferencias")
      .select("*")
      .eq("idusuario", idusuario)
      .maybeSingle();

    if (error) throw new Error(`Error obteniendo preferencias: ${error.message}`);
    
    // Si no existen (porque el usuario es nuevo y no se insertó un trigger BD), las creamos
    if (!data) {
      return await notificacionesApi.crearPreferenciasPorDefecto(idusuario);
    }
    
    return data;
  },

  /**
   * Crea preferencias por defecto (todas true).
   */
  crearPreferenciasPorDefecto: async (idusuario: number): Promise<NotificacionPreferencia> => {
    const defaultPrefs = {
      idusuario,
      recibir_emails: true,
      alertas_mensajes: true,
      alertas_estado_propiedad: true,
    };
    const { data, error } = await supabase
      .from("notificaciones_preferencias")
      .insert(defaultPrefs)
      .select()
      .single();

    if (error) throw new Error(`Error creando preferencias: ${error.message}`);
    return data;
  },

  /**
   * Actualiza las preferencias de notificaciones.
   */
  updatePreferencias: async (idusuario: number, updates: Partial<Omit<NotificacionPreferencia, 'id' | 'idusuario'>>): Promise<NotificacionPreferencia> => {
    const { data, error } = await supabase
      .from("notificaciones_preferencias")
      .update(updates)
      .eq("idusuario", idusuario)
      .select()
      .single();

    if (error) throw new Error(`Error actualizando preferencias: ${error.message}`);
    return data;
  },

  // ── Notificaciones reales ─────────────────────────────────────────────────

  getByUsuario: async (idusuario: number): Promise<Notificacion[]> => {
    const { data, error } = await supabase
      .from("notificaciones")
      .select("*")
      .eq("idusuario", idusuario)
      .order("fechaEnvio", { ascending: false });
    if (error) throw new Error(`Error cargando notificaciones: ${error.message}`);
    return (data ?? []) as Notificacion[];
  },

  countNoLeidas: async (idusuario: number): Promise<number> => {
    const { count, error } = await supabase
      .from("notificaciones")
      .select("*", { count: "exact", head: true })
      .eq("idusuario", idusuario)
      .eq("leido", false);
    if (error) throw new Error(`Error contando notificaciones: ${error.message}`);
    return count ?? 0;
  },

  toggleLeida: async (idnotificacion: number, leido: boolean): Promise<void> => {
    const { error } = await supabase
      .from("notificaciones")
      .update({ leido })
      .eq("idnotificacion", idnotificacion);
    if (error) throw new Error(`Error actualizando notificación: ${error.message}`);
  },

  marcarTodasLeidas: async (idusuario: number): Promise<void> => {
    const { error } = await supabase
      .from("notificaciones")
      .update({ leido: true })
      .eq("idusuario", idusuario)
      .eq("leido", false);
    if (error) throw new Error(`Error marcando todas como leídas: ${error.message}`);
  },

  eliminar: async (idnotificacion: number): Promise<void> => {
    const { error } = await supabase
      .from("notificaciones")
      .delete()
      .eq("idnotificacion", idnotificacion);
    if (error) throw new Error(`Error eliminando notificación: ${error.message}`);
  },

  crear: async (
    idusuario: number,
    titulo: string,
    tipo: Notificacion["tipo"],
    descripcion?: string
  ): Promise<Notificacion> => {
    const { data, error } = await supabase
      .from("notificaciones")
      .insert({
        idusuario,
        titulo,
        tipo,
        descripcion: descripcion ?? null,
        fechaEnvio: new Date().toISOString(),
        leido: false,
      })
      .select()
      .single();
    if (error) throw new Error(`Error creando notificación: ${error.message}`);
    return data as Notificacion;
  },
};


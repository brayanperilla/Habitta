import { supabase } from '@infrastructure/supabase/client';


export interface Pqrs {
  idpqrs?: number;
  idusuario?: number | null;
  tema: string;
  nombres_completos: string;
  celular: string;
  correo: string;
  ciudad: string;
  departamento: string;
  perfiles: string; // JSON or comma separated
  mensaje: string;
  acepta_terminos: boolean;
  fechacreacion?: string;
  estado?: string;
}

export const pqrsApi = {
  /**
   * Crea un nuevo PQRS y envía notificación a los administradores.
   */
  async createPqrs(data: Pqrs): Promise<Pqrs> {
    // Insert PQRS
    const { data: newPqrs, error } = await supabase
      .from('pqrs')
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error('Error creating PQRS:', error);
      throw error;
    }

    // Buscar administradores para notificar
    try {
      const { data: admins, error: adminError } = await supabase
        .from('usuarios')
        .select('idusuario')
        .eq('rol', 'admin');

      if (!adminError && admins && admins.length > 0) {
        const notificaciones = admins.map((admin) => ({
          idusuario: admin.idusuario,
          titulo: 'Nuevo reporte PQRS',
          descripcion: `Has recibido un nuevo reporte de ${data.nombres_completos} - Tema: ${data.tema}`,
          tipo: 'mensaje',
          leido: false,
        }));

        await supabase.from('notificaciones').insert(notificaciones);
      }
    } catch (notifErr) {
      console.error('Error enviando notificaciones a admins:', notifErr);
      // No lanzamos error para no interrumpir el flujo si falla la notificación
    }

    return newPqrs as Pqrs;
  },

  /**
   * Obtiene todos los PQRS para el panel de administración.
   */
  async getAllPqrs(): Promise<Pqrs[]> {
    const { data, error } = await supabase
      .from('pqrs')
      .select('*')
      .order('fechacreacion', { ascending: false });

    if (error) {
      console.error('Error fetching PQRS:', error);
      throw error;
    }

    return data as Pqrs[];
  },

  /**
   * Actualiza el estado de un PQRS.
   */
  async updatePqrsStatus(idpqrs: number, estado: string): Promise<Pqrs> {
    const { data, error } = await supabase
      .from('pqrs')
      .update({ estado })
      .eq('idpqrs', idpqrs)
      .select()
      .single();

    if (error) {
      console.error('Error updating PQRS status:', error);
      throw error;
    }

    // Mensaje de notificación personalizado según el estado
    let descripcionNotificacion = '';
    
    if (estado === 'en_revision') {
      descripcionNotificacion = 'Hola, tu PQRS está siendo revisada en este momento. Cambiamos el estado de tu solicitud a "En Revisión" y nuestro equipo ya se encuentra trabajando para darte una pronta respuesta.';
    } else if (estado === 'resuelto') {
      descripcionNotificacion = 'Hola, nos complace informarte que tu PQRS ha sido resuelta. Hemos finalizado la gestión de tu caso y esperamos haber atendido tu solicitud de manera satisfactoria.';
    } else {
      descripcionNotificacion = `Hola, tu PQRS se ha actualizado al estado "${estado}". Seguimos atentos a tu caso.`;
    }

    if (data.idusuario) {
      try {
        const notificacion = {
          idusuario: data.idusuario,
          titulo: 'Actualización en tu caso de Ayuda/PQRS',
          descripcion: descripcionNotificacion,
          tipo: 'mensaje',
          leido: false,
        };
        await supabase.from('notificaciones').insert([notificacion]);
      } catch (errNotif) {
        console.error("No se pudo notificar al usuario:", errNotif);
      }
    }

    return data as Pqrs;
  }
};

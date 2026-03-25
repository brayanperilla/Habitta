import { supabase } from "@infrastructure/supabase/client";

/**
 * Servicio para registrar acciones en el historial de Auditoría.
 */
export const auditService = {
  /**
   * Inserta un nuevo registro de auditoría utilizando el RPC seguro para bypass de RLS.
   * 
   * @param tipo - Ej: 'creacion', 'modificacion', 'suspension', 'aprobacion'
   * @param entidad - Ej: 'propiedad', 'usuario', 'pago'
   * @param identidad - ID numérico de la entidad afectada
   * @param detalle - Descripción humana de la acción
   * @param idusuario - ID del usuario que realizó la acción
   */
  logAction: async (
    tipo: string,
    entidad: string,
    identidad: number,
    detalle: string,
    idusuario: number
  ): Promise<void> => {
    try {
      const { error } = await supabase.rpc("insert_auditoria", {
        p_tipo: tipo,
        p_entidad: entidad,
        p_identidad: identidad,
        p_detalle: detalle,
        p_idusuario: idusuario,
      });

      if (error) {
        console.error("Error al registrar auditoría:", error.message);
      }
    } catch (err) {
      console.error("Excepción en auditService.logAction:", err);
    }
  },
};

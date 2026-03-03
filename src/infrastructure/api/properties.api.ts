import { supabase } from "@infrastructure/supabase/client";
import type {
  Property,
  CreatePropertyInput,
  UpdatePropertyInput,
} from "@domain/entities/Property";

/** API de propiedades — CRUD contra tabla `propiedades` */
export const propertyApi = {
  /** Todas las propiedades, ordenadas por fecha (recientes primero) */
  getAll: async (): Promise<Property[]> => {
    const { data, error } = await supabase
      .from("propiedades")
      .select(`*, fotospropiedad(url, orden)`)
      .order("fechacreacion", { ascending: false });

    if (error) throw new Error(error.message);

    // Mapear: sacar la primera foto de cada propiedad
    return (data ?? []).map((p: Record<string, unknown>) => {
      const fotos =
        (p.fotospropiedad as { url: string; orden: number }[]) || [];
      const primeraFoto = fotos.sort(
        (a, b) => (a.orden ?? 99) - (b.orden ?? 99),
      )[0];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { fotospropiedad: _fotos, ...rest } = p;
      return { ...rest, fotoUrl: primeraFoto?.url ?? null } as Property;
    });
  },

  /** Una propiedad por ID */
  getById: async (id: number): Promise<Property | null> => {
    const { data, error } = await supabase
      .from("propiedades")
      .select("*")
      .eq("idpropiedad", id)
      .single();

    if (error) return null;
    return data;
  },

  /** Propiedades de un usuario específico */
  getByUsuario: async (idusuario: number): Promise<Property[]> => {
    const { data, error } = await supabase
      .from("propiedades")
      .select(`*, fotospropiedad(url, orden)`)
      .eq("idusuario", idusuario)
      .order("fechacreacion", { ascending: false });

    if (error) throw new Error(error.message);

    return (data ?? []).map((p: Record<string, unknown>) => {
      const fotos =
        (p.fotospropiedad as { url: string; orden: number }[]) || [];
      const primeraFoto = fotos.sort(
        (a, b) => (a.orden ?? 99) - (b.orden ?? 99),
      )[0];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { fotospropiedad: _fotos, ...rest } = p;
      return { ...rest, fotoUrl: primeraFoto?.url ?? null } as Property;
    });
  },

  /** Crear propiedad (estadoPublicacion y fechacreacion son auto-generados) */
  create: async (property: CreatePropertyInput): Promise<Property> => {
    const { data, error } = await supabase
      .from("propiedades")
      .insert(property)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /** Actualizar campos de una propiedad */
  update: async (
    id: number,
    updates: UpdatePropertyInput,
  ): Promise<Property> => {
    const { data, error } = await supabase
      .from("propiedades")
      .update(updates)
      .eq("idpropiedad", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /** Eliminar propiedad */
  delete: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from("propiedades")
      .delete()
      .eq("idpropiedad", id);

    if (error) throw new Error(error.message);
  },
};

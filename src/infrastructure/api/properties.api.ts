import { supabase } from "@infrastructure/supabase/client";
import type {
  Property,
  CreatePropertyInput,
  UpdatePropertyInput,
} from "@domain/entities/Property";

export interface PropertyFilters {
  searchTerm?: string;
  tipoPropiedad?: string;
  precioMin?: number;
  precioMax?: number;
  areaMin?: number;
  areaMax?: number;
  habitaciones?: number;
  habitacionesExacta?: boolean; // false = 'o mas'
  banos?: number;
  banosExacta?: boolean;
  estrato?: number;
  /** IDs de características que debe tener la propiedad (AND lógico) */
  caracteristicas?: number[];
  sortBy?: "Relevancia" | "Mayor a menor precio" | "Menor a mayor precio";
}

/** API de propiedades — CRUD contra tabla `propiedades` */
export const propertyApi = {
  /** Todas las propiedades, ordenadas por fecha (recientes primero) */
  getAll: async (): Promise<Property[]> => {
    const { data, error } = await supabase
      .from("propiedades")
      .select(`*, fotospropiedad(url, orden)`)
      .ilike("estadoPublicacion", "activa")
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

  /** Todas las propiedades aplicando filtros dinámicos */
  getFiltered: async (filters: PropertyFilters): Promise<Property[]> => {
    let query = supabase
      .from("propiedades")
      .select(`*, fotospropiedad(url, orden)`);

    // Solo mostrar propiedades activas (ignorando mayúsculas/minúsculas)
    query = query.ilike("estadoPublicacion", "activa");

    if (filters.searchTerm) {
      // Supabase text search
      const term = `%${filters.searchTerm}%`;
      query = query.or(`titulo.ilike.${term},descripcion.ilike.${term},direccion.ilike.${term},ciudad.ilike.${term},departamento.ilike.${term},barrio.ilike.${term}`);
    }

    if (filters.tipoPropiedad) {
      // Usaremos comillas dobles enviando las strings literal a PostgREST para forzar el Case Sensitivity de la DB
      query = query.eq('"tipoPropiedad"', filters.tipoPropiedad);
    }
    
    if (filters.precioMin !== undefined) query = query.gte("precio", filters.precioMin);
    if (filters.precioMax !== undefined) query = query.lte("precio", filters.precioMax);
    if (filters.areaMin !== undefined) query = query.gte("area", filters.areaMin);
    if (filters.areaMax !== undefined) query = query.lte("area", filters.areaMax);
    
    if (filters.habitaciones !== undefined) {
      if (filters.habitacionesExacta) {
        query = query.eq("habitaciones", filters.habitaciones);
      } else {
        query = query.gte("habitaciones", filters.habitaciones);
      }
    }

    if (filters.banos !== undefined) {
      if (filters.banosExacta) {
        query = query.eq("banos", filters.banos);
      } else {
        query = query.gte("banos", filters.banos);
      }
    }

    if (filters.estrato !== undefined) {
      query = query.eq("estrato", filters.estrato);
    }

    // Ordenamiento por relevancia (por defecto) en BD
    // Los ordenamientos por precio los haremos post-fetch para castear correctamente a Número.
    query = query.order("fechacreacion", { ascending: false });

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    let formattedData = (data ?? []).map((p: Record<string, unknown>) => {
      const fotos = (p.fotospropiedad as { url: string; orden: number }[]) || [];
      const primeraFoto = fotos.sort((a, b) => (a.orden ?? 99) - (b.orden ?? 99))[0];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { fotospropiedad: _fotos, ...rest } = p;
      return { ...rest, fotoUrl: primeraFoto?.url ?? null } as Property;
    });

    // Filtro post-fetch por características (AND lógico)
    if (filters.caracteristicas && filters.caracteristicas.length > 0) {
      const { data: charData } = await supabase
        .from("propiedad_caracteristicas")
        .select("idpropiedad, idcaracteristica")
        .in("idcaracteristica", filters.caracteristicas);

      // Agrupar por propiedad: solo conservar las que tienen TODAS las caracteristicas seleccionadas
      const charMap: Record<number, Set<number>> = {};
      for (const row of charData ?? []) {
        if (!charMap[row.idpropiedad]) charMap[row.idpropiedad] = new Set();
        charMap[row.idpropiedad].add(row.idcaracteristica);
      }
      formattedData = formattedData.filter(p => {
        if (!p.idpropiedad) return false;
        const set = charMap[p.idpropiedad as number];
        return filters.caracteristicas!.every(id => set?.has(id));
      });
    }

    // Ordenamiento post-fetch para asegurar cast Numérico real
    if (filters.sortBy === "Mayor a menor precio") {
      formattedData = formattedData.sort((a, b) => Number(b.precio || 0) - Number(a.precio || 0));
    } else if (filters.sortBy === "Menor a mayor precio") {
      formattedData = formattedData.sort((a, b) => Number(a.precio || 0) - Number(b.precio || 0));
    }

    return formattedData;
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

  /** Crear propiedad — se publica como «activa» automáticamente (RF22) */
  create: async (property: CreatePropertyInput): Promise<Property> => {
    const { data, error } = await supabase
      .from("propiedades")
      .insert({ ...property, estadoPublicacion: "activa" })
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

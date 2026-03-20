import { supabase } from "@infrastructure/supabase/client";
import type {
  Property,
  CreatePropertyInput,
  UpdatePropertyInput,
} from "@domain/entities/Property";

/* Maps a raw Supabase row (with joined fotospropiedad) to a Property with fotoUrl */
function mapPropertyWithPhoto(row: Record<string, unknown>): Property {
  // RF17 — Extraer fotos de la galería
  const fotos = (row.fotospropiedad as { url: string; orden: number }[]) || [];
  const firstPhotoFromGallery = fotos.sort((a, b) => (a.orden ?? 99) - (b.orden ?? 99))[0];
  
  // Extraer el resto de campos (incluyendo el fotoUrl original de la tabla propiedades)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { fotospropiedad: _fotos, propiedadcaracteristica: _pc, ...rest } = row;
  
  // SOLUCIÓN: Usar la primera foto de la galería, pero si está vacía, RESPETAR el fotoUrl que ya tenga la propiedad
  const finalFotoUrl = firstPhotoFromGallery?.url || (rest.fotoUrl as string) || null;

  // Extraer el plan del dueño si viene en la query (usuarios.plan)
  const usuariosRaw = row.usuarios;
  let ownerPlan: "gratuito" | "premium" | undefined;
  let telefonoContacto: string | null = null;
  
  if (Array.isArray(usuariosRaw)) {
    ownerPlan = usuariosRaw[0]?.plan;
    telefonoContacto = usuariosRaw[0]?.telefono || null;
  } else if (usuariosRaw && typeof usuariosRaw === 'object') {
    ownerPlan = (usuariosRaw as any).plan;
    telefonoContacto = (usuariosRaw as any).telefono || null;
  }

  // Extraer nombres de características (si existen)
  const caracteristicasRaw = (row.propiedadcaracteristica as any[]) || [];
  const caracteristicasNombres = caracteristicasRaw
    .map(c => c.caracteristica?.nombre)
    .filter(Boolean)
    .slice(0, 2);
  
  return { 
    ...rest, 
    fotoUrl: finalFotoUrl,
    ownerPlan: ownerPlan,
    telefonoContacto,
    caracteristicasNombres
  } as Property;
}

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
  tipoOperacion?: string;
  sortBy?: "Relevancia" | "Mayor a menor precio" | "Menor a mayor precio";
}

/** API de propiedades — CRUD contra tabla `propiedades` */
export const propertyApi = {
  /** Todas las propiedades, ordenadas por fecha (recientes primero) */
  getAll: async (): Promise<Property[]> => {
    const { data, error } = await supabase
      .from("propiedades")
      .select(`*, fotospropiedad(url, orden), usuarios!inner(estadocuenta, plan, telefono), propiedadcaracteristica(caracteristica(nombre))`)
      .in("estadoPublicacion", ["activa", "destacada"])
      .eq("usuarios.estadocuenta", "Activa")
      .order("fechacreacion", { ascending: false });

    if (error) throw new Error(error.message);
    const formatted = (data ?? []).map(mapPropertyWithPhoto);
    
    // Ordenamiento final: Destacadas primero
    return formatted.sort((a, b) => {
      const aFeatured = a.estadoPublicacion === "destacada" ? 1 : 0;
      const bFeatured = b.estadoPublicacion === "destacada" ? 1 : 0;
      return bFeatured - aFeatured;
    });
  },

  /** Todas las propiedades aplicando filtros dinámicos */
  getFiltered: async (filters: PropertyFilters): Promise<Property[]> => {
    let query = supabase
      .from("propiedades")
      .select(`*, fotospropiedad(url, orden), usuarios!inner(estadocuenta, plan, telefono), propiedadcaracteristica(caracteristica(nombre))`);

    // Solo mostrar propiedades activas o destacadas publicadas por usuarios con cuenta Activa
    query = query.in("estadoPublicacion", ["activa", "destacada"]).eq("usuarios.estadocuenta", "Activa");

    if (filters.searchTerm) {
      // Supabase text search
      const term = `%${filters.searchTerm}%`;
      query = query.or(`titulo.ilike.${term},descripcion.ilike.${term},direccion.ilike.${term},ciudad.ilike.${term},departamento.ilike.${term},barrio.ilike.${term}`);
    }

    if (filters.tipoPropiedad) {
      // Usamos ilike enviando las strings literal a PostgREST para forzar case insensitivity en la DB
      query = query.ilike('"tipoPropiedad"', filters.tipoPropiedad);
    }

    if (filters.tipoOperacion) {
      query = query.eq('"tipoOperacion"', filters.tipoOperacion);
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

    let formattedData = (data ?? []).map(mapPropertyWithPhoto);

    // Filtro post-fetch por características (AND lógico)
    if (filters.caracteristicas && filters.caracteristicas.length > 0) {
      const { data: charData } = await supabase
        .from("propiedadcaracteristica")
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

    // Ordenamiento final definitivo: ¡Las propiedades destacadas siempre deben ir primero!
    formattedData = formattedData.sort((a, b) => {
      const aFeatured = a.estadoPublicacion === "destacada" ? 1 : 0;
      const bFeatured = b.estadoPublicacion === "destacada" ? 1 : 0;
      return bFeatured - aFeatured; // Si b es destacada(1) y a no(0), b va primero (resultado > 0)
    });

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
      .select(`*, fotospropiedad(url, orden), usuarios(plan, telefono), propiedadcaracteristica(caracteristica(nombre))`)
      .eq("idusuario", idusuario)
      .order("fechacreacion", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map(mapPropertyWithPhoto);
  },

  /** Contar propiedades activas o en revisión de un usuario (para límites) */
  countActivasByUsuario: async (idusuario: number): Promise<number> => {
    const { count, error } = await supabase
      .from("propiedades")
      .select("*", { count: "exact", head: true })
      .eq("idusuario", idusuario)
      .in("estadoPublicacion", ["activa", "destacada", "pending_manual"]);

    if (error) throw new Error(error.message);
    return count ?? 0;
  },

  /** Obtener propiedades en revisión (pending_manual) para administradores */
  getPendingProperties: async (): Promise<Property[]> => {
    const { data, error } = await supabase
      .from("propiedades")
      .select(`*, fotospropiedad(url, orden)`)
      .eq("estadoPublicacion", "pending_manual")
      .order("fechacreacion", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map(mapPropertyWithPhoto);
  },

  /** Crear propiedad — pasa a revisión (RF22 modificado) */
  create: async (property: CreatePropertyInput, isFeatured: boolean = false): Promise<Property> => {
    const estado = isFeatured ? "destacada" : "pending_manual";
    const { data, error } = await supabase
      .from("propiedades")
      .insert({ ...property, estadoPublicacion: estado })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /** Actualizar campos de una propiedad */
  update: async (
    id: number,
    updates: UpdatePropertyInput,
    isFeatured?: boolean
  ): Promise<Property> => {
    const finalUpdates = { ...updates };
    if (isFeatured !== undefined) {
      finalUpdates.estadoPublicacion = isFeatured ? "destacada" : "activa";
    }

    const { data, error } = await supabase
      .from("propiedades")
      .update(finalUpdates)
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

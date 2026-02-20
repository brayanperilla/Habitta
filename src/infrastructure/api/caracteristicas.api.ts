import { supabase } from "@infrastructure/supabase/client";
import type { Caracteristica } from "@domain/entities/Caracteristica";

/** API de características — tablas `caracteristica` y `propiedadcaracteristica` */
export const caracteristicasApi = {
  /** Todas las características disponibles (para checkboxes del formulario) */
  getAll: async (): Promise<Caracteristica[]> => {
    const { data, error } = await supabase
      .from("caracteristica")
      .select("*")
      .order("idcaracteristica", { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
  },

  /** Guardar características seleccionadas para una propiedad (batch insert) */
  guardarCaracteristicasPropiedad: async (
    idpropiedad: number,
    idsCaracteristicas: number[],
  ): Promise<void> => {
    if (idsCaracteristicas.length === 0) return;

    const relaciones = idsCaracteristicas.map((idcaracteristica) => ({
      idpropiedad,
      idcaracteristica,
    }));

    const { error } = await supabase
      .from("propiedadcaracteristica")
      .insert(relaciones);

    if (error) throw new Error(error.message);
  },

  /** Características de una propiedad (join con tabla `caracteristica`) */
  getByPropiedad: async (idpropiedad: number): Promise<Caracteristica[]> => {
    const { data, error } = await supabase
      .from("propiedadcaracteristica")
      .select(
        "caracteristica:idcaracteristica(idcaracteristica, nombre, descripcion)",
      )
      .eq("idpropiedad", idpropiedad);

    if (error) throw new Error(error.message);
    return (data ?? []).map(
      (row: Record<string, unknown>) => row.caracteristica as Caracteristica,
    );
  },
};

import type {
  Property,
  CreatePropertyInput,
  UpdatePropertyInput,
} from "@domain/entities/Property";
import type { Caracteristica } from "@domain/entities/Caracteristica";
import { LIMITE_FOTOS } from "@domain/entities/FotoPropiedad";
import { propertyApi } from "@infrastructure/api/properties.api";
import { caracteristicasApi } from "@infrastructure/api/caracteristicas.api";
import { storageApi } from "@infrastructure/api/storage.api";
import { supabase } from "@infrastructure/supabase/client";

/** Servicio de propiedades — lógica de negocio y validaciones */
export const propertyService = {
  /** Obtener todas las propiedades */
  getProperties: async (): Promise<Property[]> => {
    return await propertyApi.getAll();
  },

  /** Obtener propiedad por ID */
  getPropertyById: async (id: number): Promise<Property | null> => {
    return await propertyApi.getById(id);
  },

  /** Obtener URLs de fotos de una propiedad (ordenadas por `orden`) */
  getFotosPropiedad: async (idpropiedad: number): Promise<string[]> => {
    const { data, error } = await supabase
      .from("fotospropiedad")
      .select("url, orden")
      .eq("idpropiedad", idpropiedad)
      .order("orden", { ascending: true });

    if (error) return [];
    return (data ?? []).map((f: { url: string }) => f.url);
  },

  /** Obtener propiedades de un usuario */
  getPropertiesByUsuario: async (idusuario: number): Promise<Property[]> => {
    return await propertyApi.getByUsuario(idusuario);
  },

  /**
   * Crear propiedad CON características e imágenes.
   * Valida campos obligatorios → inserta propiedad → inserta relaciones → sube imágenes.
   */
  createPropertyConCaracteristicas: async (
    property: CreatePropertyInput,
    idsCaracteristicas: number[],
    imagenes: File[] = [],
  ): Promise<Property> => {
    if (!property.titulo?.trim()) throw new Error("El título es obligatorio.");
    if (!property.direccion?.trim())
      throw new Error("La dirección es obligatoria.");
    if (!property.ciudad?.trim()) throw new Error("La ciudad es obligatoria.");
    if (!property.departamento?.trim())
      throw new Error("El departamento es obligatorio.");
    if (!property.tipoOperacion)
      throw new Error("El tipo de operación es obligatorio.");

    const nueva = await propertyApi.create(property);

    if (idsCaracteristicas.length > 0) {
      await caracteristicasApi.guardarCaracteristicasPropiedad(
        nueva.idpropiedad,
        idsCaracteristicas,
      );
    }

    // Subir imágenes si las hay
    if (imagenes.length > 0) {
      await propertyService.uploadPropertyImages(nueva.idpropiedad, imagenes);
    }

    return nueva;
  },

  /**
   * Subir imágenes de una propiedad.
   * Sube a Storage → inserta URLs en tabla `fotospropiedad`.
   * Límite: LIMITE_FOTOS.free (7) — cambiar a premium cuando se implemente.
   */
  uploadPropertyImages: async (
    idpropiedad: number,
    files: File[],
  ): Promise<void> => {
    const limite = LIMITE_FOTOS.free; // TODO: usar premium si el usuario lo es
    const archivos = files.slice(0, limite);

    for (let i = 0; i < archivos.length; i++) {
      const file = archivos[i];
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${idpropiedad}/${Date.now()}_${i}.${ext}`;

      const url = await storageApi.upload(path, file);

      const { error } = await supabase.from("fotospropiedad").insert({
        idpropiedad,
        url,
        orden: i + 1,
      });

      if (error) {
        console.error("Error guardando foto en BD:", error);
        throw new Error(`Error guardando foto en BD: ${error.message}`);
      }
    }
  },

  /** Crear propiedad sin características */
  createProperty: async (property: CreatePropertyInput): Promise<Property> => {
    if (!property.titulo?.trim()) throw new Error("El título es obligatorio.");
    return await propertyApi.create(property);
  },

  /** Actualizar propiedad */
  updateProperty: async (
    id: number,
    updates: UpdatePropertyInput,
  ): Promise<Property> => {
    return await propertyApi.update(id, updates);
  },

  /** Eliminar propiedad */
  deleteProperty: async (id: number): Promise<void> => {
    return await propertyApi.delete(id);
  },

  /** Obtener todas las características disponibles */
  getCaracteristicas: async (): Promise<Caracteristica[]> => {
    return await caracteristicasApi.getAll();
  },

  /** Obtener características de una propiedad */
  getCaracteristicasDePropiedad: async (
    idpropiedad: number,
  ): Promise<Caracteristica[]> => {
    return await caracteristicasApi.getByPropiedad(idpropiedad);
  },
};

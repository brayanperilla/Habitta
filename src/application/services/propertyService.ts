import type {
  Property,
  CreatePropertyInput,
  UpdatePropertyInput,
} from "@domain/entities/Property";
import type { Caracteristica } from "@domain/entities/Caracteristica";
import { PHOTO_LIMIT } from "@domain/entities/FotoPropiedad";
import { propertyApi } from "@infrastructure/api/properties.api";
import type { PropertyFilters } from "@infrastructure/api/properties.api";
import { caracteristicasApi } from "@infrastructure/api/caracteristicas.api";
import { storageApi } from "@infrastructure/api/storage.api";
import { supabase } from "@infrastructure/supabase/client";
import { compressImage } from "@application/utils/imageUtils";

/** Servicio de propiedades — lógica de negocio y validaciones */
export const propertyService = {
  /** Obtener todas las propiedades */
  getProperties: async (): Promise<Property[]> => {
    return await propertyApi.getAll();
  },

  /** Obtener propiedades con filtros dinámicos */
  getFilteredProperties: async (filters: PropertyFilters): Promise<Property[]> => {
    return await propertyApi.getFiltered(filters);
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
    plan: "gratuito" | "premium" = "gratuito",
    isFeatured: boolean = false,
  ): Promise<Property> => {
    if (!property.titulo?.trim()) throw new Error("El título es obligatorio.");
    if (!property.direccion?.trim())
      throw new Error("La dirección es obligatoria.");
    if (!property.ciudad?.trim()) throw new Error("La ciudad es obligatoria.");
    if (!property.departamento?.trim())
      throw new Error("El departamento es obligatorio.");
    if (!property.tipoOperacion)
      throw new Error("El tipo de operación es obligatorio.");
    if (property.precio === undefined || property.precio === null || property.precio <= 0)
      throw new Error("El precio debe ser un valor válido y mayor a 0.");
    if (property.area === undefined || property.area === null || property.area <= 0)
      throw new Error("El área debe ser un valor válido y mayor a 0.");

    const nueva = await propertyApi.create(property, isFeatured);

    if (idsCaracteristicas.length > 0) {
      await caracteristicasApi.guardarCaracteristicasPropiedad(
        nueva.idpropiedad,
        idsCaracteristicas,
      );
    }

    // Subir imágenes si las hay
    if (imagenes.length > 0) {
      await propertyService.uploadPropertyImages(
        nueva.idpropiedad,
        imagenes,
        plan,
      );
    }

    return nueva;
  },

  /**
   * Subir imágenes de una propiedad.
   * Sube a Storage → inserta URLs en tabla `fotospropiedad`.
   * Límite según plan: free = 7, premium = 15.
   */
  uploadPropertyImages: async (
    idpropiedad: number,
    files: File[],
    plan: "gratuito" | "premium" = "gratuito",
  ): Promise<void> => {
    const limite =
      plan === "premium" ? PHOTO_LIMIT.premium : PHOTO_LIMIT.free;
    const archivos = files.slice(0, limite);

    for (let i = 0; i < archivos.length; i++) {
      // RF17 — Comprimir imagen antes de subir
      const compressed = await compressImage(archivos[i]);
      const ext = compressed.name.split(".").pop() || "webp";
      const path = `${idpropiedad}/${Date.now()}_${i}.${ext}`;

      const url = await storageApi.upload(path, compressed);

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

  /** Subir videos de una propiedad a Storage + BD (tabla fotospropiedad) */
  uploadPropertyVideos: async (
    idpropiedad: number,
    files: File[],
    startOrder: number = 100,
  ): Promise<void> => {
    for (let i = 0; i < files.length; i++) {
      const ext = files[i].name.split(".").pop() || "mp4";
      const path = `${idpropiedad}/video/${Date.now()}_${i}.${ext}`;

      const url = await storageApi.upload(path, files[i]);

      const { error } = await supabase.from("fotospropiedad").insert({
        idpropiedad,
        url,
        orden: startOrder + i,
      });

      if (error) {
        console.error("Error guardando video en BD:", error);
        throw new Error(`Error guardando video en BD: ${error.message}`);
      }
    }
  },


  /** Actualizar propiedad */
  updateProperty: async (
    id: number,
    updates: UpdatePropertyInput,
    isFeatured?: boolean,
  ): Promise<Property> => {
    return await propertyApi.update(id, updates, isFeatured);
  },

  /** Eliminar propiedad (con dependencias: fotos y características) */
  deleteProperty: async (id: number): Promise<void> => {
    // 1. Eliminar fotos de la propiedad
    await supabase.from("fotospropiedad").delete().eq("idpropiedad", id);
    // 2. Eliminar características asociadas
    await supabase
      .from("propiedadcaracteristica")
      .delete()
      .eq("idpropiedad", id);
    // 3. Eliminar favoritos (Para evitar error de FK)
    await supabase.from("favoritos").delete().eq("idpropiedad", id);
    // 4. Eliminar la propiedad en sí
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

  /**
   * RF27 — Duplicar una propiedad existente.
   * Copia todos los datos + características, sin imágenes.
   * El título lleva "(Copia)" al final.
   */
  duplicateProperty: async (id: number): Promise<Property> => {
    const original = await propertyApi.getById(id);
    if (!original) throw new Error("No se encontró la propiedad original.");

    // Clonar datos sin campos auto-generados
    const clon: CreatePropertyInput = {
      idusuario: original.idusuario,
      titulo: (original.titulo || "Sin título") + " (Copia)",
      descripcion: original.descripcion,
      tipoPropiedad: original.tipoPropiedad,
      precio: original.precio,
      area: original.area,
      antiguedad: original.antiguedad,
      tipoOperacion: original.tipoOperacion,
      direccion: original.direccion,
      ciudad: original.ciudad,
      departamento: original.departamento,
      barrio: original.barrio,
      codigopostal: original.codigopostal,
      habitaciones: original.habitaciones,
      banos: original.banos,
      estrato: original.estrato,
    };

    const nueva = await propertyApi.create(clon);

    // Copiar características
    const chars = await caracteristicasApi.getByPropiedad(id);
    if (chars.length > 0) {
      await caracteristicasApi.guardarCaracteristicasPropiedad(
        nueva.idpropiedad,
        chars.map((c) => c.idcaracteristica),
      );
    }

    return nueva;
  },
};

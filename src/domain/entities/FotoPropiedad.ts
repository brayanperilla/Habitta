/** FotoPropiedad — tabla `fotospropiedad` en Supabase */
export interface FotoPropiedad {
  idfoto: number;
  idpropiedad: number;
  url: string;
  orden: number | null;
  fechasubida: string | null;
}

/** Crear foto — sin campo auto-generado */
export type CreateFotoInput = Omit<FotoPropiedad, "idfoto" | "fechasubida">;

/** Límite de fotos por tipo de cuenta */
export const LIMITE_FOTOS = {
  free: 7,
  premium: 15,
} as const;

/** Límite de videos por tipo de cuenta */
export const LIMITE_VIDEOS = {
  free: 1,
  premium: 3,
} as const;

/** Tipos MIME de video permitidos */
export const TIPOS_VIDEO = ["video/mp4"] as const;

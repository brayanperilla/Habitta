/** Propiedad — tabla `propiedades` en Supabase */
export interface Property {
  idpropiedad: number;
  idusuario: number;
  titulo: string | null;
  descripcion: string | null;
  tipoPropiedad: string | null;
  precio: number | null;
  area: number | null;
  antiguedad: string | null;
  estadoPublicacion: string | null;
  fechacreacion: string | null;
  tipoOperacion: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  barrio: string | null;
  codigopostal: string | null;
  habitaciones: number;
  banos: number;
  estrato: number;
  /** URL de la primera foto (viene de fotospropiedad, no de la tabla propiedades) */
  fotoUrl?: string | null;
}

/** Crear propiedad — sin campos auto-generados */
export type CreatePropertyInput = Omit<
  Property,
  "idpropiedad" | "estadoPublicacion" | "fechacreacion"
>;

/** Actualizar propiedad — todos los campos opcionales */
export type UpdatePropertyInput = Partial<
  Omit<Property, "idpropiedad" | "estadoPublicacion" | "fechacreacion">
>;

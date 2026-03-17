/** Usuario — tabla `usuarios` en Supabase */
export interface Usuario {
  idusuario: number;
  correo: string;
  telefono: string | null;
  contrasena: string;
  nombre: string;
  fotoperfil: string | null;
  descripcion: string | null;
  estadocuenta: string | null;
  ultimaactividad: string | null;
  fechalogin: string | null;
  plan: "gratuito" | "premium";
  rol?: string | null;
}

/** Crear usuario — sin campos auto-generados */
export type CreateUsuarioInput = Omit<
  Usuario,
  | "idusuario"
  | "estadocuenta"
  | "ultimaactividad"
  | "fechalogin"
  | "plan"
  | "rol"
>;

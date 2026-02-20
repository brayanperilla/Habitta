import { supabase } from "@infrastructure/supabase/client";

const BUCKET = "fotoPropiedades";

/** API de Storage — subir/eliminar archivos en Supabase Storage */
export const storageApi = {
  /** Subir imagen al bucket. Retorna la URL pública. */
  upload: async (path: string, file: File): Promise<string> => {
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: false });

    if (error) throw new Error(`Error subiendo imagen: ${error.message}`);

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  },

  /** Eliminar imagen del bucket */
  delete: async (path: string): Promise<void> => {
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) throw new Error(`Error eliminando imagen: ${error.message}`);
  },
};

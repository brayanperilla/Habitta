import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@application/context/AuthContext";
import { propertyService } from "@application/services/propertyService";
import type { CreatePropertyInput } from "@domain/entities/Property";
import type { Caracteristica } from "@domain/entities/Caracteristica";
import { LIMITE_FOTOS } from "@domain/entities/FotoPropiedad";

/** Estado del formulario */
interface FormState {
  titulo: string;
  descripcion: string;
  tipoPropiedad: string;
  tipoOperacion: string;
  precio: string;
  area: string;
  antiguedad: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  barrio: string;
  codigopostal: string;
  habitaciones: string;
  banos: string;
  estrato: string;
}

const INITIAL_FORM: FormState = {
  titulo: "",
  descripcion: "",
  tipoPropiedad: "",
  tipoOperacion: "",
  precio: "",
  area: "",
  antiguedad: "",
  direccion: "",
  ciudad: "",
  departamento: "",
  barrio: "",
  codigopostal: "",
  habitaciones: "",
  banos: "",
  estrato: "",
};

/**
 * Hook del formulario de registro/edición de propiedades.
 * @param editId — si se provee, carga la propiedad existente para edición
 */
export function usePropertyForm(editId?: number) {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [caracteristicasDisponibles, setCaracteristicasDisponibles] = useState<
    Caracteristica[]
  >([]);
  const [caracteristicasSeleccionadas, setCaracteristicasSeleccionadas] =
    useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cargandoCaracteristicas, setCargandoCaracteristicas] = useState(true);
  const [errorCaracteristicas, setErrorCaracteristicas] = useState<
    string | null
  >(null);

  // Estado de imágenes
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const maxFotos =
    usuario?.plan === "premium" ? LIMITE_FOTOS.premium : LIMITE_FOTOS.free;

  // Modo edición
  const isEditMode = Boolean(editId);
  const [loadingEdit, setLoadingEdit] = useState(isEditMode);

  // Cargar características al montar
  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await propertyService.getCaracteristicas();
        setCaracteristicasDisponibles(data);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error desconocido";
        console.error("Error cargando características:", msg);
        setErrorCaracteristicas(msg);
      } finally {
        setCargandoCaracteristicas(false);
      }
    };
    cargar();
  }, []);

  // Cargar datos de propiedad existente para edición
  useEffect(() => {
    if (!editId) return;
    const cargarPropiedad = async () => {
      try {
        const propiedad = await propertyService.getPropertyById(editId);
        if (!propiedad) {
          setError("La propiedad no existe o fue eliminada.");
          setLoadingEdit(false);
          return;
        }

        // Verificar que el usuario sea el dueño
        if (usuario && propiedad.idusuario !== usuario.idusuario) {
          setError("No tienes permisos para editar esta propiedad.");
          setLoadingEdit(false);
          return;
        }

        // Rellenar formulario con datos existentes
        setForm({
          titulo: propiedad.titulo || "",
          descripcion: propiedad.descripcion || "",
          tipoPropiedad: propiedad.tipoPropiedad || "",
          tipoOperacion: propiedad.tipoOperacion || "",
          precio: propiedad.precio ? String(propiedad.precio) : "",
          area: propiedad.area ? String(propiedad.area) : "",
          antiguedad: propiedad.antiguedad || "",
          direccion: propiedad.direccion || "",
          ciudad: propiedad.ciudad || "",
          departamento: propiedad.departamento || "",
          barrio: propiedad.barrio || "",
          codigopostal: propiedad.codigopostal || "",
          habitaciones: propiedad.habitaciones
            ? String(propiedad.habitaciones)
            : "",
          banos: propiedad.banos ? String(propiedad.banos) : "",
          estrato: propiedad.estrato ? String(propiedad.estrato) : "",
        });

        // Cargar características seleccionadas
        try {
          const chars =
            await propertyService.getCaracteristicasDePropiedad(editId);
          setCaracteristicasSeleccionadas(chars.map((c) => c.idcaracteristica));
        } catch {
          /* silencioso — no bloquea la edición */
        }

        // Cargar fotos existentes como previews (solo URLs, no Files)
        try {
          const fotos = await propertyService.getFotosPropiedad(editId);
          setPreviews(fotos);
        } catch {
          /* silencioso */
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar la propiedad.",
        );
      } finally {
        setLoadingEdit(false);
      }
    };
    cargarPropiedad();
  }, [editId, usuario]);

  /** Actualizar campo del formulario */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /** Alternar característica */
  const toggleCaracteristica = (id: number) => {
    setCaracteristicasSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  /** Manejar selección de imágenes */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validar tipos permitidos
    const tiposValidos = ["image/jpeg", "image/png", "image/webp"];
    const invalidos = files.filter((f) => !tiposValidos.includes(f.type));
    if (invalidos.length > 0) {
      setError("Solo se permiten imágenes JPG, PNG o WebP.");
      return;
    }

    // Validar tamaño (5MB máx por archivo)
    const grandes = files.filter((f) => f.size > 5 * 1024 * 1024);
    if (grandes.length > 0) {
      setError("Cada imagen debe pesar menos de 5MB.");
      return;
    }

    // Validar límite total
    const total = imagenes.length + previews.length + files.length;
    if (total > maxFotos) {
      setError(
        `Máximo ${maxFotos} fotos. Ya tienes ${imagenes.length + previews.length}.`,
      );
      return;
    }

    setError(null);
    const nuevas = [...imagenes, ...files];
    setImagenes(nuevas);

    // Generar previews
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...urls]);

    // Resetear input para permitir seleccionar las mismas fotos
    e.target.value = "";
  };

  /** Eliminar imagen por índice */
  const removeImage = (index: number) => {
    // Solo revocar blob URLs (no URLs de Supabase)
    if (previews[index]?.startsWith("blob:")) {
      URL.revokeObjectURL(previews[index]);
      // Encontrar el índice correspondiente en imagenes (archivos nuevos)
      const blobPreviews = previews.filter((p) => p.startsWith("blob:"));
      const blobIndex = blobPreviews.indexOf(previews[index]);
      if (blobIndex >= 0) {
        setImagenes((prev) => prev.filter((_, i) => i !== blobIndex));
      }
    }
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  /** RF19 — Reordenar previews (y archivos) tras drag-and-drop */
  const reorderPreviews = (newOrder: string[]) => {
    // Reordenar los archivos nuevos para que coincidan con el nuevo orden
    const blobIndexes = previews
      .map((url, i) => (url.startsWith("blob:") ? i : -1))
      .filter((i) => i >= 0);

    const newBlobOrder = newOrder
      .map((url, _i) => previews.indexOf(url))
      .filter((origIdx) => previews[origIdx]?.startsWith("blob:"));

    // Solo reordenar archivos locales si hay correspondencia
    if (newBlobOrder.length === blobIndexes.length && imagenes.length > 0) {
      const reorderedFiles = newBlobOrder.map(
        (origIdx) => imagenes[blobIndexes.indexOf(origIdx)],
      );
      setImagenes(reorderedFiles);
    }

    setPreviews(newOrder);
  };

  /** Validar campos obligatorios */
  const validar = (): string | null => {
    if (!form.titulo.trim()) return "El título es obligatorio.";
    if (!form.tipoOperacion) return "Selecciona un tipo de operación.";
    if (!form.direccion.trim()) return "La dirección es obligatoria.";
    if (!form.ciudad.trim()) return "La ciudad es obligatoria.";
    if (!form.departamento.trim()) return "El departamento es obligatorio.";
    if (!form.habitaciones.trim()) return "Las habitaciones son obligatorias.";
    if (!form.banos.trim()) return "Los baños son obligatorios.";
    if (!form.estrato.trim()) return "El estrato es obligatorio.";
    if (!usuario) return "Debes iniciar sesión para publicar.";
    return null;
  };

  /** Enviar formulario — crear o actualizar propiedad */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const err = validar();
    if (err) {
      setError(err);
      return;
    }

    setSubmitting(true);
    try {
      const input: CreatePropertyInput = {
        idusuario: usuario!.idusuario,
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim() || null,
        tipoPropiedad: form.tipoPropiedad || null,
        tipoOperacion: form.tipoOperacion,
        precio: form.precio ? Number(form.precio) : null,
        area: form.area ? Number(form.area) : null,
        antiguedad: form.antiguedad.trim() || null,
        direccion: form.direccion.trim(),
        ciudad: form.ciudad.trim(),
        departamento: form.departamento.trim(),
        barrio: form.barrio.trim() || null,
        codigopostal: form.codigopostal.trim() || null,
        habitaciones: Number(form.habitaciones),
        banos: Number(form.banos),
        estrato: Number(form.estrato),
      };

      // Timeout de 60s (imágenes pueden tardar en subirse)
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(
          () =>
            reject(new Error("El servidor tardó demasiado. Intenta de nuevo.")),
          60000,
        ),
      );

      let propertyId: number;

      if (isEditMode && editId) {
        // --- MODO EDICIÓN ---
        const updated = await Promise.race([
          propertyService.updateProperty(editId, input),
          timeout,
        ]);
        propertyId = (updated as { idpropiedad: number }).idpropiedad;

        // Subir nuevas imágenes si las hay
        if (imagenes.length > 0) {
          await propertyService.uploadPropertyImages(
            propertyId,
            imagenes,
            usuario?.plan ?? "gratuito",
          );
        }
      } else {
        // --- MODO CREACIÓN ---
        const nueva = (await Promise.race([
          propertyService.createPropertyConCaracteristicas(
            input,
            caracteristicasSeleccionadas,
            imagenes,
            usuario?.plan ?? "gratuito",
          ),
          timeout,
        ])) as Awaited<
          ReturnType<typeof propertyService.createPropertyConCaracteristicas>
        >;
        propertyId = nueva.idpropiedad;
      }

      // Limpiar previews blob
      previews.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });

      setSuccess(true);
      setTimeout(() => navigate(`/propertydetailspage/${propertyId}`), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al publicar.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    handleChange,
    caracteristicasDisponibles,
    caracteristicasSeleccionadas,
    toggleCaracteristica,
    handleSubmit,
    submitting,
    error,
    success,
    cargandoCaracteristicas,
    errorCaracteristicas,
    imagenes,
    previews,
    handleImageChange,
    removeImage,
    reorderPreviews,
    maxFotos,
    isEditMode,
    loadingEdit,
  };
}

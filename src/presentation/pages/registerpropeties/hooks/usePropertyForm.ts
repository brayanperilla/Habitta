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

/** Hook del formulario de registro de propiedades */
export function usePropertyForm() {
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
  const maxFotos = LIMITE_FOTOS.free; // TODO: cambiar a premium cuando se implemente

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
    const total = imagenes.length + files.length;
    if (total > maxFotos) {
      setError(`Máximo ${maxFotos} fotos. Ya tienes ${imagenes.length}.`);
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
    URL.revokeObjectURL(previews[index]);
    setImagenes((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
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

  /** Enviar formulario — crear propiedad en Supabase */
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

      const nueva = (await Promise.race([
        propertyService.createPropertyConCaracteristicas(
          input,
          caracteristicasSeleccionadas,
          imagenes,
        ),
        timeout,
      ])) as Awaited<
        ReturnType<typeof propertyService.createPropertyConCaracteristicas>
      >;

      // Limpiar previews
      previews.forEach((url) => URL.revokeObjectURL(url));

      setSuccess(true);
      setTimeout(
        () => navigate(`/propertydetailspage/${nueva.idpropiedad}`),
        1500,
      );
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
    maxFotos,
  };
}

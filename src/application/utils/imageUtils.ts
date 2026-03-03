/**
 * Utilidades de optimización de imágenes — RF17
 *
 * Comprime y genera miniaturas de imágenes usando Canvas API
 * nativo del navegador. Sin librerías externas.
 */

/** Máximo ancho en px para la imagen principal */
const MAX_WIDTH = 1920;
/** Máximo ancho en px para thumbnails */
const THUMB_SIZE = 400;
/** Calidad de compresión (0–1) */
const QUALITY = 0.8;

/**
 * Carga un File como HTMLImageElement.
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve(img);
    };
    img.onerror = () => reject(new Error("No se pudo cargar la imagen."));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Redimensiona una imagen usando Canvas y la exporta como File comprimido.
 *
 * Pasos:
 * 1. Crea <img> en memoria con createObjectURL
 * 2. Espera a que cargue (img.onload)
 * 3. Calcula nuevo tamaño manteniendo proporción
 * 4. Crea <canvas> invisible del nuevo tamaño
 * 5. Dibuja la imagen escalada en el canvas
 * 6. Exporta como WebP (o JPEG fallback) con calidad configurable
 * 7. Convierte Blob → File
 */
async function resizeAndCompress(
  file: File,
  maxDimension: number,
  quality: number,
): Promise<File> {
  // No comprimir si no es imagen
  if (!file.type.startsWith("image/")) return file;

  const img = await loadImage(file);
  const { width, height } = img;

  // Si la imagen ya es más pequeña que el máximo, solo comprimir sin redimensionar
  let newWidth = width;
  let newHeight = height;

  if (width > maxDimension || height > maxDimension) {
    if (width > height) {
      newWidth = maxDimension;
      newHeight = Math.round((height / width) * maxDimension);
    } else {
      newHeight = maxDimension;
      newWidth = Math.round((width / height) * maxDimension);
    }
  }

  // Crear canvas y dibujar
  const canvas = document.createElement("canvas");
  canvas.width = newWidth;
  canvas.height = newHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) return file;

  ctx.drawImage(img, 0, 0, newWidth, newHeight);

  // Exportar como blob — intentar WebP, fallback a JPEG
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", quality);
  });

  // Si WebP no es soportado, intentar JPEG
  if (!blob || blob.size === 0) {
    const jpegBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", quality);
    });
    if (!jpegBlob) return file;
    const ext = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([jpegBlob], ext, { type: "image/jpeg" });
  }

  // Si la imagen comprimida es MÁS grande que la original, devolver la original
  if (blob.size >= file.size) return file;

  const ext = file.name.replace(/\.[^.]+$/, "") + ".webp";
  return new File([blob], ext, { type: "image/webp" });
}

/**
 * Comprime una imagen para subida principal.
 * Reduce a máximo 1920px de ancho con calidad 0.8.
 *
 * @example
 * const comprimida = await compressImage(archivo);
 * // 5 MB → ~800 KB
 */
export async function compressImage(
  file: File,
  maxWidth = MAX_WIDTH,
  quality = QUALITY,
): Promise<File> {
  return resizeAndCompress(file, maxWidth, quality);
}

/**
 * Genera una miniatura de la imagen.
 * Reduce a 400px de ancho con calidad 0.7 para previews rápidos.
 */
export async function generateThumbnail(
  file: File,
  size = THUMB_SIZE,
): Promise<File> {
  return resizeAndCompress(file, size, 0.7);
}

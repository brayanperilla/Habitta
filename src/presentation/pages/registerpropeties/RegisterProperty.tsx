import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./styleRegisterP.css";
import { usePropertyForm } from "./hooks/usePropertyForm";
import { useWarnIfUnsavedChanges } from "@application/hooks/useWarnIfUnsavedChanges";
import { useToast } from "@application/context/ToastContext";
import SortableImageGrid from "@presentation/components/SortableImageGrid/SortableImageGrid";
import { MapSelector } from "@presentation/components/MapSelector/MapSelector";
import PremiumPromoModal from "@presentation/components/premiumPromoModal/PremiumPromoModal";

// Página de Registro / Edición de Propiedades
function RegisterPropertyPage() {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit")
    ? Number(searchParams.get("edit"))
    : undefined;

  const {
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
    previews,
    handleImageChange,
    removeImage,
    reorderPreviews,
    maxFotos,
    maxVideos,
    imagenes,
    isEditMode,
    loadingEdit,
    setCoordenadas,
    handleToggle,
    usuario,
    // Video
    videoPreviews,
    handleVideoChange,
    removeVideo,
    // Premium Limits
    showLimitModal,
    setShowLimitModal,
    hasReachedFreeLimit = false,
  } = usePropertyForm(editId);

  // Construir videoFlags para SortableImageGrid: indica cuáles URLs son videos
  const videoFlags = previews.map((url: string) => {
    if (url.startsWith("blob:")) {
      const blobPreviews = previews.filter((p: string) => p.startsWith("blob:"));
      const blobIndex = blobPreviews.indexOf(url);
      if (blobIndex >= 0 && imagenes[blobIndex]) {
        return imagenes[blobIndex].type === "video/mp4";
      }
      return false;
    }
    return url.includes(".mp4") || url.includes("video/");
  });

  // Estados visuales para Drag and Drop
  const [isThumbDragging, setIsThumbDragging] = useState(false);
  const [isVideoDragging, setIsVideoDragging] = useState(false);

  // Funciones Drop Imágenes
  const handleThumbDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsThumbDragging(true);
  };
  const handleThumbDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsThumbDragging(false);
  };
  const handleThumbDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsThumbDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Reutiliza handleImageChange pasando un falso evento
      const fakeEvent = { target: { files: e.dataTransfer.files } } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleImageChange(fakeEvent);
    }
  };

  // Funciones Drop Videos
  const handleVideoDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsVideoDragging(true);
  };
  const handleVideoDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsVideoDragging(false);
  };
  const handleVideoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsVideoDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fakeEvent = { target: { files: e.dataTransfer.files } } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleVideoChange(fakeEvent);
    }
  };

  const { showToast } = useToast();

  useEffect(() => {
    if (error) showToast(error, "error");
  }, [error]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (success)
      showToast(
        isEditMode
          ? "¡Propiedad actualizada exitosamente! Redirigiendo..."
          : "¡Propiedad publicada exitosamente! Redirigiendo...",
        "success",
      );
  }, [success]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasUnsavedChanges = Boolean(
    form.titulo ||
    form.descripcion ||
    form.precio ||
    form.direccion ||
    form.ciudad ||
    imagenes.length > 0,
  );
  useWarnIfUnsavedChanges(hasUnsavedChanges && !success);

  if (loadingEdit) {
    return (
      <div className="register-page-container">
        <div
          className="register-page"
          style={{ textAlign: "center", padding: "4rem" }}
        >
          <p style={{ color: "#aaa", fontSize: "1.1rem" }}>
            Cargando propiedad...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="register-page-container">
        <form className="register-page" onSubmit={handleSubmit}>
          <h3>{isEditMode ? "Editar Propiedad" : "Publicar Propiedades"}</h3>
          <p id="subtitle">
            {isEditMode
              ? "Modifica los datos de tu propiedad"
              : "Datos Principales de la Propiedad"}
          </p>

          <br />

          {/* Información Básica */}
          <div className="card">
            <h4>Información Básica</h4>

            <p>
              Título del anuncio <span className="required">*</span>
            </p>
            <input
              type="text"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              placeholder="Ej: Hermoso apartamento en zona céntrica"
            />

            <p>Descripción</p>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Describe las características principales de la propiedad"
              rows={4}
              maxLength={800}
              style={{ resize: "vertical", maxHeight: "220px" }}
            />
            <span style={{ fontSize: "0.78rem", color: "#aaa", display: "block", textAlign: "right", marginTop: "-6px" }}>
              {(form.descripcion || "").length}/800 caracteres
            </span>

            <div>
              {/* Tipo de Propiedad */}
              <label htmlFor="tipoPropiedad">Tipo de propiedad</label>
              <br />
              <select
                id="tipoPropiedad"
                name="tipoPropiedad"
                value={form.tipoPropiedad}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Selecciona
                </option>
                <option value="apartamento">Apartamento</option>
                <option value="casa">Casa</option>
                <option value="lote">Lote</option>
              </select>
              <br />

              {/* Tipo de Operación */}
              <label htmlFor="tipoOperacion">
                Tipo de operación <span className="required">*</span>
              </label>
              <br />
              <select
                id="tipoOperacion"
                name="tipoOperacion"
                value={form.tipoOperacion}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Selecciona
                </option>
                <option value="venta">Venta</option>
                <option value="alquiler">Alquiler</option>
              </select>
            </div>

            <br />

            <br />

            {/* Precio y Área */}
            <div className="two-col">
              <div>
                <p>Precio (COP)</p>
                <input
                  type="number"
                  name="precio"
                  value={form.precio}
                  onChange={handleChange}
                  placeholder="00.00"
                  min="0"
                />
              </div>
              <div>
                <p>Área (m²)</p>
                <input
                  type="number"
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </div>

          <br />

          <br />

          {/* Ubicación */}
          <div className="card">
            <h4>Ubicación</h4>

            <p>
              Dirección <span className="required">*</span>
            </p>
            <input
              type="text"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              placeholder="Calle 00 #00-00"
            />

            <div className="two-col">
              <div>
                <p>
                  Ciudad <span className="required">*</span>
                </p>
                <input
                  type="text"
                  name="ciudad"
                  value={form.ciudad}
                  onChange={handleChange}
                  placeholder="Ej: Tunja"
                />
              </div>
              <div>
                <p>
                  Departamento <span className="required">*</span>
                </p>
                <input
                  type="text"
                  name="departamento"
                  value={form.departamento}
                  onChange={handleChange}
                  placeholder="Ej: Boyacá"
                />
              </div>
            </div>

            <br />

            <div className="two-col">
              <div>
                <p>Barrio</p>
                <input
                  type="text"
                  name="barrio"
                  value={form.barrio}
                  onChange={handleChange}
                  placeholder="Ej: Centro"
                />
              </div>
              <div>
                <p>Código postal</p>
                <input
                  type="text"
                  name="codigopostal"
                  value={form.codigopostal}
                  onChange={handleChange}
                  placeholder="150001"
                />
              </div>
            </div>

            <br />
            
            <div style={{ marginTop: "1rem" }}>
              <p>
                Precisión de Mapa (Mueve el mapa o dale clic para ajustar el punto exacto)
              </p>
              <MapSelector
                initialLat={form.latitud ? parseFloat(form.latitud) : undefined}
                initialLng={form.longitud ? parseFloat(form.longitud) : undefined}
                city={form.ciudad}
                department={form.departamento}
                address={form.direccion}
                onLocationSelect={(lat, lng) => setCoordenadas(lat, lng)}
              />
              {form.latitud && form.longitud && (
                <span style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "4px", display: "inline-block" }}>
                  Coordenadas fijadas: {parseFloat(form.latitud).toFixed(5)}, {parseFloat(form.longitud).toFixed(5)}
                </span>
              )}
            </div>
          </div>

          <br />

          <br />

          {/* Características */}
          <div className="card">
            <h4>Características</h4>

            <div className="two-col">
              <div>
                <p>
                  Habitaciones <span className="required">*</span>
                </p>
                <input
                  type="number"
                  name="habitaciones"
                  value={form.habitaciones}
                  onChange={handleChange}
                  placeholder="Ej: 3"
                  min="0"
                />
              </div>
              <div>
                <p>
                  Baños <span className="required">*</span>
                </p>
                <input
                  type="number"
                  name="banos"
                  value={form.banos}
                  onChange={handleChange}
                  placeholder="Ej: 2"
                  min="0"
                />
              </div>
            </div>

            <br />

            <div className="two-col">
              <div>
                <p>Antigüedad (años)</p>
                <input
                  type="text"
                  name="antiguedad"
                  value={form.antiguedad}
                  onChange={handleChange}
                  placeholder="Ej: 5 años"
                />
              </div>
              <div>
                <p>
                  Estrato <span className="required">*</span>
                </p>
                <input
                  type="number"
                  name="estrato"
                  value={form.estrato}
                  onChange={handleChange}
                  placeholder="3"
                  min="0"
                />
              </div>
            </div>

            <br />

            <br />

            {/* Características adicionales (dinámicas desde BD) */}
            <fieldset>
              <legend>Características adicionales</legend>
              <div className="amenities-grid">
                {cargandoCaracteristicas ? (
                  <p className="loading-text">Cargando características...</p>
                ) : errorCaracteristicas ? (
                  <p className="loading-text" style={{ color: "#e74c3c" }}>
                    ⚠️ {errorCaracteristicas}
                  </p>
                ) : caracteristicasDisponibles.length > 0 ? (
                  caracteristicasDisponibles.map((car) => (
                    <label key={car.idcaracteristica}>
                      <input
                        type="checkbox"
                        checked={caracteristicasSeleccionadas.includes(
                          car.idcaracteristica,
                        )}
                        onChange={() =>
                          toggleCaracteristica(car.idcaracteristica)
                        }
                      />
                      {car.nombre.charAt(0).toUpperCase() + car.nombre.slice(1).toLowerCase()}
                    </label>
                  ))
                ) : (
                  <p className="loading-text">
                    No hay características disponibles.
                  </p>
                )}
              </div>
            </fieldset>
          </div>

          <br />

          <br />

          {/* Fotografías */}
          <div className="card">
            <h4>Fotos de la Propiedad</h4>
            <p>Sube al menos 3 fotos (máx {maxFotos}). Formatos: JPG, PNG, WebP · máx 5MB.</p>

            {/* Dropzone Fotos */}
            <div 
              className={`dropzone-container ${isThumbDragging ? 'dragging' : ''}`}
              onDragOver={handleThumbDragOver}
              onDragLeave={handleThumbDragLeave}
              onDrop={handleThumbDrop}
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <div className="dropzone-content">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="dropzone-icon">
                  <path d="M12 16V4M12 4L8 8M12 4L16 8M4 20H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p>Click para seleccionar imágenes</p>
                <p className="dropzone-subtext">o arrastra tus archivos aquí ({previews.length}/{maxFotos})</p>
              </div>
            </div>

            <input
              id="fileInput"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />

            {/* Grid de previews con drag-and-drop (RF19/RF20) */}
            <SortableImageGrid
              previews={previews}
              onReorder={reorderPreviews}
              onRemove={removeImage}
              videoFlags={videoFlags}
            />

            {/* Sección de Videos (RF20) */}
            <hr style={{ margin: "20px 0", border: "none", borderTop: "1px solid #eee" }} />
            <h4>Videos de la Propiedad</h4>
            <p>Sube hasta <strong>{maxVideos}</strong> video(s) MP4 (máx 50MB c/u). Los videos nunca serán la portada.</p>

            {/* Dropzone Videos */}
            <div 
              className={`dropzone-container video-dropzone ${isVideoDragging ? 'dragging' : ''}`}
              onDragOver={handleVideoDragOver}
              onDragLeave={handleVideoDragLeave}
              onDrop={handleVideoDrop}
              onClick={() => document.getElementById('videoInput')?.click()}
            >
              <div className="dropzone-content">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="dropzone-icon">
                  <path d="M15 10L19 7V17L15 14V17H5V7H15V10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p>Click para seleccionar videos</p>
                <p className="dropzone-subtext">o arrastra tus archivos aquí ({videoPreviews.length}/{maxVideos})</p>
              </div>
            </div>

            <input
              id="videoInput"
              type="file"
              multiple
              accept="video/mp4"
              onChange={handleVideoChange}
              style={{ display: "none" }}
            />

            {videoPreviews.length > 0 && (
              <div className="video-previews-grid">
                {videoPreviews.map((url: string, idx: number) => (
                  <div key={url} className="video-preview-item">
                    <video src={url} controls style={{ width: "100%", borderRadius: "8px", maxHeight: "160px", objectFit: "contain", background: "#000" }} />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeVideo(idx)}
                      aria-label="Eliminar video"
                    >✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Opción de destacar (Premium) */}
          <div className="card" style={{ 
            border: form.destacar ? "2px solid #f1b307" : "1px solid #eee",
            background: form.destacar ? "#fffdf5" : "#fff",
            padding: "20px"
          }}>
            <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: usuario?.plan === "premium" ? "pointer" : "not-allowed", fontWeight: "bold", fontSize: "1.05rem" }}>
              <input
                type="checkbox"
                checked={form.destacar}
                disabled={usuario?.plan !== "premium"}
                onChange={() => handleToggle("destacar")}
                style={{ width: "20px", height: "20px", accentColor: "#f1b307" }}
              />
              Destacar esta propiedad
            </label>
            <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "10px", lineHeight: "1.4" }}>
              Las propiedades destacadas aparecen primero en los resultados del Home y búsquedas, y llevan el listón visual <strong>"DESTACADA"</strong>.
              {usuario?.plan !== "premium" && (
                <span style={{ color: "#d35400", display: "block", marginTop: "8px", background: "#fef5e7", padding: "8px", borderRadius: "6px" }}>
                  💡 <strong>¡Atiéndete!</strong> Solo los usuarios con suscripción <strong>Premium</strong> pueden activar esta opción.
                  Házte premium de manera fácil y rápida{" "}
                  <a href="/promotion" style={{ color: "#f1b307", fontWeight: "bold", textDecoration: "underline" }}>aquí</a>.
                </span>
              )}
            </p>
          </div>

          <br />
          
          <p style={{ fontSize: "0.85rem", color: "#666", textAlign: "center", marginBottom: "1rem" }}>
            Al hacer clic en el botón de abajo, usted confirma que ha leído y acepta nuestros <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: "#35d2db", textDecoration: "underline" }}>Términos y Condiciones</a> y nuestra <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#35d2db", textDecoration: "underline" }}>Política de Privacidad</a>.
          </p>

          {/* Botones de Acción */}
          <div className="card-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => window.history.back()}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting
                ? isEditMode
                  ? "Actualizando..."
                  : "Publicando..."
                : isEditMode
                  ? "Actualizar Propiedad"
                  : "Publicar Propiedad"}
            </button>
          </div>
        </form>
      </div>

      {/* Modal Promocional pos-límite */}
      <PremiumPromoModal
        isOpen={showLimitModal}
        onClose={() => {
          setShowLimitModal(false);
          if (hasReachedFreeLimit && !isEditMode) {
            window.history.back(); // Obligar a salir si alcanzó el límite
          }
        }}
        title="¡Haz alcanzado el límite gratuito!"
        subtitle="Los usuarios del plan Gratis solo pueden tener 3 propiedades activas simultáneamente. ¡Obtén Premium para publicar ilimitado!"
        fromAction="limit_reached"
      />
    </>
  );
}

export default RegisterPropertyPage;

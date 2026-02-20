import "./styleRegisterP.css";
import { usePropertyForm } from "./hooks/usePropertyForm";

// Página de Registro de Propiedades
function RegisterPropertyPage() {
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
    maxFotos,
    imagenes,
  } = usePropertyForm();

  return (
    <>
      <div className="register-page-container">
        <form className="register-page" onSubmit={handleSubmit}>
          <h3>Publicar Propiedades</h3>
          <p id="subtitle">Datos Principales de la Propiedad</p>

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
            />

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
                <option value="arriendo">Arriendo</option>
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
                      {car.nombre}
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
            <p>Sube hasta {maxFotos} imágenes (JPG, PNG o WebP, máx 5MB c/u)</p>

            <label htmlFor="fileInput" className="foto-upload-btn">
              📷 Seleccionar fotos ({imagenes.length}/{maxFotos})
            </label>
            <input
              id="fileInput"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />

            {/* Grid de previews */}
            {previews.length > 0 && (
              <div className="fotos-preview-grid">
                {previews.map((url, i) => (
                  <div key={i} className="foto-preview-item">
                    <img src={url} alt={`Foto ${i + 1}`} />
                    <button
                      type="button"
                      className="foto-remove-btn"
                      onClick={() => removeImage(i)}
                      title="Eliminar foto"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <br />

          <br />

          {/* Mensajes de error y éxito (cerca de los botones para que el usuario los vea) */}
          {error && <div className="form-error-message">⚠️ {error}</div>}
          {success && (
            <div className="form-success-message">
              ✅ ¡Propiedad publicada exitosamente! Redirigiendo...
            </div>
          )}

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
              {submitting ? "Publicando..." : "Publicar Propiedad"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default RegisterPropertyPage;

import "./styleRegisterP.css";

// Página de Registro de Propiedades
function RegisterPropertyPage() {
  return (
    <>
    <div className="register-page-container">

      <div className="register-page">
        <h3>Publicar Propiedades</h3>
        <p id="subtitle">Datos Principales de la Propiedad</p>

        <br />

        {/* Información Básica */}
        <div className="card">
          <h4>Información Básica</h4>

          <p>Título del anuncio</p>
          <input
            type="text"
            placeholder="Ej: Hermoso apartamento en zona céntrica"
          />

          <p>Descripción</p>
          <input
            type="text"
            placeholder="Describe las características principales de la propiedad"
          />

          <div>
            {/* Tipo de Propiedad */}
            <label htmlFor="propertyType">
              Tipo de propiedad <span aria-hidden="true">*</span>
            </label>
            <br />
            <select id="propertyType" name="propertyType" defaultValue="">
              <option value="disabled" disabled>
                Selecciona
              </option>
              <option value="apartment">Apartamento</option>
              <option value="house">Casa</option>
              <option value="lot">Lote</option>
            </select>
            <br />

            {/* Tipo de Operación */}
            <label htmlFor="operationType">
              Tipo de operación <span aria-hidden="true">*</span>
            </label>
            <br />
            <select id="operationType" name="operationType" defaultValue="">
              <option value="disabled" disabled>
                Selecciona
              </option>
              <option value="sale">Venta</option>
              <option value="rent">Arriendo</option>
            </select>
          </div>

          <br />

          <br />

          {/* Precio y Área verificar */}
          <div className="two-col">
            <div>
              <p>Precio (COP)</p>
              <input type="number" placeholder="00.00" />
            </div>
            <div>
              <p>Área (m²)</p>
              <input type="number" placeholder="0" />
            </div>
          </div>
        </div>

        <br />

        <br />

        {/* Ubicación */}
        <div className="card">
          <h4>Ubicación</h4>

          <p>Dirección</p>
          <input type="text" placeholder="Calle 00 #00-00" />

          <div className="two-col">
            <div>
              <p>Ciudad</p>
              <input type="text" placeholder="Ej: Tunja" />
            </div>
            <div>
              <p>Departamento</p>
              <input type="text" placeholder="Ej: Boyacá" />
            </div>
          </div>

          <br />

          <div className="two-col">
            <div>
              <p>Barrio</p>
              <input type="text" placeholder="Ej: Centro" />
            </div>
            <div>
              <p>Código postal</p>
              <input type="text" placeholder="150001" />
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
              <p>Habitaciones</p>
              <input type="text" placeholder="Ej: 1 principal, 2 auxiliares" />
            </div>
            <div>
              <p>Baños</p>
              <input type="text" placeholder="Ej: 3 baños" />
            </div>
          </div>

          <br />


          <div className="two-col">
            <div>
              <p>Antigüedad (años)</p>
              <input type="text" placeholder="0" />
            </div>
            <div>
              <p>Estrato</p>
              <input type="text" placeholder="3" />
            </div>
          </div>

          <br />

          <div className="two-col">
            <div>
              <p>Pisos (Nivel de la propiedad)</p>
              <input type="text" placeholder="Ej: 2° piso" />
            </div>
            <div>
              <p>Total Pisos (Del edificio/casa)</p>
              <input type="text" placeholder="Ej: 5 pisos" />
            </div>
          </div>

          <br />

          <br />

          {/* Amenidades */}
          <fieldset>
            <legend>Características adicionales</legend>
            <div className="amenities-grid">
              <label>
                <input type="checkbox" name="amenities" value="pool" />
                Piscina
              </label>
              <label>
                <input type="checkbox" name="amenities" value="gym" />
                Gimnasio
              </label>
              <label>
                <input type="checkbox" name="amenities" value="garden" />
                Jardín
              </label>
              <label>
                <input type="checkbox" name="amenities" value="terrace" />
                Terraza
              </label>
              <label>
                <input type="checkbox" name="amenities" value="balcony" />
                Balcón
              </label>
              <label>
                <input type="checkbox" name="amenities" value="security24" />
                Seguridad 24/7
              </label>
              <label>
                <input type="checkbox" name="amenities" value="gamearea" />
                Área de juegos
              </label>
              <label>
                <input type="checkbox" name="amenities" value="eventroom" />
                Salón de eventos
              </label>
              <label>
                <input type="checkbox" name="amenities" value="elevator" />
                Ascensor
              </label>
              <label>
                <input type="checkbox" name="amenities" value="parking" />
                Estacionamiento
              </label>
              <label>
                <input type="checkbox" name="amenities" value="amoblado" />
                Amoblado
              </label>
             
              <label>
                <input type="checkbox" name="amenities" value="kitchen" />
                Cocina equipada
              </label>
              <label>
                <input type="checkbox" name="amenities" value="management" />
                Tiene administración
              </label>
              <label>
                <input type="checkbox" name="amenities" value="closets" />
                Closets
              </label>
              <label>
                <input type="checkbox" name="amenities" value="ac" />
                Aire acondicionado
              </label>
              <label>
                <input type="checkbox" name="amenities" value="cafeteria" />
                Cafetería
              </label>
              <label>
                <input type="checkbox" name="amenities" value="pets" />
                Mascotas permitidas
              </label>
            </div>
          </fieldset>
        </div>

        <br />

        <br />

        {/* Fotografías */}
        <div className="card">
          <h4>Fotos de la Propiedad</h4>
          <p>
            Sube hasta 15 imágenes de la propiedad para mostrarla en detalle
          </p>
          <label htmlFor="fileInput">Seleccionar archivos</label>
          <input
            id="fileInput"
            type="file"
            title="Elegir archivos"
            multiple
            accept="image/*"
          />
        </div>

        <br />

        <br />

        {/* Botones de Acción */}
        <div className="card-actions">
          <button className="btn-cancel">Cancelar</button>
          <button className="btn-primary">Publicar Propiedad</button>
        </div>
      </div>
    </div>
    </>
  );
  
}

export default RegisterPropertyPage;

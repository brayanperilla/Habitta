import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

function RegisterPropeties() {
  return (
    <>
      <Navbar></Navbar>

      <h1>Publicar Propriedades</h1>
      <h3>Datos Principales de la Propiedad</h3>

      <br />
      <div>
        <h4>Informacion Basica</h4>
        <p>Titulo del anuncio</p>
        <input
          type="text"
          placeholder="Ej: Hermoso apartamento en zona céntrica"
        />
        <p>Descripcion</p>
        <input
          type="text"
          placeholder="Describe las características de la propiedad"
        />
        <div>
          <label htmlFor="propertyType">
            tipo de propiedad <span aria-hidden="true">*</span>
          </label>
          <br />
          <select id="propertyType" name="propertyType" defaultValue="">
            <option value="" disabled>
              Selecciona
            </option>
            <option value="apartment">Apartamento</option>
            <option value="house">Casa</option>
            <option value="lot">Lote</option>
          </select>
          <br />
          <label htmlFor="operationType">
            tipo de operación<span aria-hidden="true">*</span>
          </label>
          <br />
          {/*esta seccion esta de forma provisional  */}
          <select id="operationType" name="operationType" defaultValue="">
            <option value="" disabled>
              Selecciona
            </option>
            <option value="sale">Venta</option>
            <option value="rent">Arriendo</option>
          </select>
        </div>
        <br />
        <div>
          <p>Precio (COP)</p>
          <input type="text" placeholder="00.00" />
          <p>Àrea (m2)</p>
          <input type="text" placeholder="0" />
        </div>
      </div>
      <br />
      <div>
         <h4>Ubicación</h4>
      <p>Dirección</p>
      <input
        type="text"
        placeholder="Calle 00 #00-00"
      />  
        <div>
           <p>Ciudad</p>
        <input
          type="text"
          placeholder="Tunja"
        />
        <p>Departamento</p>
        <input
          type="text"
          placeholder="Boyaca"
        />
        </div>
        <br />
        <div>
           <p>Barrio</p>
        <input
          type="text"
          placeholder="Centro"
        />
        <p>Codigo postal</p>
        <input
          type="text"
          placeholder="1500001"
        />
        </div>
      </div>
      <br />
      <div>
        <h4>Caracteristicas</h4>
        <div>
           <p>Habitaciones</p>
        <input
        type="text"
        placeholder="1 principal, 2 auxiliares"
        />  
        <p>Baños</p>
        <input
          type="text"
          placeholder="3 baños"
        />
        <br />
        {/*faltaria agregar la logica para que si es lote no aparezca esta opcion de amoblado*/}
        <label htmlFor="furnished">Amoblado <span aria-hidden="true">*</span></label>
        <br />
        <select id="furnished" name="furnished" defaultValue="">
          <option value="" disabled>Selecciona</option>
          <option value="yes">si</option>
          <option value="no">no</option>
        </select>
        </div>
        <br />
        <div>
          <label htmlFor="parkingLot">Estacionamiento <span aria-hidden="true">*</span></label>
        <br />
        <select id="parkingLot" name="parkingLot" defaultValue="">
          <option value="" disabled>Selecciona</option>
          <option value="yes">si</option>
          <option value="no">no</option>
        </select>
        <br />
        <p>Antiguedad (años)</p>
        <input
          type="text"
          placeholder="0"
        />
        </div>
        <br />
        <div>
          <p>Pisos</p>
          <input type="text" 
          placeholder="2 pisos"
          />
          <p>Total Pisos</p>
          <input type="text" 
          placeholder="5 pisos"
          />
        </div>
        <br />
        <fieldset>
          <legend>Caracteristicas adicionales</legend>
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
      <div>
        <h4>Fotos de la Propiedad</h4>
        <p>Sube hasta 15 imagenes de la propiedad</p>
        <input type="file" multiple accept="image/*" />
      </div>

      <Footer></Footer>
    </>
  );
}

export default RegisterPropeties;

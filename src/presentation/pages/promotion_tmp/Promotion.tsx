import "./Promotion.css";
// Componente de Promoción
function Promotion() {
  return (
    <div className="promotion-container">
      <h1 className="promotion-title">Planes de Publicación</h1>
      <p className="promotion-subtitle">
        Aumenta la visibilidad de tu propiedad
      </p>

      <div className="promotion-cards">
        {/* Plan Básico */}
        <div className="promotion-card basic">
          <h2>Publicación Básica</h2>
          <p className="price">$0 por 30 días</p>
          <ul className="feature-list">
            <li>
              <span className="check basic">✔</span> Publicación por 30 días
            </li>
            <li>
              <span className="check basic">✔</span> Hasta 7 fotos
            </li>
            <li>
              <span className="check basic">✔</span> Aparece en búsquedas
            </li>
          </ul>
          <button className="select-button orange">Seleccionar Plan</button>
        </div>

        {/* Plan Destacado */}
        <div className="promotion-card featured">
          <h2>Publicación Destacada</h2>
          <p className="price">$199 por 30 días</p>
          <ul className="feature-list">
            <li>
              <span className="check featured">✔</span> Publicación por 30 días
            </li>
            <li>
              <span className="check featured">✔</span> Hasta 15 fotos
            </li>
            <li>
              <span className="check featured">✔</span> Aparece como destacada
            </li>
            <li>
              <span className="check featured">✔</span> Mayor visibilidad
            </li>
            <li>
              <span className="check featured">✔</span> Etiqueta de destacado
            </li>
          </ul>
          <button className="select-button teal">Seleccionar Plan</button>
        </div>
      </div>
    </div>
  );
}

export default Promotion;

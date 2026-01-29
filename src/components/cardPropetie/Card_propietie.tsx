import "./cardStyle.css";
// Importing available icons
import heartIcon from "../../assets/icons/hearth-svgrepo-com.svg";
// import shareIcon from "../../assets/icons/share.svg"; // Assuming we might have one or need a placeholder, using generic for now
import homeIcon from "../../assets/icons/home-1393-svgrepo-com.svg";
import house1 from "../../assets/images/auth/dream_home_1.png";
import house2 from "../../assets/images/auth/dream_home_2.png";
import house3 from "../../assets/images/auth/dream_home_3.png";

function CardPropetie() {
  return (
    <div className="property-cards-grid">
      {/* CARD 1 */}
      <div className="property-card">
        <div className="property-card__image-container">
          <img
            src={house1}
            alt="Casa en Polanco"
            className="property-card__img"
          />
          {/* BADGES */}
          <div className="property-card__badges">
            <span className="badge badge--featured">Destacada</span>
            <span className="badge badge--type">Venta</span>
          </div>

          {/* ACTION BUTTONS */}
          <div className="property-card__actions">
            <button className="action-btn" title="Agregar a favoritos">
              <img src={heartIcon} alt="Favorito" className="icon-svg" />
            </button>
          </div>
        </div>

        <div className="property-card__body">
          <h3 className="property-card__title">Casa moderna en Polanco</h3>
          <p className="property-card__location">Polanco, Ciudad de México</p>

          <p className="property-card__price">$3.200.000.000 COP</p>

          <div className="property-card__features">
            <span className="feature-item">
              <img src={homeIcon} alt="Habitaciones" className="feature-icon" />
              4
            </span>
            <span className="feature-item">
              <img src={homeIcon} alt="Baños" className="feature-icon" />3
            </span>
            <span className="feature-item">
              <img src={homeIcon} alt="Área" className="feature-icon" />
              250 m²
            </span>
          </div>

          <button className="property-card__btn-details">Ver detalles</button>
        </div>
      </div>

      {/* CARD 2 */}
      <div className="property-card">
        <div className="property-card__image-container">
          <img
            src={house2}
            alt="Apartamento de lujo"
            className="property-card__img"
          />
          <div className="property-card__badges">
            <span className="badge badge--type">Renta</span>
          </div>
          <div className="property-card__actions">
            <button className="action-btn">
              <img src={heartIcon} alt="Favorito" className="icon-svg" />
            </button>
          </div>
        </div>
        <div className="property-card__body">
          <h3 className="property-card__title">Apartamento de lujo</h3>
          <p className="property-card__location">Bogotá, Cundinamarca</p>
          <p className="property-card__price">$2.500.000.000 COP</p>
          <div className="property-card__features">
            <span className="feature-item">
              <img src={homeIcon} alt="Hab" className="feature-icon" />3
            </span>
            <span className="feature-item">
              <img src={homeIcon} alt="Baños" className="feature-icon" />2
            </span>
            <span className="feature-item">
              <img src={homeIcon} alt="Área" className="feature-icon" />
              180 m²
            </span>
          </div>
          <button className="property-card__btn-details">Ver detalles</button>
        </div>
      </div>

      {/* CARD 3 */}
      <div className="property-card">
        <div className="property-card__image-container">
          <img
            src={house3}
            alt="Casa Campestre"
            className="property-card__img"
          />
          <div className="property-card__badges">
            <span className="badge badge--type">Venta</span>
          </div>
          <div className="property-card__actions">
            <button className="action-btn">
              <img src={heartIcon} alt="Favorito" className="icon-svg" />
            </button>
          </div>
        </div>
        <div className="property-card__body">
          <h3 className="property-card__title">Casa Campestre</h3>
          <p className="property-card__location">Medellín, Antioquia</p>
          <p className="property-card__price">$1.800.000.000 COP</p>
          <div className="property-card__features">
            <span className="feature-item">
              <img src={homeIcon} alt="Hab" className="feature-icon" />5
            </span>
            <span className="feature-item">
              <img src={homeIcon} alt="Baños" className="feature-icon" />4
            </span>
            <span className="feature-item">
              <img src={homeIcon} alt="Área" className="feature-icon" />
              350 m²
            </span>
          </div>
          <button className="property-card__btn-details">Ver detalles</button>
        </div>
      </div>
    </div>
  );
}

export default CardPropetie;

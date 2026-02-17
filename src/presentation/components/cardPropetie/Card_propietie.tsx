import "./cardStyle.css";
import { useNavigate } from "react-router-dom";
import type { Property } from "@domain/entities/Property";

const heartIcon = "/icons/UI/navbaricons/hearth-svgrepo-com.svg";
const homeIcon = "/icons/UI/navbaricons/house-01-svgrepo-com.svg";
const fallbackImage = "/images/auth/dream_home_1.png";

// Props del componente
interface CardPropetieProps {
  property: Property;
}

// Componente de tarjeta de propiedad individual
function CardPropetie({ property }: CardPropetieProps) {
  const navigate = useNavigate();

  // Formatear precio en pesos colombianos
  const formatPrice = (price: number | null) => {
    if (!price) return "Precio no disponible";
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Determinar badges según el estado de publicación
  const badges = [];
  if (property.estado_publicacion === "destacada") badges.push("Destacada");
  if (property.estado) badges.push(property.estado); // "Venta", "Renta", etc.

  return (
    <div className="property-card">
      <div className="property-card__image-container">
        <img
          src={fallbackImage}
          alt={property.titulo || "Propiedad"}
          className="property-card__img"
        />
        {/* Badges */}
        {badges.length > 0 && (
          <div className="property-card__badges">
            {badges.map((badge, i) => (
              <span
                key={i}
                className={`badge badge--${badge === "Destacada" ? "featured" : "type"}`}
              >
                {badge}
              </span>
            ))}
          </div>
        )}
        {/* Botón de favoritos */}
        <div className="property-card__actions">
          <button className="action-btn" title="Agregar a favoritos">
            <img src={heartIcon} alt="Favorito" className="icon-svg" />
          </button>
        </div>
      </div>
      <div className="property-card__body">
        <h3 className="property-card__title">
          {property.titulo || "Sin título"}
        </h3>
        <p className="property-card__location">
          {property.tipo || "Tipo no especificado"}
        </p>
        <p className="property-card__price">{formatPrice(property.precio)}</p>
        <div className="property-card__features">
          {property.habitaciones && (
            <span className="feature-item">
              <img src={homeIcon} alt="Habitaciones" className="feature-icon" />
              {property.habitaciones}
            </span>
          )}
          {property.banos && (
            <span className="feature-item">
              <img src={homeIcon} alt="Baños" className="feature-icon" />
              {property.banos}
            </span>
          )}
          {property.area && (
            <span className="feature-item">
              <img src={homeIcon} alt="Área" className="feature-icon" />
              {property.area} m²
            </span>
          )}
        </div>
        <button
          className="property-card__btn-details"
          onClick={() =>
            navigate(`/propertydetailspage?id=${property.idpropiedad}`)
          }
        >
          Ver detalles
        </button>
      </div>
    </div>
  );
}

export default CardPropetie;

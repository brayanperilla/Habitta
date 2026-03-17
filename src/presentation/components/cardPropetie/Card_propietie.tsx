import "./cardStyle.css";
import { useNavigate } from "react-router-dom";
import type { Property } from "@domain/entities/Property";

const fallbackImage = "/images/auth/dream_home_1.png";

// Props del componente
interface CardPropetieProps {
  property: Property;
  /** ¿Es favorito del usuario actual? */
  isFav?: boolean;
  /** Callback al hacer click en el corazón */
  onToggleFav?: (idpropiedad: number) => void;
  /** ¿El usuario actual es el dueño de esta propiedad? */
  isOwner?: boolean;
  /** Callback al hacer click en eliminar */
  onDelete?: (idpropiedad: number) => void;
}

// Componente de tarjeta de propiedad individual
function CardPropetie({
  property,
  isFav = false,
  onToggleFav,
  isOwner: _isOwner = false,
  onDelete: _onDelete,
}: CardPropetieProps) {
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

  // Determinar badges según el estado de publicación y tipo de operación
  const badges = [];
  if (property.estadoPublicacion === "destacada") badges.push("Destacada");
  if (property.tipoOperacion) badges.push(property.tipoOperacion);

  return (
    <div className="property-card">
      <div className="property-card__image-container">
        {/* Si la foto principal es un video MP4, mostrar fallback image para no distorsionar la card */}
        {(() => {
          const src = property.fotoUrl || fallbackImage;
          const isVideo = src.toLowerCase().includes(".mp4") || src.toLowerCase().includes("/video/");
          return (
            <img
              src={isVideo ? fallbackImage : src}
              alt={property.titulo || "Propiedad"}
              className="property-card__img"
            />
          );
        })()}

        {/* Badges especiales por estado */}
        {property.estadoPublicacion === "pending_manual" && (
          <div className="property-card__status-badge" style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            background: "#f59e0b",
            color: "#fff",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "0.75rem",
            fontWeight: "bold",
            zIndex: 10
          }}>
            En revisión (normalmente &lt; 12h)
          </div>
        )}

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
        {/* Botones de acción (siempre visible) */}
        <div className="property-card__actions">
          <div style={{ display: "flex", gap: "8px" }}>
            {/* Botón de compartir */}
            <button
              className="action-btn"
              title="Compartir"
              onClick={(e) => {
                e.stopPropagation();
                // Implementación de compartir
                if (navigator.share) {
                  navigator.share({
                    title: property.titulo ?? "Propiedad",
                    text: `Mira esta propiedad: ${property.titulo ?? ""}`,
                    url:
                      window.location.origin +
                      `/propertydetailspage/${property.idpropiedad}`,
                  });
                }
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="18"
                  cy="5"
                  r="3"
                  stroke="#1a1a1a"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="6"
                  cy="12"
                  r="3"
                  stroke="#1a1a1a"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="18"
                  cy="19"
                  r="3"
                  stroke="#1a1a1a"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.59 13.51L15.42 17.49"
                  stroke="#1a1a1a"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.41 6.51L8.59 10.49"
                  stroke="#1a1a1a"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Botón de favoritos */}
          <button
            className={`action-btn ${isFav ? "action-btn--fav-active" : ""}`}
            title={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleFav) {
                onToggleFav(property.idpropiedad);
              } else {
                navigate("/auth");
              }
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                fill={isFav ? "#ff3040" : "none"}
                stroke={isFav ? "#ff3040" : "#1a1a1a"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transition: "all 0.2s ease-in-out" }}
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="property-card__body">
        <h3 className="property-card__title">
          {property.titulo || "Sin título"}
        </h3>
        <p className="property-card__location">
          {[property.ciudad, property.departamento]
            .filter(Boolean)
            .join(", ") || "Ubicación no especificada"}
        </p>

        {/* Contenido expandible en hover */}
        <div className="property-card__expandable">
          <p className="property-card__type">
            {property.tipoPropiedad || "Tipo no especificado"}
          </p>
          <p className="property-card__price">{formatPrice(property.precio)}</p>
          <div className="property-card__features">
            {property.habitaciones && (
              <span className="feature-item">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="feature-svg"
                >
                  <path
                    d="M2 13V18M2 15H22M22 13V18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 13V9C4 7.89543 4.89543 7 6 7H18C19.1046 7 20 7.89543 20 9V13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 11H11M13 11H17"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="feature-value">{property.habitaciones}</span>
              </span>
            )}
            {property.banos && (
              <span className="feature-item">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="feature-svg"
                >
                  <path
                    d="M4 11H20C21.1046 11 22 11.8954 22 13V15C22 16.1046 21.1046 17 20 17H4C2.89543 17 2 16.1046 2 15V13C2 11.8954 2.89543 11 4 11Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 17V19M18 17V19"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 11V7C7 5.89543 7.89543 5 9 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.5 4.5L10 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="feature-value">{property.banos}</span>
              </span>
            )}
            {property.area && (
              <span className="feature-item">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="feature-svg"
                >
                  <rect
                    x="4"
                    y="4"
                    width="16"
                    height="16"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="feature-value">{property.area} m²</span>
              </span>
            )}
          </div>
          <button
            className="property-card__btn-details"
            onClick={() =>
              navigate(`/propertydetailspage/${property.idpropiedad}`)
            }
          >
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardPropetie;

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { propertyService } from "@application/services/propertyService";
import type { Property } from "@domain/entities/Property";
import type { Caracteristica } from "@domain/entities/Caracteristica";
import "./PropertyDetailsPage.css";

const fallbackImage = "/images/auth/dream_home_1.png";

function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [caracteristicas, setCaracteristicas] = useState<Caracteristica[]>([]);
  const [fotos, setFotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgIndex, setImgIndex] = useState(0);

  // Tabs
  const [activeTab, setActiveTab] = useState("Descripción");
  const [showLightbox, setShowLightbox] = useState(false);
  const tabNames = ["Descripción", "Características", "Ubicación"];

  // Imagen seleccionada (primera foto o fallback)
  const selectedImg = fotos.length > 0 ? fotos[imgIndex] : fallbackImage;

  // Navegación de imágenes
  const prevImg = () => setImgIndex((i) => (i > 0 ? i - 1 : fotos.length - 1));
  const nextImg = () => setImgIndex((i) => (i < fotos.length - 1 ? i + 1 : 0));

  // Cargar datos de la propiedad al montar
  useEffect(() => {
    const cargar = async () => {
      if (!id) {
        setError("ID de propiedad no proporcionado.");
        setLoading(false);
        return;
      }

      try {
        const [prop, cars, imgs] = await Promise.all([
          propertyService.getPropertyById(Number(id)),
          propertyService.getCaracteristicasDePropiedad(Number(id)),
          propertyService.getFotosPropiedad(Number(id)),
        ]);

        if (!prop) {
          setError("Propiedad no encontrada.");
        } else {
          setProperty(prop);
          setCaracteristicas(cars);
          setFotos(imgs);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar la propiedad.",
        );
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [id]);

  // Formatear precio en pesos colombianos
  const formatPrice = (price: number | null) => {
    if (!price) return "Precio no disponible";
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Formatear fecha relativa
  const formatFecha = (fecha: string | null) => {
    if (!fecha) return "Fecha no disponible";
    const diff = Date.now() - new Date(fecha).getTime();
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (dias === 0) return "Hoy";
    if (dias === 1) return "Hace 1 día";
    return `Hace ${dias} días`;
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="property-details-container">
        <p style={{ textAlign: "center", padding: "4rem", color: "#aaa" }}>
          Cargando propiedad...
        </p>
      </div>
    );
  }

  // Estado de error
  if (error || !property) {
    return (
      <div className="property-details-container">
        <p style={{ textAlign: "center", padding: "4rem", color: "#f66" }}>
          {error || "Propiedad no encontrada."}
        </p>
      </div>
    );
  }

  return (
    <div className="property-details-container">
      <div className="property-details-main">
        {/* Sección de Imágenes */}
        <div className="property-details-image-section">
          <img
            src={selectedImg}
            alt={property.titulo || "Propiedad"}
            className="property-details-main-img"
          />
          <button
            className="property-details-arrow left"
            aria-label="Anterior"
            onClick={prevImg}
          >
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="32" cy="32" r="32" fill="#fff" />
              <path
                d="M40 32H24M24 32l8-8M24 32l8 8"
                stroke="#10D6C2"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className="property-details-arrow right"
            aria-label="Siguiente"
            onClick={nextImg}
          >
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="32" cy="32" r="32" fill="#fff" />
              <path
                d="M24 32h16M40 32l-8-8M40 32l-8 8"
                stroke="#10D6C2"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className="property-details-expand"
            aria-label="Expandir"
            onClick={() => setShowLightbox(true)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 3H5C3.89543 3 3 3.89543 3 5V9M3 15V19C3 20.1046 3.89543 21 5 21H9M15 21H19C20.1046 21 21 20.1046 21 19V15M21 9V5C21 3.89543 20.1046 3 19 3H15"
                stroke="#1a1a1a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className="property-details-share"
            aria-label="Compartir"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: property.titulo ?? "Propiedad",
                  text: `Mira esta propiedad: ${property.titulo ?? ""}`,
                  url: window.location.origin + `/propertydetailspage/${property.idpropiedad}`,
                });
              }
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="18"
                cy="5"
                r="3"
                stroke="#1a1a1a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="6"
                cy="12"
                r="3"
                stroke="#1a1a1a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="18"
                cy="19"
                r="3"
                stroke="#1a1a1a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.59 13.51L15.42 17.49"
                stroke="#1a1a1a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.41 6.51L8.59 10.49"
                stroke="#1a1a1a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Miniaturas */}
        <div className="property-details-thumbnails">
          {fotos.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Miniatura ${idx + 1}`}
              className={`property-details-thumbnail${imgIndex === idx ? " selected" : ""}`}
              onClick={() => setImgIndex(idx)}
            />
          ))}
        </div>

        {/* Info rápida */}
        <div className="property-details-info">
          <span className="property-details-badge">
            {property.tipoOperacion || "N/A"}
          </span>
          <h2 className="property-details-price">
            {formatPrice(property.precio)}
          </h2>
        </div>

        {/* Tabs */}
        <div className="property-details-tabs">
          {tabNames.map((tab) => (
            <button
              key={tab}
              className={`property-details-tab${activeTab === tab ? " active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Contenido de Tabs */}
        <div className="property-details-tab-content">
          {/* Tab: Descripción */}
          {activeTab === "Descripción" && (
            <div className="property-details-description-box">
              <h3>{property.titulo || "Sin título"}</h3>
              <p style={{ color: "#666", marginBottom: "1rem" }}>
                {property.tipoPropiedad || "Tipo no especificado"} ·{" "}
                {property.tipoOperacion}
              </p>
              <p>
                {property.descripcion ||
                  "No hay descripción disponible para esta propiedad."}
              </p>
              {property.antiguedad && (
                <p style={{ marginTop: "1rem", color: "#888" }}>
                  Antigüedad: {property.antiguedad}
                </p>
              )}
            </div>
          )}

          {/* Tab: Características */}
          {activeTab === "Características" && (
            <div className="property-details-description-box">
              {caracteristicas.length > 0 ? (
                <ul>
                  {caracteristicas.map((car) => (
                    <li key={car.idcaracteristica}>
                      {car.nombre}
                      {car.descripcion && (
                        <span style={{ color: "#888" }}>
                          {" "}
                          — {car.descripcion}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay características adicionales registradas.</p>
              )}
            </div>
          )}

          {/* Tab: Ubicación */}
          {activeTab === "Ubicación" && (
            <div className="property-details-description-box">
              <p>
                <strong>Dirección:</strong> {property.direccion}
              </p>
              <p>
                <strong>Ciudad:</strong> {property.ciudad}
              </p>
              <p>
                <strong>Departamento:</strong> {property.departamento}
              </p>
              {property.barrio && (
                <p>
                  <strong>Barrio:</strong> {property.barrio}
                </p>
              )}
              {property.codigopostal && (
                <p>
                  <strong>Código postal:</strong> {property.codigopostal}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Sección de información de propiedad */}
        <div className="property-details-info-box">
          <div className="property-details-info-header">
            <span className="property-details-badge">
              {property.tipoOperacion}
            </span>
            <button className="property-details-fav-btn" aria-label="Favorito">
              <svg
                width="44"
                height="44"
                viewBox="0 0 44 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="22" cy="22" r="20" fill="#fff" />
                <path
                  d="M30.84 14.61a5.5 5.5 0 0 0-7.78 0L22 15.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L22 31.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              className="property-details-share-btn"
              aria-label="Compartir"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: property?.titulo ?? "Propiedad",
                    text: `Mira esta propiedad de Habitta: ${property?.titulo}`,
                    url: window.location.href,
                  });
                }
              }}
            >
              <svg
                width="44"
                height="44"
                viewBox="0 0 44 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="22" cy="22" r="20" fill="#fff" />
                <g transform="translate(10, 10) scale(1)">
                  <circle
                    cx="18"
                    cy="5"
                    r="3"
                    stroke="#1a1a1a"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="6"
                    cy="12"
                    r="3"
                    stroke="#1a1a1a"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="18"
                    cy="19"
                    r="3"
                    stroke="#1a1a1a"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.59 13.51L15.42 17.49"
                    stroke="#1a1a1a"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.41 6.51L8.59 10.49"
                    stroke="#1a1a1a"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </button>
          </div>
          <h2 className="property-details-info-price">
            {formatPrice(property.precio)}
          </h2>
          {property.area && property.precio && (
            <span className="property-details-info-price-m2">
              {formatPrice(Math.round(property.precio / property.area))}/m²
            </span>
          )}
          <div className="property-details-info-features">
            <div className="detail-feature-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="feature-svg">
                <path d="M2 13V18M2 15H22M22 13V18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 13V9C4 7.89543 4.89543 7 6 7H18C19.1046 7 20 7.89543 20 9V13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 11H11M13 11H17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="feature-text-group">
                <span className="property-details-info-value">{property.habitaciones}</span>
                <span className="property-details-info-label">Habitaciones</span>
              </div>
            </div>
            <div className="detail-feature-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="feature-svg">
                <path d="M4 11H20C21.1046 11 22 11.8954 22 13V15C22 16.1046 21.1046 17 20 17H4C2.89543 17 2 16.1046 2 15V13C2 11.8954 2.89543 11 4 11Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 17V19M18 17V19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 11V7C7 5.89543 7.89543 5 9 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.5 4.5L10 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="feature-text-group">
                <span className="property-details-info-value">{property.banos}</span>
                <span className="property-details-info-label">Baños</span>
              </div>
            </div>
            {property.area && (
              <div className="detail-feature-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="feature-svg">
                  <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="feature-text-group">
                  <span className="property-details-info-value">{property.area}</span>
                  <span className="property-details-info-label">m²</span>
                </div>
              </div>
            )}
          </div>
          <button className="property-details-info-call-btn">
            Llamar ahora
          </button>
          <button className="property-details-info-msg-btn">
            Enviar mensaje
          </button>
        </div>

        {/* Metadatos */}
        <div className="property-details-meta-box">
          <div className="property-details-meta-row">
            <span>ID de propiedad:</span>
            <span>#HTT-{String(property.idpropiedad).padStart(6, "0")}</span>
          </div>
          <div className="property-details-meta-row">
            <span>Publicado:</span>
            <span>{formatFecha(property.fechacreacion)}</span>
          </div>
          <div className="property-details-meta-row">
            <span>Estrato:</span>
            <span>{property.estrato}</span>
          </div>
        </div>
      </div>

      {/* Lightbox / Imagen Completa */}
      {showLightbox && (
        <div className="property-lightbox" onClick={() => setShowLightbox(false)}>
          <div className="property-lightbox__content" onClick={(e) => e.stopPropagation()}>
            <button
              className="property-lightbox__close"
              onClick={() => setShowLightbox(false)}
            >
              &times;
            </button>
            <img
              src={selectedImg}
              alt={property?.titulo || "Propiedad"}
              className="property-lightbox__img"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertyDetailsPage;

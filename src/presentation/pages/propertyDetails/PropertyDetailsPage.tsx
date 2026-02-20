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
          <button className="property-details-expand">&#9633;</button>
          <button className="property-details-share">&#x1f517;</button>
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
                  d="M22 33s-8.5-6.7-11.5-10.9C7 17.2 8.5 13.5 12 13.5c2.38 0 3.92 1.56 4.6 3.06C17.68 15.06 19.22 13.5 21.6 13.5c3.5 0 5 3.7 2 8.6C30.5 26.3 22 33 22 33z"
                  fill="#10D6C2"
                />
              </svg>
            </button>
            <button
              className="property-details-share-btn"
              aria-label="Compartir"
            >
              <svg
                width="44"
                height="44"
                viewBox="0 0 44 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="22" cy="22" r="20" fill="#fff" />
                <path
                  d="M29.5 27.5a3.5 3.5 0 0 0-2.77 1.38l-8.46-4.23a3.5 3.5 0 0 0 0-2.3l8.46-4.23A3.5 3.5 0 1 0 27 14.5a3.5 3.5 0 0 0 0 2.3l-8.46 4.23A3.5 3.5 0 1 0 14.5 29.5a3.5 3.5 0 0 0 2.77-1.38l8.46 4.23A3.5 3.5 0 1 0 29.5 27.5z"
                  stroke="#A78BFA"
                  strokeWidth="2.5"
                  fill="none"
                />
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
            <div>
              <span className="property-details-info-icon">&#128719;</span>
              <span className="property-details-info-value">
                {property.habitaciones}
              </span>
              <span className="property-details-info-label">Habitaciones</span>
            </div>
            <div>
              <span className="property-details-info-icon">&#128705;</span>
              <span className="property-details-info-value">
                {property.banos}
              </span>
              <span className="property-details-info-label">Baños</span>
            </div>
            {property.area && (
              <div>
                <span className="property-details-info-icon">&#9632;</span>
                <span className="property-details-info-value">
                  {property.area}
                </span>
                <span className="property-details-info-label">m²</span>
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
    </div>
  );
}

export default PropertyDetailsPage;

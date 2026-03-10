import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { propertyService } from "@application/services/propertyService";
import { usuariosApi } from "@infrastructure/api/usuarios.api";
import type { Property } from "@domain/entities/Property";
import type { Caracteristica } from "@domain/entities/Caracteristica";
import type { Usuario } from "@domain/entities/Usuario";
import { MapSelector } from "@presentation/components/MapSelector/MapSelector";
import "./PropertyDetailsPage.css";

const fallbackImage = "/images/auth/dream_home_1.png";

function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [vendedor, setVendedor] = useState<Usuario | null>(null);
  const [caracteristicas, setCaracteristicas] = useState<Caracteristica[]>([]);
  const [fotos, setFotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgIndex, setImgIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false); // Added showContactModal

  // Tabs
  const [activeTab, setActiveTab] = useState("Descripción");
  const [showLightbox, setShowLightbox] = useState(false);
  const tabNames = ["Descripción", "Características", "Ubicación"];

  // Imagen seleccionada (primera foto o fallback)
  const selectedImg = fotos.length > 0 ? fotos[imgIndex] : fallbackImage;

  // Navegación de imágenes
  const prevImg = () => setImgIndex((i) => (i > 0 ? i - 1 : fotos.length - 1));
  const nextImg = () => setImgIndex((i) => (i < fotos.length - 1 ? i + 1 : 0));

  // Cargar datos de la propiedad y del vendedor al montar
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
          // Cargar el perfil del vendedor (para leer su teléfono)
          if (prop.idusuario) {
            usuariosApi.getById(prop.idusuario).then(setVendedor).catch(() => {});
          }
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
          {(() => {
            const isVid = selectedImg.toLowerCase().includes(".mp4") || selectedImg.toLowerCase().includes("/video/");
            return isVid ? (
              <video
                src={selectedImg}
                controls
                className="property-details-main-img"
                style={{ cursor: "pointer", objectFit: "contain", background: "#000" }}
                onClick={() => setShowLightbox(true)}
              />
            ) : (
              <img
                src={selectedImg}
                alt={property.titulo || "Propiedad"}
                className="property-details-main-img"
                onClick={() => setShowLightbox(true)}
                style={{ cursor: "zoom-in" }}
              />
            );
          })()}
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
          {fotos.map((img, idx) => {
            const isVid = img.toLowerCase().includes(".mp4") || img.toLowerCase().includes("/video/");
            return isVid ? (
              <div
                key={idx}
                className={`property-details-thumbnail${imgIndex === idx ? " selected" : ""}`}
                onClick={() => setImgIndex(idx)}
                style={{ position: "relative", cursor: "pointer" }}
              >
                <video src={img} muted preload="metadata" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} />
                <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: "1.2rem", pointerEvents: "none" }}>▶️</span>
              </div>
            ) : (
              <img
                key={idx}
                src={img}
                alt={`Miniatura ${idx + 1}`}
                className={`property-details-thumbnail${imgIndex === idx ? " selected" : ""}`}
                onClick={() => setImgIndex(idx)}
              />
            );
          })}
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
              
              {property.latitud && property.longitud && (
                <div style={{ marginTop: "1rem" }}>
                  <MapSelector
                    initialLat={property.latitud}
                    initialLng={property.longitud}
                    onLocationSelect={() => {}} /* Solo lectura */
                  />
                </div>
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
                <path d="M2 13V18M2 15H22M22 13V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 13V9C4 7.89543 4.89543 7 6 7H18C19.1046 7 20 7.89543 20 9V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 11H11M13 11H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="feature-text-group">
                <span className="property-details-info-value">{property.habitaciones}</span>
                <span className="property-details-info-label">Habitaciones</span>
              </div>
            </div>
            <div className="detail-feature-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="feature-svg">
                <path d="M4 11H20C21.1046 11 22 11.8954 22 13V15C22 16.1046 21.1046 17 20 17H4C2.89543 17 2 16.1046 2 15V13C2 11.8954 2.89543 11 4 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 17V19M18 17V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 11V7C7 5.89543 7.89543 5 9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.5 4.5L10 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="feature-text-group">
                <span className="property-details-info-value">{property.banos}</span>
                <span className="property-details-info-label">Baños</span>
              </div>
            </div>
            {property.area && (
              <div className="detail-feature-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="feature-svg">
                  <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="feature-text-group">
                  <span className="property-details-info-value">{property.area}</span>
                  <span className="property-details-info-label">m²</span>
                </div>
              </div>
            )}
          </div>
          {/* Botones de contacto (RF50/RF49) */}
          <div className="property-details-contact-buttons">
            {/* WhatsApp — usa el tel del vendedor si está disponible */}
            {(() => {
              const tel = vendedor?.telefono
                ? vendedor.telefono.replace(/\D/g, "")
                : "57";
              const prefix = tel.startsWith("57") || tel.length > 10 ? "" : "57";
              const num = `${prefix}${tel}`;
              const msg = encodeURIComponent(
                `¡Hola! Vi tu propiedad "${property.titulo ?? ""}" en Habitta y me interesa. ¿Podemos hablar?`
              );
              return (
                <a
                  href={`https://wa.me/${num}?text=${msg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="property-details-info-whatsapp-btn"
                  aria-label="Contactar por WhatsApp"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.129.555 4.13 1.527 5.862L0 24l6.302-1.504A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.013-1.375l-.36-.213-3.735.891.933-3.607-.235-.371A9.818 9.818 0 1112 21.818z"/>
                  </svg>
                  WhatsApp
                </a>
              );
            })()}

            {/* Llamar */}
            <button
              className="property-details-info-call-btn"
              onClick={() => setShowContactModal(true)}
              aria-label="Llamar al vendedor"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11.5 19.79 19.79 0 01.03 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11l-1.27 1.27a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
              Llamar
            </button>

            {/* Mensaje (PQRS / contacto) */}
            <button
              className="property-details-info-msg-btn"
              aria-label="Enviar mensaje al vendedor"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
              Mensaje
            </button>
          </div>

          {/* Modal de llamada */}
          {showContactModal && (
            <div className="contact-modal-overlay" onClick={() => setShowContactModal(false)}>
              <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
                <button className="contact-modal__close" onClick={() => setShowContactModal(false)}>✕</button>
                <div className="contact-modal__icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10D6C2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11.5 19.79 19.79 0 01.03 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11l-1.27 1.27a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                </div>
                <h3>Contactar al vendedor</h3>
                {vendedor?.telefono ? (
                  <>
                    <p>Llama directamente al vendedor:</p>
                    <a
                      href={`tel:${vendedor.telefono.replace(/\D/g, "")}`}
                      className="contact-modal__msg-btn"
                      style={{ display: "block", textDecoration: "none" }}
                    >
                      📞 {vendedor.telefono}
                    </a>
                  </>
                ) : (
                  <>
                    <p>El vendedor no ha registrado un número de teléfono aún.</p>
                    <p style={{ color: "#aaa", fontSize: "0.9rem" }}>Contáctalo por WhatsApp para coordinar la llamada.</p>
                    <button className="contact-modal__msg-btn" onClick={() => setShowContactModal(false)}>
                      Entendido
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>{/* /property-details-info-box */}


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
            {(selectedImg.toLowerCase().includes(".mp4") || selectedImg.toLowerCase().includes("/video/")) ? (
              <video
                src={selectedImg}
                controls
                autoPlay
                className="property-lightbox__img"
                style={{ maxHeight: "85vh", maxWidth: "90vw", borderRadius: "12px" }}
              />
            ) : (
              <img
                src={selectedImg}
                alt={property?.titulo || "Propiedad"}
                className="property-lightbox__img"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertyDetailsPage;

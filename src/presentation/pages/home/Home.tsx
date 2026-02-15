import { useState, useEffect } from "react";
import CardPropetie from "../../components/cardPropetie/Card_propietie";
import { useProperties } from "@application/hooks/useProperties";
import "./home.css";
import { Link } from "react-router-dom";
const shieldIcon = "/icons/UI/heroIcons/shield-alt-1-svgrepo-com.svg";
const medallIcon = "/icons/UI/heroIcons/medal-ribbon-svgrepo-com.svg";
const peopleIcon = "/icons/UI/heroIcons/peoples-svgrepo-com.svg";
const timerIcon = "/icons/UI/heroIcons/timer-svgrepo-com.svg";
const searchIcon =
  "/icons/UI/navbaricons/glass-magnifier-search-zoom-alert-notification-svgrepo-com.svg";
const img1 = "/images/example/dream_home_1.png";
const img2 = "/images/example/dream_home_2.png";
const img3 = "/images/example/dream_home_3.png";

// Imágenes de fondo para el carrusel
const backgroundImages = [img1, img2, img3];

// Componente de Página Principal
function Home() {
  // Propiedades destacadas desde Supabase
  const { properties, loading } = useProperties();

  // Estado de rotación de imágenes
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Rotar imágenes cada 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % backgroundImages.length,
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Contenedor Principal */}
      <main className="home-container">
        {/* Sección Hero */}
        <section className="hero-section">
          {/* Carrusel de Fondo */}
          <div className="hero-slideshow">
            {backgroundImages.map((image, index) => (
              <div
                key={index}
                className={`hero-slide ${index === currentImageIndex ? "active" : ""}`}
                style={{ backgroundImage: `url(${image})` }}
              />
            ))}
            {/* Capa Oscura */}
            <div className="hero-overlay"></div>
          </div>

          {/* Contenido Hero */}
          <div className="hero-content">
            <h1>
              Encuentra tu <span className="text-primary">hogar ideal</span> en
              Latinoamérica
            </h1>
            <h3>
              Miles de propiedades esperándote. Compra, vende o alquila con la
              confianza que mereces.
            </h3>

            {/* Tarjeta de Búsqueda */}
            <div className="search-card">
              {/* Pestañas de Tipo */}
              <div className="search-tabs">
                <button className="tab active">Comprar</button>
                <button className="tab">Alquilar</button>
                <button className="tab">Vender</button>
              </div>

              {/* Campos de Entrada */}
              <div className="search-inputs">
                {/* Tipo de Propiedad */}
                <div className="input-group">
                  <label htmlFor="propertyType">Tipo de propiedad</label>
                  <select id="propertyType" name="propertyType" defaultValue="">
                    <option value="" disabled>
                      Selecciona
                    </option>
                    <option value="apartment">Apartamento</option>
                    <option value="house">Casa</option>
                    <option value="lot">Lote</option>
                  </select>
                </div>

                {/* Divisor */}
                <div className="divider"></div>

                {/* Campo de Ubicación */}
                <div className="input-group flex-grow">
                  <label>Ubicación</label>
                  <input
                    id="location"
                    type="text"
                    placeholder="Ciudad, zona o código"
                  />
                </div>

                {/* Botón de Búsqueda */}
                <button className="search-btn">
                  <img
                    src={searchIcon}
                    alt="Search"
                    style={{
                      width: "20px",
                      height: "20px",
                      filter: "brightness(0) invert(1)",
                    }}
                  />
                  Buscar
                </button>
              </div>

              {/* Búsquedas Populares */}
              <div className="popular-searches">
                <span className="label">Búsquedas populares:</span>
                <div className="tags">
                  <button>Apartamentos en Bogotá</button>
                  <button>Casas en Medellín</button>
                  <button>Oficinas Santiago</button>
                  <button>Casas Medellín</button>
                </div>
              </div>
            </div>

            {/* Estadísticas Rápidas */}
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">25,000+</span>
                <span className="stat-label">Propiedades</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">150+</span>
                <span className="stat-label">Ciudades</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50,000+</span>
                <span className="stat-label">Usuarios activos</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">12,000+</span>
                <span className="stat-label">Transacciones exitosas</span>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Propiedades Destacadas */}
        <section className="section-container prominent-section">
          <div className="section-header">
            <h4>Propiedades destacadas</h4>
            <h5>
              Descubre las mejores oportunidades inmobiliarias seleccionadas
              especialmente para ti
            </h5>
          </div>

          {/* Tarjetas de propiedades destacadas desde Supabase */}
          <div className="property-cards-grid">
            {properties.slice(0, 3).map((property) => (
              <CardPropetie key={property.idpropiedad} property={property} />
            ))}
            {properties.length === 0 && !loading && (
              <p
                style={{ textAlign: "center", color: "#aaa", padding: "1rem" }}
              >
                No hay propiedades destacadas.
              </p>
            )}
          </div>

          <div className="center-btn">
            <Link to="/properties" className="primary-btn-outline">
              Ver todas las propiedades
            </Link>
          </div>
        </section>

        {/* Sección de Características */}
        <section className="section-container features-section">
          <div className="section-header">
            <h4>¿Por qué elegir Habitta?</h4>
            <h5>
              La plataforma inmobiliaria más confiable de Latinoamérica,
              respaldada por tecnología y experiencia
            </h5>
          </div>

          <div className="features-grid">
            {/* Característica 1 */}
            <div className="feature-card">
              <div className="icon-box">
                <img
                  src={shieldIcon}
                  alt="Verificado"
                  style={{ width: "30px", height: "30px" }}
                />
              </div>
              <h3>Verificación garantizada</h3>
              <p>
                Todas las propiedades y usuarios pasan por un riguroso proceso
                de verificación
              </p>
            </div>

            {/* Característica 2 */}
            <div className="feature-card">
              <div className="icon-box">
                <img
                  src={medallIcon}
                  alt="Experto"
                  style={{ width: "30px", height: "30px" }}
                />
              </div>
              <h3>Asesoría especializada</h3>
              <p>
                Contamos con expertos inmobiliarios en cada país para guiarte en
                tu decisión
              </p>
            </div>

            {/* Característica 3 */}
            <div className="feature-card">
              <div className="icon-box">
                <img
                  src={peopleIcon}
                  alt="Comunidad"
                  style={{ width: "30px", height: "30px" }}
                />
              </div>
              <h3>Comunidad confiable</h3>
              <p>
                Miles de usuarios satisfechos que han encontrado su hogar ideal
                con nosotros
              </p>
            </div>

            {/* Característica 4 */}
            <div className="feature-card">
              <div className="icon-box">
                <img
                  src={timerIcon}
                  alt="Soporte"
                  style={{ width: "60px", height: "60px" }}
                />
              </div>
              <h3>Soporte 24/7</h3>
              <p>
                Nuestro equipo está disponible las 24 horas para resolver tus
                dudas
              </p>
            </div>
          </div>

          {/* Certificaciones */}
          <div className="certifications-bar">
            <span className="cert-label">
              Certificaciones y reconocimientos
            </span>
            <div className="cert-logos">
              <span className="cert-item">ISO 27001</span>
              <span className="cert-item">SSL Secured</span>
              <span className="cert-item">GDPR Compliant</span>
              <span className="cert-item">Trusted Partner</span>
            </div>
          </div>
        </section>

        {/* Sección de Llamada a la Acción */}
        <section className="cta-section">
          <div className="cta-slideshow">
            {backgroundImages.map((image, index) => (
              <div
                key={`cta-${index}`}
                className={`cta-slide ${index === currentImageIndex ? "active" : ""}`}
                style={{ backgroundImage: `url(${image})` }}
              />
            ))}
            <div className="cta-overlay"></div>
          </div>
          <div className="cta-content">
            <h1>¿Listo para encontrar tu próximo hogar?</h1>
            <h3>
              Únete a miles de personas que ya han encontrado su propiedad
              ideal. Crear tu cuenta es gratis y solo toma unos minutos.
            </h3>

            {/* Acciones CTA */}
            <div className="cta-actions">
              <Link to="/auth" className="cta-primary-btn">
                Crear cuenta gratis <span>→</span>
              </Link>
              <div className="cta-input-group">
                <input type="email" placeholder="Tu correo electrónico" />
              </div>
            </div>

            {/* Tarjetas de App */}
            <div className="app-cards-grid">
              <div className="app-card">
                <div className="app-icon"></div>
                <div className="app-info">
                  <strong>Versión Web</strong>
                  <span>Accede desde cualquier navegador</span>
                </div>
              </div>
              <div className="app-card">
                <div className="app-icon"></div>
                <div className="app-info">
                  <strong>App Móvil</strong>
                  <span>Próximamente en App Store y Google Play</span>
                </div>
              </div>
            </div>
          </div>
          client
        </section>
      </main>
    </>
  );
}

export default Home;

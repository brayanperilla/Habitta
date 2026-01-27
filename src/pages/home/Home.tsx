import { useState, useEffect } from "react";
import CardPropetie from "../../components/cardPropetie/Card_propietie";
import "./home.css";
import { Link } from "react-router-dom";
import starIcon from "../../assets/icons/star-alt-4-svgrepo-com.svg";
import homeIcon from "../../assets/icons/house-01-svgrepo-com.svg";
import searchIcon from "../../assets/icons/glass-magnifier-search-zoom-alert-notification-svgrepo-com.svg";

// Imágenes de fondo para el slideshow (las mismas del Auth)
import img1 from "../../assets/images/auth/dream_home_1.png";
import img2 from "../../assets/images/auth/dream_home_2.png";
import img3 from "../../assets/images/auth/dream_home_3.png";

const backgroundImages = [
  img1,
  img2,
  img3,
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80",
];

function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
      <main className="home-container">
        {/* HERO SECTION */}
        <section className="hero-section">
          {/* Background Slideshow */}
          <div className="hero-slideshow">
            {backgroundImages.map((image, index) => (
              <div
                key={index}
                className={`hero-slide ${index === currentImageIndex ? "active" : ""}`}
                style={{ backgroundImage: `url(${image})` }}
              />
            ))}
            <div className="hero-overlay"></div>
          </div>

          <div className="hero-content">
            <h1>Encuentra tu <span className="text-primary">hogar ideal</span> en Latinoamérica</h1>
            <h3>
              Miles de propiedades esperándote. Compra, vende o alquila con la
              confianza que mereces.
            </h3>

            {/* SEARCH CARD */}
            <div className="search-card">
              <div className="search-tabs">
                <button className="tab active">Comprar</button>
                <button className="tab">Alquilar</button>
                <button className="tab">Vender</button>
              </div>

              <div className="search-inputs">
                <div className="input-group">
                  <label>Tipo de propiedad</label>
                  <select id="propertyType" name="propertyType" defaultValue="">
                    <option value="" disabled>
                      Selecciona
                    </option>
                    <option value="apartment">Apartamento</option>
                    <option value="house">Casa</option>
                    <option value="lot">Lote</option>
                  </select>
                </div>

                <div className="divider"></div>

                <div className="input-group flex-grow">
                  <label>Ubicación</label>
                  <input
                    id="location"
                    type="text"
                    placeholder="Ciudad, zona o código"
                  />
                </div>

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

            {/* HERO STATS */}
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

        {/* PROMINENT SECTION (Featured Properties) */}
        <section className="section-container prominent-section">
          <div className="section-header">
            <h4>Propiedades destacadas</h4>
            <h5>
              Descubre las mejores oportunidades inmobiliarias seleccionadas
              especialmente para ti
            </h5>
          </div>

          <CardPropetie />

          <div className="center-btn">
            <Link to="/properties" className="primary-btn-outline">
              Ver todas las propiedades
            </Link>
          </div>
        </section>

        {/* WHY CHOOSE HABITTA */}
        <section className="section-container features-section">
          <div className="section-header">
            <h4>¿Por qué elegir Habitta?</h4>
            <h5>
              La plataforma inmobiliaria más confiable de Latinoamérica,
              respaldada por tecnología y experiencia
            </h5>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="icon-box">
                <img
                  src={starIcon}
                  alt="Verified"
                  style={{ width: "40px", height: "40px" }}
                />
              </div>
              <h3>Verificación garantizada</h3>
              <p>
                Todas las propiedades y usuarios pasan por un riguroso proceso
                de verificación
              </p>
            </div>
            <div className="feature-card">
              <div className="icon-box">
                <img
                  src={homeIcon}
                  alt="Expert"
                  style={{ width: "40px", height: "40px" }}
                />
              </div>
              <h3>Asesoría especializada</h3>
              <p>
                Contamos con expertos inmobiliarios en cada país para guiarte en
                tu decisión
              </p>
            </div>
            <div className="feature-card">
              <div className="icon-box">
                <img
                  src={starIcon}
                  alt="Community"
                  style={{ width: "40px", height: "40px" }}
                />
              </div>
              <h3>Comunidad confiable</h3>
              <p>
                Miles de usuarios satisfechos que han encontrado su hogar ideal
                con nosotros
              </p>
            </div>
            <div className="feature-card">
              <div className="icon-box">
                <img
                  src={homeIcon}
                  alt="Support"
                  style={{ width: "40px", height: "40px" }}
                />
              </div>
              <h3>Soporte 24/7</h3>
              <p>
                Nuestro equipo está disponible las 24 horas para resolver tus
                dudas
              </p>
            </div>
          </div>

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

        {/* CTA SECTION */}
        <section className="cta-section">
          {/* Background Slideshow */}
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

            <div className="cta-actions">
              <Link to="/properties" className="cta-primary-btn">
                Crear cuenta gratis <span>→</span>
              </Link>
              <div className="cta-input-group">
                {/* Visual placeholder for input if needed, or just white space as in image */}
                <input type="email" placeholder="Tu correo electrónico" />
              </div>
            </div>

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
        </section>
      </main>
    </>
  );
}

export default Home;

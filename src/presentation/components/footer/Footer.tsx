import "./footer.css";
import {
  footerSections,
  countries,
  socialMedia,
  contactInfo,
} from "./footerData";
// import logoHabitta from "../../assets/images/logoCF.png";
const logoHabitta = "/images/logoCF.png";

// Footer Component
function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Logo & Info */}
        <div className="footer__left">
          <div className="footer__logo-section">
            <img
              src={logoHabitta}
              alt="Logo de Habitta"
              className="footer__logo"
            />
            <h2 className="footer__title">Habitta</h2>
          </div>

          <p className="footer__description">{contactInfo.description}</p>

          {/* Contact Info */}
          <div className="footer__contact">
            <div className="footer__contact-item">
              <span className="footer__icon">✉️</span>
              <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
            </div>
            <div className="footer__contact-item">
              <span className="footer__icon">📞</span>
              <a href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}>
                {contactInfo.phone}
              </a>
            </div>
            <div className="footer__contact-item">
              <span className="footer__icon">📍</span>
              <span>{contactInfo.location}</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="footer__center">
          {footerSections.map((section) => (
            <div key={section.title} className="footer__section">
              <h3 className="footer__section-title">{section.title}</h3>
              <ul className="footer__links">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="footer__link">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Operation Countries */}
      <div className="footer__countries-section">
        <p className="footer__countries-label">Operamos en:</p>
        <div className="footer__countries">
          {countries.map((country) => (
            <button key={country} className="footer__country-btn">
              {country}
            </button>
          ))}
        </div>
      </div>

      {/* Social & Legal */}
      <div className="footer__bottom">
        <div className="footer__social">
          <p className="footer__social-label">Síguenos en:</p>
          <div className="footer__social-icons">
            {socialMedia.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-icon"
                aria-label={social.name}
              >
                {getSocialIcon(social.name)}
              </a>
            ))}
          </div>
        </div>

        <div className="footer__legal">
          <a href="#" className="footer__legal-link">
            Política de privacidad
          </a>
          <span className="footer__legal-separator">|</span>
          <a href="#" className="footer__legal-link">
            Términos de uso
          </a>
          <span className="footer__legal-separator">|</span>
          <a href="#" className="footer__legal-link">
            Cookies
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer__copyright">
        <p>
          © 2024 Habitta. Todos los derechos reservados. Hecho con ❤️ para
          Latinoamérica.
        </p>
      </div>
    </footer>
  );
}

// Helper to get social icons
function getSocialIcon(name: string) {
  const icons: { [key: string]: string } = {
    facebook: "📘",
    instagram: "📷",
    youtube: "▶️",
  };
  return icons[name] || "🔗";
}

export default Footer;

import CardPropetie from "../../components/cardPropetie/Card_propietie";
import "./home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      {/* hero section */}
      <section className="heroSection">
        <h1>Encuentra tu hogar ideal en Latinoamérica</h1>
        <h3>
          Miles de propiedades esperándote. Compra, vende o alquila con la
          confianza que mereces.
        </h3>
        {/*section de filtro de propiedades */}
        <div className="filterProperties">
          <button>comprar</button>
          <select id="propertyType" name="propertyType" defaultValue="">
            <option value="" disabled>
              Selecciona
            </option>
            <option value="null">tipo de propiedad</option>
            <option value="apartment">Apartamento</option>
            <option value="house">Casa</option>
            <option value="lot">Lote</option>
          </select>
          <input type="text" placeholder="Ciudad, zona o código" />
          <button>Buscar</button>
        </div>
        <div></div>
        {/* informacion de stats */}
        <div className="stats">
          <div>
            25.000+ <br />
            Propiedades
          </div>
          <div>
            150+ <br />
            Ciudades
          </div>
          <div>
            50.000+ <br />
            Usuarios activos
          </div>
          <div>
            12.000+ <br />
            Transacciones exitosas
          </div>
        </div>
      </section>
      <div className="prominentSection">
        <h4>Propiedades destacadas</h4>
        <h5>
          Descubre las mejores oportunidades inmobiliarias seleccionadas
          especialmente para ti
        </h5>
      </div>
      <section className="cardsProperties">
        <CardPropetie></CardPropetie>
      </section>
      <Link to="/properties" className="publishBtn">
        Ver todas las propiedades
      </Link>
      <div className="prominentSection">
        <h4>¿Por qué elegir Habitta?</h4>
        <h5>
          La plataforma inmobiliaria más confiable de Latinoamérica, respaldada
          por tecnología y experiencia
        </h5>
      </div>
      <section className="stats">
        <div>
          Verificación garantizada <br />
          Todas las propiedades y usuarios pasan por un riguroso proceso de
          verificación
        </div>
        <div>
          Asesoría especializada <br />
          Contamos con expertos inmobiliarios en cada país para guiarte en tu
          decisión
        </div>
        <div>
          Comunidad confiable <br />
          Miles de usuarios satisfechos que han encontrado su hogar ideal con
          nosotros
        </div>
        <div>
          Soporte 24/7 <br />
          Nuestro equipo está disponible las 24 horas para resolver tus dudas
        </div>
      </section>
      <div>Certificaciones y reconocimientos</div>
      <section>
        <div>ISO 27001</div>
        <div>SSL Secured</div>
        <div>GDPR Compliant</div>
        <div>Trusted Partner</div>
      </section>
      <section className="heroSection">
        <h1>¿Listo para encontrar tu próximo hogar?</h1>
        <h3>
          Únete a miles de personas que ya han encontrado su propiedad ideal.
          Crear tu cuenta es gratis y solo toma unos minutos.
        </h3>
        <Link to="/properties" className="">
          <button>Crear cuenta gratis</button>
          <button>Ver propiedades</button>
        </Link>stats
        <div className="stats">
        <div>
          Versión web <br />
          Accede desde cualquier navegador
        </div>
        <div>
          App móvil <br />
          Próximamente en App Store y Google Play
        </div>
        </div>
      </section>
    </>
  );
}

export default Home;

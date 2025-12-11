import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import CardPropetie from "../../components/cardPropetie/Card_propietie";

function Home() {
  return (
    <>
      <Navbar></Navbar>
      {/* hero section */}
      <section className="heroSection">
        <h1>Encuentra tu hogar ideal en Latinoamérica</h1>
        <h3>
          Miles de propiedades esperándote. Compra, vende o alquila con la
          confianza que mereces.
        </h3>
        {/*section de filtro de propiedades */}
        <div className="FilterPropeties">
          <button>comprar</button>
          <button>Tipo de Propiedad</button>
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
        <h5>Descubre las mejores oportunidades inmobiliarias seleccionadas especialmente para ti</h5>
      </div>
      <section className="clardsPropieties">
        <CardPropetie></CardPropetie>
        
      </section>

      <Footer></Footer>
    </>
  );
}

export default Home;

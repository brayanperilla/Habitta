import CardPropetie from "../../components/cardPropetie/Card_propietie";
import { useProperties } from "@application/hooks/useProperties";
import "./favorites.css";

// Componente de Página de Favoritos
function Favorites() {
  // Obtener propiedades desde Supabase
  const { properties, loading } = useProperties();

  return (
    <>
      <h1 className="favorites-title">Favoritos</h1>
      <p id="descripcionFavoritos">Tus propiedades favoritas guardadas</p>

      {/* Contenedor Principal */}
      <div className="favorites-page">
        {loading && (
          <p style={{ textAlign: "center", padding: "2rem" }}>Cargando...</p>
        )}
        {!loading && properties.length === 0 && (
          <p style={{ textAlign: "center", padding: "2rem" }}>
            No tienes favoritos aún.
          </p>
        )}
        <div className="property-cards-grid">
          {properties.map((property) => (
            <CardPropetie key={property.idpropiedad} property={property} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Favorites;

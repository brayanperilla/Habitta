import CardPropetie from "../../components/cardPropetie/Card_propietie";
import { useState, useEffect } from "react";
import { useAuth } from "@application/context/AuthContext";
import { useFavorites } from "@application/hooks/useFavorites";
import { propertyService } from "@application/services/propertyService";
import type { Property } from "@domain/entities/Property";
import "./favorites.css";

/**
 * Página de Favoritos.
 * Muestra solo las propiedades que el usuario autenticado marcó como favoritas.
 */
function Favorites() {
  const { usuario } = useAuth();
  const {
    favIds,
    isFavorito,
    toggleFavorito,
    loading: favLoading,
  } = useFavorites();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar todas las propiedades y filtrar por favoritos
  useEffect(() => {
    const cargar = async () => {
      if (!usuario || favIds.size === 0) {
        setProperties([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const todas = await propertyService.getProperties();
        const favoritas = todas.filter((p) => favIds.has(p.idpropiedad));
        setProperties(favoritas);
      } catch {
        /* silencioso */
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [usuario, favIds]);

  const isLoading = loading || favLoading;

  // Sin sesión
  if (!usuario) {
    return (
      <>
        <h1 className="favorites-title">Favoritos</h1>
        <p id="descripcionFavoritos">Tus propiedades favoritas guardadas</p>
        <div className="favorites-page">
          <p style={{ textAlign: "center", padding: "2rem", color: "#aaa" }}>
            Inicia sesión para ver tus favoritos.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="favorites-title">Favoritos</h1>
      <p id="descripcionFavoritos">Tus propiedades favoritas guardadas</p>

      {/* Contenedor Principal */}
      <div className="favorites-page">
        {isLoading && (
          <p style={{ textAlign: "center", padding: "2rem" }}>Cargando...</p>
        )}
        {!isLoading && properties.length === 0 && (
          <p style={{ textAlign: "center", padding: "2rem", color: "#aaa" }}>
            No tienes favoritos aún. Explora propiedades y marca las que te
            gusten con el corazón ❤️
          </p>
        )}
        <div className="property-cards-grid">
          {properties.map((property) => (
            <CardPropetie
              key={property.idpropiedad}
              property={property}
              isFav={isFavorito(property.idpropiedad)}
              onToggleFav={toggleFavorito}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Favorites;

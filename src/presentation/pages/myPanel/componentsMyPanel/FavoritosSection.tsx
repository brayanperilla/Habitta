/**
 * FavoritosSection - Sección de Propiedades Favoritas
 *
 * Muestra las propiedades que el usuario ha marcado como favoritas
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@application/context/AuthContext";
import { useFavorites } from "@application/hooks/useFavorites";
import { propertyService } from "@application/services/propertyService";
import type { Property } from "@domain/entities/Property";
import CardPropetie from "@presentation/components/cardPropetie/Card_propietie";
import "./sections.css";

/**
 * Componente que muestra las propiedades favoritas del usuario
 */
const FavoritosSection: React.FC = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const {
    favIds,
    isFavorito,
    toggleFavorito,
    loading: favLoading,
  } = useFavorites();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar propiedades favoritas
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

  return (
    <div className="section-content">
      <div className="section-header-row">
        <h2 className="section-title">Propiedades Favoritas</h2>
        <button
          className="btn-secondary"
          onClick={() => navigate("/favorites")}
        >
          Ver Todos los Favoritos
        </button>
      </div>

      <div className="favoritos-info">
        <p className="favoritos-info__text">
          Tienes {favIds.size} propiedad{favIds.size !== 1 ? "es" : ""} marcada
          {favIds.size !== 1 ? "s" : ""} como favorita
          {favIds.size !== 1 ? "s" : ""}.
        </p>
      </div>

      {/* Estado de carga */}
      {isLoading && (
        <p style={{ textAlign: "center", padding: "2rem", color: "#aaa" }}>
          Cargando favoritos...
        </p>
      )}

      {/* Sin favoritos */}
      {!isLoading && properties.length === 0 && (
        <div className="empty-state">
          <svg
            className="empty-state__icon"
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h3 className="empty-state__title">
            Tus propiedades favoritas aparecerán aquí
          </h3>
          <p className="empty-state__description">
            Explora nuestro catálogo y marca las propiedades que más te gusten
            con el ícono de corazón
          </p>
          <button
            className="btn-primary"
            onClick={() => navigate("/properties")}
          >
            Explorar Propiedades
          </button>
        </div>
      )}

      {/* Tarjetas de favoritos */}
      {!isLoading && properties.length > 0 && (
        <div className="property-cards-grid" style={{ marginTop: "1rem" }}>
          {properties.map((property) => (
            <CardPropetie
              key={property.idpropiedad}
              property={property}
              isFav={isFavorito(property.idpropiedad)}
              onToggleFav={toggleFavorito}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritosSection;

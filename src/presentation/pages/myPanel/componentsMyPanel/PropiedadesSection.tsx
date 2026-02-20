/**
 * PropiedadesSection - Sección de Mis Propiedades
 *
 * Muestra las propiedades publicadas por el usuario logueado
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@application/context/AuthContext";
import { propertyService } from "@application/services/propertyService";
import type { Property } from "@domain/entities/Property";
import "./sections.css";

/**
 * Componente que muestra la lista de propiedades del usuario
 */
const PropiedadesSection: React.FC = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [propiedades, setPropiedades] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      if (!usuario) {
        setPropiedades([]);
        setLoading(false);
        return;
      }
      try {
        const data = await propertyService.getPropertiesByUsuario(
          usuario.idusuario,
        );
        setPropiedades(data);
      } catch {
        /* silencioso */
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [usuario]);

  // Formatear precio
  const formatPrice = (price: number | null) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Formatear fecha
  const formatFecha = (fecha: string | null) => {
    if (!fecha) return "—";
    return new Date(fecha).toLocaleDateString("es-CO");
  };

  return (
    <div className="section-content">
      <div className="section-header-row">
        <h2 className="section-title">Mis Propiedades</h2>
        <button
          className="btn-primary"
          onClick={() => navigate("/registerpropeties")}
        >
          + Publicar Propiedad
        </button>
      </div>

      {/* Estado de carga */}
      {loading && (
        <p style={{ textAlign: "center", padding: "2rem", color: "#aaa" }}>
          Cargando propiedades...
        </p>
      )}

      {/* Sin propiedades */}
      {!loading && propiedades.length === 0 && (
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
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <h3 className="empty-state__title">
            Aún no has publicado propiedades
          </h3>
          <p className="empty-state__description">
            Publica tu primera propiedad y comienza a recibir interesados
          </p>
          <button
            className="btn-primary"
            onClick={() => navigate("/registerpropeties")}
          >
            Publicar mi primera propiedad
          </button>
        </div>
      )}

      {/* Lista de propiedades */}
      <div className="propiedades-list">
        {propiedades.map((propiedad) => (
          <div key={propiedad.idpropiedad} className="propiedad-card">
            <div className="propiedad-card__info">
              <div className="propiedad-card__header">
                <h3 className="propiedad-card__title">
                  {propiedad.titulo || "Sin título"}
                </h3>
                <span
                  className={`estado-badge estado-badge--${(propiedad.estadoPublicacion || "pendiente").toLowerCase()}`}
                >
                  {propiedad.estadoPublicacion || "Pendiente"}
                </span>
              </div>

              <div className="propiedad-card__details">
                <span className="detail-item">
                  <svg
                    className="icon"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M8 0C5.243 0 3 2.243 3 5c0 4.5 5 11 5 11s5-6.5 5-11c0-2.757-2.243-5-5-5zm0 7.5c-1.381 0-2.5-1.119-2.5-2.5S6.619 2.5 8 2.5s2.5 1.119 2.5 2.5S9.381 7.5 8 7.5z" />
                  </svg>
                  {[propiedad.ciudad, propiedad.departamento]
                    .filter(Boolean)
                    .join(", ")}
                </span>
                <span className="detail-item">
                  <svg
                    className="icon"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M2 2h4v4H2V2zm6 0h6v4H8V2zM2 8h4v6H2V8zm6 0h6v6H8V8z" />
                  </svg>
                  {propiedad.tipoPropiedad || "N/A"}
                </span>
              </div>

              <div className="propiedad-card__price">
                {formatPrice(propiedad.precio)}
              </div>

              <div className="propiedad-card__stats">
                <span className="stat-item">
                  <svg
                    className="icon"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M3 2h10v12H3V2zm2 2v8h6V4H5z" />
                  </svg>
                  {formatFecha(propiedad.fechacreacion)}
                </span>
              </div>
            </div>

            <div className="propiedad-card__actions">
              <button
                className="action-btn action-btn--view"
                title="Ver"
                onClick={() =>
                  navigate(`/propertydetailspage/${propiedad.idpropiedad}`)
                }
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M8 3.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM8 10a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropiedadesSection;

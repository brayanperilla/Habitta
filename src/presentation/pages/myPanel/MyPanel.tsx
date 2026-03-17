/**
 * Esta página gestiona el panel de control del usuario donde puede ver
 * sus propiedades, favoritos, reportes y configurar su perfil
 */

import React, { useState, useEffect } from "react";
import TabNavigator from "./componentsMyPanel/TabNavigator";
import PropiedadesSection from "./componentsMyPanel/PropiedadesSection";
import FavoritosSection from "./componentsMyPanel/FavoritosSection";
import ReportesSection from "./componentsMyPanel/ReportesSection";
import PerfilSection from "./componentsMyPanel/PerfilSection";
import { useAuth } from "@application/context/AuthContext";
import { propertyService } from "@application/services/propertyService";
import { useFavorites } from "@application/hooks/useFavorites";
import "./myPanel.css";

/**
 * Componente principal de la página Mi Panel
 */
const MyPanel: React.FC = () => {
  const { usuario } = useAuth();
  const { favIds } = useFavorites();
  const isAdmin = usuario?.rol === "admin";

  // Estado para controlar la pestaña activa (si es admin, empieza en perfil)
  const [activeTab, setActiveTab] = useState<string>(isAdmin ? "perfil" : "propiedades");

  // Stats dinámicas
  const [totalPropiedades, setTotalPropiedades] = useState(0);
  const [propiedadesActivas, setPropiedadesActivas] = useState(0);

  useEffect(() => {
    const cargarStats = async () => {
      if (!usuario) return;
      try {
        const props = await propertyService.getPropertiesByUsuario(
          usuario.idusuario,
        );
        setTotalPropiedades(props.length);
        setPropiedadesActivas(
          props.filter((p) => p.estadoPublicacion === "activa").length,
        );
      } catch {
        /* silencioso */
      }
    };
    cargarStats();
  }, [usuario]);

  /**
   * Maneja el cambio de pestaña
   * @param tab - ID de la pestaña seleccionada
   */
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  /**
   * Renderiza el contenido de la sección activa
   * @returns Componente de la sección correspondiente
   */
  const renderActiveSection = () => {
    switch (activeTab) {
      case "propiedades":
        return <PropiedadesSection />;
      case "favoritos":
        return <FavoritosSection />;
      case "reportes":
        return <ReportesSection />;
      case "perfil":
        return <PerfilSection />;
      default:
        return <PropiedadesSection />;
    }
  };

  // Stats reales — solo datos verificables
  const estadisticas = [
    {
      id: 1,
      numero: String(totalPropiedades),
      label: "Propiedades",
      icono: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      ),
      color: "#35d2db",
    },
    {
      id: 2,
      numero: String(propiedadesActivas),
      label: "Activas",
      icono: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
      color: "#10b981",
    },
    {
      id: 3,
      numero: String(favIds.size),
      label: "Favoritos",
      icono: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78v0z" />
        </svg>
      ),
      color: "#ec4899",
    },
  ];

  return (
    <div className="my-panel">
      {/* Encabezado del panel */}
      <div className="my-panel__header">
        <div className="my-panel__header-content">
          <h1 className="my-panel__title">Mi Panel</h1>
          <p className="my-panel__subtitle">
            {isAdmin 
              ? "Configuración de tu cuenta de administrador" 
              : "Gestiona tus propiedades y configuración de cuenta"}
          </p>
        </div>
      </div>

      {/* Tarjetas de estadísticas (Ocultas para el administrador) */}
      {!isAdmin && (
        <div className="my-panel__stats">
          <div className="stats-container">
            {estadisticas.map((stat) => (
              <div key={stat.id} className="stat-card">
                <div className="stat-card__icon" style={{ color: stat.color }}>
                  {stat.icono}
                </div>
                <div className="stat-card__info">
                  <span className="stat-card__number">{stat.numero}</span>
                  <span className="stat-card__label">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navegación por pestañas (Solo para usuarios regulares) */}
      {!isAdmin && (
        <TabNavigator activeTab={activeTab} onTabChange={handleTabChange} isAdmin={isAdmin} />
      )}

      {/* Contenido de la sección activa */}
      <div className="my-panel__content">{renderActiveSection()}</div>
    </div>
  );
};

export default MyPanel;

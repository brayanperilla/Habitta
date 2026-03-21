import { useState, useEffect } from "react";
import CardPropetie from "../../components/cardPropetie/Card_propietie";
import { useProperties } from "@application/hooks/useProperties";
import { useFavorites } from "@application/hooks/useFavorites";
import { useAuth } from "@application/context/AuthContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import { LocationAutocomplete } from "../../components/LocationAutocomplete/LocationAutocomplete";
import ScrollToTopButton from "../../components/ScrollToTop/ScrollToTopButton";
import { propertyService } from "@application/services/propertyService";
import type { Caracteristica } from "@domain/entities/Caracteristica";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./styleProperties.css";

// Fix Leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const ITEMS_PER_PAGE = 20;

/**
 * Página de Propiedades.
 * Carga propiedades reales desde Supabase mediante el hook useProperties.
 * Permite filtrar propiedades dinámicamente.
 */
function PropertiesPage() {
  const { usuario } = useAuth();
  const { isFavorito, toggleFavorito } = useFavorites();
  const navigate = useNavigate();
  
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

  const [caracteristicas, setCaracteristicas] = useState<Caracteristica[]>([]);
  const [selectedCaracteristicas, setSelectedCaracteristicas] = useState<number[]>([]);
  
  // Nuevo estado para manejar qué dropdown está abierto (solo uno a la vez)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Estado para sidebar colapsable en móvil
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".custom-dropdown-container")) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    propertyService.getCaracteristicas().then(setCaracteristicas).catch(() => {});
  }, []);

  // Estado local para los inputs del formulario antes de aplicarlos, inicializado con URL
  const precioMaxFromUrl = searchParams.get("precioMax") ? Number(searchParams.get("precioMax")) : 7560000000;
  const [localFilters, setLocalFilters] = useState({
    searchTerm: searchParams.get("searchTerm") || "",
    tipoPropiedad: searchParams.get("tipoPropiedad") || "",
    tipoOperacion: searchParams.get("tipoOperacion") || "",
    precioMax: precioMaxFromUrl,
    areaMax: 5000,
    habitaciones: undefined as number | undefined,
    banos: undefined as number | undefined,
    estrato: undefined as number | undefined,
    sortBy: "Relevancia" as "Relevancia" | "Mayor a menor precio" | "Menor a mayor precio"
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');

  // El hook usará los filtros iniciales desde la URL directamente para evitar un doble fetch
  const { properties, loading, error, updateFilters } = useProperties({
    searchTerm: searchParams.get("searchTerm") || undefined,
    tipoPropiedad: searchParams.get("tipoPropiedad") || undefined,
    tipoOperacion: searchParams.get("tipoOperacion") || undefined,
    precioMax: precioMaxFromUrl,
    areaMax: 5000,
    sortBy: "Relevancia"
  });


  const handleApplyFilters = () => {
    // Al aplicar, enviamos el estado al hook, lo cual provocará un refetch
    updateFilters({
      searchTerm: localFilters.searchTerm || undefined,
      tipoPropiedad: localFilters.tipoPropiedad || undefined,
      tipoOperacion: localFilters.tipoOperacion || undefined,
      precioMax: localFilters.precioMax,
      areaMax: localFilters.areaMax,
      habitaciones: localFilters.habitaciones,
      banos: localFilters.banos,
      estrato: localFilters.estrato,
      caracteristicas: selectedCaracteristicas.length > 0 ? selectedCaracteristicas : undefined,
      sortBy: localFilters.sortBy
    });
    setCurrentPage(1);
  };

  // Escuchar enter en el buscador
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleApplyFilters();
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    const clear = {
      searchTerm: "",
      tipoPropiedad: "",
      tipoOperacion: "",
      precioMax: 7560000000,
      areaMax: 5000,
      habitaciones: undefined,
      banos: undefined,
      estrato: undefined,
      sortBy: "Relevancia" as const
    };
    setLocalFilters(clear);
    setSelectedCaracteristicas([]); // Limpiar características seleccionadas
    updateFilters({}); // Pasar un objeto vacío recarga todo
    setCurrentPage(1);
  };

  // Formateador de moneda
  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  };

  // Ordenar: primero las destacadas (Premium o Manual)
  const sortedProperties = [...properties].sort((a, b) => {
    const aPrio = (a.ownerPlan === "premium" || a.estadoPublicacion === "destacada") ? 1 : 0;
    const bPrio = (b.ownerPlan === "premium" || b.estadoPublicacion === "destacada") ? 1 : 0;
    return bPrio - aPrio;
  });

  const totalPages = Math.ceil(sortedProperties.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProperties = sortedProperties.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <>
      <h1 className="properties-title">Propiedades</h1>
      <p id="descripcionPropiedades">
        Encuentra tu hogar ideal entre miles de opciones verificadas
      </p>

      {/* Contenedor Principal */}
      <div className="properties-page">
        <div className="properties-page-layout">
          {/* Botón flotante filtros móvil */}
          <button
            className="mobile-filters-btn"
            onClick={() => setShowMobileFilters(true)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            Filtros
          </button>

          {/* Overlay móvil */}
          {showMobileFilters && (
            <div
              className="mobile-filters-overlay"
              onClick={() => setShowMobileFilters(false)}
            />
          )}

          {/* Sidebar */}
          <aside className={`filters-sidebar-vertical ${showMobileFilters ? 'filters-sidebar-vertical--open' : ''}`}>
            <h2 className="sidebar-title">Buscar inmuebles</h2>

            <div className="sidebar-filter-group">
              <label className="sidebar-label">Ubicación</label>
              <div className="sidebar-input-wrapper">
                <LocationAutocomplete 
                  value={localFilters.searchTerm}
                  onChange={(val) => setLocalFilters({ ...localFilters, searchTerm: val })}
                  onSelect={handleApplyFilters}
                  onKeyDown={handleKeyDown}
                  placeholder="Ciudad, zona, palabra clave..."
                />
              </div>
            </div>

            <div className="sidebar-filter-group custom-dropdown-container">
              <label className="sidebar-label">Tipo</label>
              <button 
                className="select-tipo-figma-custom sidebar-select-custom"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveDropdown(activeDropdown === 'tipo' ? null : 'tipo');
                }}
              >
                {localFilters.tipoPropiedad || "Cualquiera"}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: "8px", transform: activeDropdown === 'tipo' ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              {activeDropdown === 'tipo' && (
                <div className="custom-dropdown-panel" style={{width: '100%', boxSizing: 'border-box'}}>
                  {["Casa", "Apartamento", "Lote"].map(tipo => (
                    <div 
                      key={tipo} 
                      className="custom-dropdown-option"
                      onClick={() => {
                        setLocalFilters({...localFilters, tipoPropiedad: tipo});
                        setActiveDropdown(null);
                      }}
                    >
                      {tipo}
                    </div>
                  ))}
                  <div 
                    className="custom-dropdown-option clear-option"
                    onClick={() => {
                      setLocalFilters({...localFilters, tipoPropiedad: ""});
                      setActiveDropdown(null);
                    }}
                  >
                    Cualquiera
                  </div>
                </div>
              )}
            </div>

            <div className="sidebar-filter-group">
              <label className="sidebar-label">Precio Max: {formatCOP(localFilters.precioMax)}</label>
              <input
                type="range"
                className="range-slider-inline"
                min="0"
                max="7560000000"
                step="10000000"
                value={localFilters.precioMax}
                onChange={(e) => setLocalFilters({...localFilters, precioMax: Number(e.target.value)})}
              />
            </div>

            <div className="sidebar-filter-group">
              <label className="sidebar-label">Área Max: {localFilters.areaMax} m²</label>
              <input
                type="range"
                className="range-slider-inline"
                min="0"
                max="5000"
                step="10"
                value={localFilters.areaMax}
                onChange={(e) => setLocalFilters({...localFilters, areaMax: Number(e.target.value)})}
              />
            </div>

            <div className="sidebar-row-2">
              <div className="sidebar-filter-group custom-dropdown-container">
                <label className="sidebar-label">Habitaciones</label>
                <button 
                  className="sidebar-select-custom"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(activeDropdown === 'habitaciones' ? null : 'habitaciones');
                  }}
                >
                  {localFilters.habitaciones ? (localFilters.habitaciones >= 4 ? '4+' : localFilters.habitaciones) : 'Todas'}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: "auto", transform: activeDropdown === 'habitaciones' ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                {activeDropdown === 'habitaciones' && (
                  <div className="custom-dropdown-panel" style={{width: '100%', boxSizing: 'border-box'}}>
                    {[1, 2, 3, 4].map(num => (
                      <div 
                        key={num} 
                        className="custom-dropdown-option"
                        onClick={() => {
                          setLocalFilters({...localFilters, habitaciones: num});
                          setActiveDropdown(null);
                        }}
                      >
                        {num >= 4 ? '4+' : num}
                      </div>
                    ))}
                    <div 
                      className="custom-dropdown-option clear-option"
                      onClick={() => {
                        setLocalFilters({...localFilters, habitaciones: undefined});
                        setActiveDropdown(null);
                      }}
                    >
                      Todas
                    </div>
                  </div>
                )}
              </div>
              
              <div className="sidebar-filter-group custom-dropdown-container">
                <label className="sidebar-label">Baños</label>
                <button 
                  className="sidebar-select-custom"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(activeDropdown === 'banos' ? null : 'banos');
                  }}
                >
                  {localFilters.banos ? (localFilters.banos >= 4 ? '4+' : localFilters.banos) : 'Todos'}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: "auto", transform: activeDropdown === 'banos' ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                {activeDropdown === 'banos' && (
                  <div className="custom-dropdown-panel" style={{width: '100%', boxSizing: 'border-box'}}>
                    {[1, 2, 3, 4].map(num => (
                      <div 
                        key={num} 
                        className="custom-dropdown-option"
                        onClick={() => {
                          setLocalFilters({...localFilters, banos: num});
                          setActiveDropdown(null);
                        }}
                      >
                        {num >= 4 ? '4+' : num}
                      </div>
                    ))}
                    <div 
                      className="custom-dropdown-option clear-option"
                      onClick={() => {
                        setLocalFilters({...localFilters, banos: undefined});
                        setActiveDropdown(null);
                      }}
                    >
                      Todos
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="sidebar-filter-group custom-dropdown-container">
              <label className="sidebar-label">Estrato</label>
              <button 
                className="inline-select-custom sidebar-select-custom"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveDropdown(activeDropdown === 'estrato' ? null : 'estrato');
                }}
              >
                {localFilters.estrato || "Todos"}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: "auto", transform: activeDropdown === 'estrato' ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              {activeDropdown === 'estrato' && (
                <div className="custom-dropdown-panel estrato-panel" style={{width: '100%', boxSizing: 'border-box'}}>
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <div 
                      key={num} 
                      className="custom-dropdown-option"
                      onClick={() => {
                        setLocalFilters({...localFilters, estrato: num});
                        setActiveDropdown(null);
                      }}
                    >
                      {num}
                    </div>
                  ))}
                  <div 
                    className="custom-dropdown-option clear-option"
                    onClick={() => {
                      setLocalFilters({...localFilters, estrato: undefined});
                      setActiveDropdown(null);
                    }}
                  >
                    Todos
                  </div>
                </div>
              )}
            </div>

            {caracteristicas.length > 0 && (
              <div className="sidebar-filter-group caracteristicas-dropdown-wrapper custom-dropdown-container">
                <label className="sidebar-label">Características</label>
                <button
                  type="button"
                  className="caracteristicas-dropdown-btn sidebar-select-custom"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(activeDropdown === 'car' ? null : 'car');
                  }}
                >
                  Adicionales
                  {selectedCaracteristicas.length > 0 && (
                    <span className="car-badge">{selectedCaracteristicas.length}</span>
                  )}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: "auto", transform: activeDropdown === 'car' ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {activeDropdown === 'car' && (
                  <div className="caracteristicas-panel sidebar-car-panel">
                    <div className="caracteristicas-grid sidebar-car-grid">
                      {caracteristicas.map(c => (
                        <label key={c.idcaracteristica} className="car-check-label">
                          <input
                            type="checkbox"
                            className="car-checkbox"
                            checked={selectedCaracteristicas.includes(c.idcaracteristica)}
                            onChange={() => {
                              setSelectedCaracteristicas(prev =>
                                prev.includes(c.idcaracteristica)
                                  ? prev.filter(id => id !== c.idcaracteristica)
                                  : [...prev, c.idcaracteristica]
                              );
                            }}
                          />
                          <span className={selectedCaracteristicas.includes(c.idcaracteristica) ? "car-label-active" : ""}>
                            {c.nombre}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button className="sidebar-btn-search" onClick={() => { handleApplyFilters(); setShowMobileFilters(false); }}>Buscar</button>
            <button className="sidebar-btn-clear" onClick={handleClearFilters}>Limpiar Filtros</button>
          </aside>

          <div className="properties-results-area">
            <div className="results-header">
              <span className="results-count-label">Mostrando resultados ({properties.length})</span>
              
              <div className="results-header-controls">
                
                <div className="search-mid-row" style={{marginBottom: 0}}>
                  <span className="sort-label-figma" style={{textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px'}}>Ordenar por:</span>
                  <select
                    className="sort-select-figma"
                    value={localFilters.sortBy}
                    onChange={(e) => {
                      const newSort = e.target.value as any;
                      setLocalFilters({...localFilters, sortBy: newSort});
                      setTimeout(() => updateFilters({ ...localFilters, sortBy: newSort }), 0);
                    }}
                  >
                    <option value="Relevancia">Relevancia</option>
                    <option value="Mayor a menor precio">Mayor a menor precio</option>
                    <option value="Menor a mayor precio">Menor a mayor precio</option>
                  </select>
                </div>

                <div className="view-toggles-figma">
                  <button 
                    className={`grid-icon-btn ${viewMode === 'grid' ? 'active' : ''}`} 
                    aria-label="Vista cuadrícula"
                    onClick={() => setViewMode('grid')}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                  </button>
                  <button 
                    className={`grid-icon-btn ${viewMode === 'list' ? 'active' : ''}`} 
                    aria-label="Vista lista"
                    onClick={() => setViewMode('list')}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="8" y1="6" x2="21" y2="6"></line>
                      <line x1="8" y1="12" x2="21" y2="12"></line>
                      <line x1="8" y1="18" x2="21" y2="18"></line>
                      <line x1="3" y1="6" x2="3.01" y2="6"></line>
                      <line x1="3" y1="12" x2="3.01" y2="12"></line>
                      <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                  </button>
                  <button 
                    className={`grid-icon-btn map-btn ${viewMode === 'map' ? 'active' : ''}`} 
                    aria-label="Vista mapa"
                    onClick={() => setViewMode('map')}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                      <line x1="8" y1="2" x2="8" y2="18"></line>
                      <line x1="16" y1="6" x2="16" y2="22"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

          {/* Grilla de Resultados */}
          <main className="properties-results">
            {/* Estado de carga */}
            {loading && (
              <p style={{ textAlign: "center", padding: "2rem", color: "#aaa" }}>
                Cargando propiedades...
              </p>
            )}

            {/* Estado de error */}
            {error && (
              <p style={{ textAlign: "center", padding: "2rem", color: "#f66" }}>
                Error al cargar: {error}
              </p>
            )}

            {/* Sin resultados */}
            {!loading && !error && properties.length === 0 && (
              <p style={{ textAlign: "center", padding: "2rem", color: "#aaa" }}>
                No se encontraron propiedades con estos filtros.
              </p>
            )}

            {!loading && !error && properties.length > 0 && (
              <>
                {viewMode === 'map' ? (
                  <div className="properties-map-view" style={{ height: "calc(100vh - 200px)", minHeight: "400px", width: "100%", borderRadius: "12px", overflow: "hidden", marginBottom: "2rem", zIndex: 0, position: "relative" }}>
                    <MapContainer 
                      center={[4.5709, -74.2973]} 
                      zoom={6} 
                      minZoom={5}
                      maxBounds={[[-5, -85], [15, -65]]}
                      maxBoundsViscosity={1.0}
                      style={{ height: "100%", width: "100%", zIndex: 1 }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      {sortedProperties.map((property) => {
                        const lat = property.latitud ?? null;
                        const lng = property.longitud ?? null;
                        if (lat !== null && lng !== null) {
                          const position: [number, number] = [lat, lng];
                          return (
                            <Marker key={property.idpropiedad} position={position}>
                              <Popup>
                                <div style={{ width: "200px" }}>
                                  <img 
                                    src={property.fotoUrl || "/images/auth/dream_home_1.png"} 
                                    alt={property.titulo || "Propiedad"} 
                                    style={{ width: "100%", borderRadius: "4px", marginBottom: "8px" }} 
                                  />
                                  <h4 style={{ margin: "0 0 4px", fontSize: "0.9rem" }}>{property.titulo}</h4>
                                  <p style={{ margin: "0 0 8px", fontSize: "0.8rem", color: "#666" }}>{property.ciudad}, {property.departamento}</p>
                                  <button 
                                    onClick={() => navigate(`/propertydetailspage/${property.idpropiedad}`)}
                                    style={{ background: "#2da8bb", color: "white", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem", width: "100%" }}
                                  >
                                    Ver detalles
                                  </button>
                                </div>
                              </Popup>
                            </Marker>
                          );
                        }
                        return null;
                      })}
                    </MapContainer>
                  </div>
                ) : (
                  <div className={`property-cards-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
                    {paginatedProperties.map((property) => (
                      <CardPropetie
                        key={property.idpropiedad}
                        property={property}
                        isFav={isFavorito(property.idpropiedad)}
                        onToggleFav={usuario ? toggleFavorito : undefined}
                        compact={viewMode === 'list'}
                      />
                    ))}
                  </div>
                )}

                {/* Paginación Avanzada */}
                {viewMode !== 'map' && totalPages > 1 && (
                  <div className="pagination">
                    {/* Doble flecha: ir al inicio */}
                    <button
                      className="pagination__btn"
                      disabled={currentPage === 1}
                      onClick={() => { setCurrentPage(1); window.scrollTo(0, 0); }}
                      title="Primera página"
                    >«</button>
                    {/* Anterior */}
                    <button
                      className="pagination__btn"
                      disabled={currentPage === 1}
                      onClick={() => { setCurrentPage(p => p - 1); window.scrollTo(0, 0); }}
                    >‹ Anterior</button>

                    {/* Botones numéricos */}
                    {(() => {
                      const pages: (number | string)[] = [];
                      if (totalPages <= 5) {
                        for (let i = 1; i <= totalPages; i++) pages.push(i);
                      } else if (currentPage <= 3) {
                        pages.push(1, 2, 3, 4, 5);
                      } else if (currentPage >= totalPages - 2) {
                        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
                      } else if (currentPage > 10) {
                        pages.push(currentPage - 2, '...', currentPage, '...', currentPage + 2);
                      } else {
                        pages.push(currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2);
                      }
                      return pages.map((p, i) => 
                        typeof p === 'string' ? (
                          <span key={`e${i}`} className="pagination__ellipsis">{p}</span>
                        ) : (
                          <button
                            key={p}
                            className={`pagination__btn ${p === currentPage ? 'pagination__btn--active' : ''}`}
                            onClick={() => { setCurrentPage(p); window.scrollTo(0, 0); }}
                          >{p}</button>
                        )
                      );
                    })()}

                    {/* Siguiente */}
                    <button
                      className="pagination__btn"
                      disabled={currentPage === totalPages}
                      onClick={() => { setCurrentPage(p => p + 1); window.scrollTo(0, 0); }}
                    >Siguiente ›</button>
                    {/* Doble flecha: ir al final */}
                    <button
                      className="pagination__btn"
                      disabled={currentPage === totalPages}
                      onClick={() => { setCurrentPage(totalPages); window.scrollTo(0, 0); }}
                      title="Última página"
                    >»</button>

                    {/* Info */}
                    <span className="pagination__info">Pág. {currentPage} de {totalPages}</span>
                  </div>
                )}
              </>
            )}
          </main>
          </div>
        </div>
      </div>
      <ScrollToTopButton />
    </>
  );
}

export default PropertiesPage;

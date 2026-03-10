import { useState, useEffect } from "react";
import CardPropetie from "../../components/cardPropetie/Card_propietie";
import { useProperties } from "@application/hooks/useProperties";
import { useFavorites } from "@application/hooks/useFavorites";
import { useAuth } from "@application/context/AuthContext";
import { useSearchParams } from "react-router-dom";
import { LocationAutocomplete } from "../../components/LocationAutocomplete/LocationAutocomplete";
import ScrollToTopButton from "../../components/ScrollToTop/ScrollToTopButton";
import { propertyService } from "@application/services/propertyService";
import type { Caracteristica } from "@domain/entities/Caracteristica";
import "./styleProperties.css";

const ITEMS_PER_PAGE = 20;

/**
 * Página de Propiedades.
 * Carga propiedades reales desde Supabase mediante el hook useProperties.
 * Permite filtrar propiedades dinámicamente.
 */
function PropertiesPage() {
  const { usuario } = useAuth();
  const { isFavorito, toggleFavorito } = useFavorites();
  
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

  // Características disponibles y seleccionadas para el filtro
  const [caracteristicas, setCaracteristicas] = useState<Caracteristica[]>([]);
  const [selectedCaracteristicas, setSelectedCaracteristicas] = useState<number[]>([]);
  const [caracteristicasOpen, setCaracteristicasOpen] = useState(false);

  useEffect(() => {
    propertyService.getCaracteristicas().then(setCaracteristicas).catch(() => {});
  }, []);

  // Estado local para los inputs del formulario antes de aplicarlos, inicializado con URL
  const precioMaxFromUrl = searchParams.get("precioMax") ? Number(searchParams.get("precioMax")) : 7560000000;
  const [localFilters, setLocalFilters] = useState({
    searchTerm: searchParams.get("searchTerm") || "",
    tipoPropiedad: searchParams.get("tipoPropiedad") || "",
    precioMax: precioMaxFromUrl,
    areaMax: 870,
    habitaciones: undefined as number | undefined,
    banos: undefined as number | undefined,
    estrato: undefined as number | undefined,
    sortBy: "Relevancia" as "Relevancia" | "Mayor a menor precio" | "Menor a mayor precio"
  });

  // El hook usará los filtros iniciales desde la URL directamente para evitar un doble fetch
  const { properties, loading, error, updateFilters } = useProperties({
    searchTerm: searchParams.get("searchTerm") || undefined,
    tipoPropiedad: searchParams.get("tipoPropiedad") || undefined,
    precioMax: precioMaxFromUrl,
    areaMax: 870,
    sortBy: "Relevancia"
  });


  const handleApplyFilters = () => {
    // Al aplicar, enviamos el estado al hook, lo cual provocará un refetch
    updateFilters({
      searchTerm: localFilters.searchTerm || undefined,
      tipoPropiedad: localFilters.tipoPropiedad || undefined,
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
      precioMax: 7560000000,
      areaMax: 870,
      habitaciones: undefined,
      banos: undefined,
      estrato: undefined,
      sortBy: "Relevancia" as const
    };
    setLocalFilters(clear);
    updateFilters({}); // Pasar un objeto vacío recarga todo
    setCurrentPage(1);
  };

  // Formateador de moneda
  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  };

  const totalPages = Math.ceil(properties.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProperties = properties.slice(
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
        {/* Barra de Búsqueda y Filtros en un solo contenedor blanco */}
        <section className="search-bar-figma">
          
          {/* Fila 1: Buscador y botón central */}
          <div className="search-top-row">
            <div className="search-input-wrapper">
              <button className="search-icon-btn" aria-label="Buscar" onClick={handleApplyFilters}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
              <LocationAutocomplete 
                value={localFilters.searchTerm}
                onChange={(val) => setLocalFilters({ ...localFilters, searchTerm: val })}
                onSelect={handleApplyFilters}
                onKeyDown={handleKeyDown}
                placeholder="Escribe la ciudad, zona, barrio o palabras cla..."
              />
            </div>

            <div className="filter-dropdown-figma">
              <select
                className="select-tipo-figma"
                value={localFilters.tipoPropiedad}
                onChange={(e) => setLocalFilters({...localFilters, tipoPropiedad: e.target.value})}
              >
                <option value="">Tipo</option>
                <option value="Casa">Casa</option>
                <option value="Apartamento">Apartamento</option>
                <option value="Lote">Lote</option>
                <option value="Finca">Finca</option>
              </select>
            </div>

            <button className="btn-search-figma" onClick={handleApplyFilters}>Buscar</button>
            
            <div className="view-toggles-figma">
              <button className="grid-icon-btn active" aria-label="Vista cuadrícula"></button>
              <button className="grid-icon-btn" aria-label="Vista lista"></button>
              <button className="grid-icon-btn map-btn" aria-label="Vista mapa"></button>
            </div>
          </div>

          {/* Fila 2: Orden y Limpieza */}
          <div className="search-mid-row">
            <span className="sort-label-figma">Ordenar por:</span>
            <select
              className="sort-select-figma"
              value={localFilters.sortBy}
              onChange={(e) => {
                const newSort = e.target.value as any;
                setLocalFilters({...localFilters, sortBy: newSort});
                // setTimeout wrapper is not strictly needed if we just call updateFilters manually, but using apply avoids drift
                setTimeout(() => updateFilters({ ...localFilters, sortBy: newSort }), 0);
              }}
            >
              <option value="Relevancia">Relevancia</option>
              <option value="Mayor a menor precio">Mayor a menor precio</option>
              <option value="Menor a mayor precio">Menor a mayor precio</option>
            </select>
            
            <button className="clear-filters-figma" onClick={handleClearFilters}>Limpiar Filtros</button>
          </div>

          {/* Fila 3: Filtros Avanzados (Pills) */}
          <div className="search-bottom-row-figma">
            {/* Rango de Precio */}
            <div className="filter-group-inline">
              <label>Precio Max: {formatCOP(localFilters.precioMax)}</label>
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

            {/* Rango de Área */}
            <div className="filter-group-inline">
              <label>Área Max: {localFilters.areaMax} m²</label>
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

            {/* Habitaciones */}
            <div className="filter-group-inline">
              <label>Habitaciones</label>
              <div className="button-group-inline">
                {[1, 2, 3, 4].map(num => (
                  <button 
                    key={num} 
                    className={`option-btn ${localFilters.habitaciones === num ? 'active' : ''}`}
                    onClick={() => {
                      setLocalFilters(prev => ({...prev, habitaciones: prev.habitaciones === num ? undefined : num}));
                    }}
                  >
                    {num}{num === 4 ? '+' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Baños */}
            <div className="filter-group-inline">
              <label>Baños</label>
              <div className="button-group-inline">
                {[1, 2, 3, 4].map(num => (
                  <button 
                    key={num} 
                    className={`option-btn ${localFilters.banos === num ? 'active' : ''}`}
                    onClick={() => {
                      setLocalFilters(prev => ({...prev, banos: prev.banos === num ? undefined : num}));
                    }}
                  >
                    {num}{num === 4 ? '+' : ''}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Estrato */}
            <div className="filter-group-inline">
              <label>Estrato</label>
              <select 
                className="inline-select"
                value={localFilters.estrato || ""} 
                onChange={(e) => {
                  const val = e.target.value ? Number(e.target.value) : undefined;
                  setLocalFilters({...localFilters, estrato: val});
                }}
              >
                <option value="">Todos</option>
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            {/* Características — dropdown estilo AnimeFlv */}
            {caracteristicas.length > 0 && (
              <div className="filter-group-inline caracteristicas-dropdown-wrapper">
                <button
                  type="button"
                  className="caracteristicas-dropdown-btn"
                  onClick={() => setCaracteristicasOpen(prev => !prev)}
                >
                  Características
                  {selectedCaracteristicas.length > 0 && (
                    <span className="car-badge">{selectedCaracteristicas.length}</span>
                  )}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: "auto", transform: caracteristicasOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {caracteristicasOpen && (
                  <div className="caracteristicas-panel">
                    <div className="caracteristicas-grid">
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

            <button className="btn-apply-filters-inline" onClick={handleApplyFilters}>
              Aplicar filtros
            </button>
          </div>
        </section>


        <div className="content-wrapper full-width-wrapper">

          {/* Grilla de Resultados */}
          <main className="properties-grid">
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

            {/* Tarjetas de propiedades paginadas */}
            <div className="property-cards-grid">
              {paginatedProperties.map((property) => (
                <CardPropetie
                  key={property.idpropiedad}
                  property={property}
                  isFav={isFavorito(property.idpropiedad)}
                  onToggleFav={usuario ? toggleFavorito : undefined}
                />
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="button-page">
                <button
                  className="page-btn"
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage((p) => p - 1);
                    window.scrollTo(0, 0);
                  }}
                >
                  ← Anterior
                </button>
                <span style={{ padding: "0.5rem 1rem", fontWeight: 600 }}>
                  {currentPage} de {totalPages}
                </span>
                <button
                  className="page-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage((p) => p + 1);
                    window.scrollTo(0, 0);
                  }}
                >
                  Siguiente →
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
      <ScrollToTopButton />
    </>
  );
}

export default PropertiesPage;

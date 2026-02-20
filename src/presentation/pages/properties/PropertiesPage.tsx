import CardPropetie from "../../components/cardPropetie/Card_propietie";
import { useProperties } from "@application/hooks/useProperties";
import { useFavorites } from "@application/hooks/useFavorites";
import { useAuth } from "@application/context/AuthContext";
import "./styleProperties.css";

/**
 * Página de Propiedades.
 * Carga propiedades reales desde Supabase mediante el hook useProperties.
 * Muestra estados de carga, error y lista vacía.
 */
function PropertiesPage() {
  const { properties, loading, error } = useProperties();
  const { usuario } = useAuth();
  const { isFavorito, toggleFavorito } = useFavorites();

  return (
    <>
      <h1 className="properties-title">Propiedades</h1>
      <p id="descripcionPropiedades">
        Encuentra tu hogar ideal entre miles de opciones verificadas
      </p>

      {/* Contenedor Principal */}
      <div className="properties-page">
        {/* Barra de Búsqueda y Filtros */}
        <section className="search-bar">
          {/* Campo de Búsqueda Principal */}
          <div className="search-input">
            <button className="search-icon" aria-hidden></button>
            <input
              type="search"
              placeholder="Buscar por ubicación, tipo de propiedad"
            />
          </div>

          {/* Filtros Rápidos */}
          <div className="filters">
            {/* Filtro de Tipo de Propiedad */}
            <div className="filter-dropdown">
              <button className="filter pill">Casa ▼</button>
              <div className="dropdown-menu">
                <button className="dropdown-item">Casa</button>
                <button className="dropdown-item">Apartamento</button>
              </div>
            </div>
            {/* Filtro de Rango de Precio */}
            <div className="filter-dropdown">
              <button className="filter pill">$0 - $100k ▼</button>
              <div className="dropdown-menu">
                <button className="dropdown-item">$0 - $100k</button>
                <button className="dropdown-item">$100k - $500k</button>
                <button className="dropdown-item">$500k - $1M</button>
              </div>
            </div>
          </div>

          {/* Botón de Acción y Alternadores */}
          <div className="actions">
            <button className="btn-search">Buscar</button>
            <div className="view-toggles">
              {/* Botones de Vista */}
              <button className="icon"></button>
              <button className="icon"></button>
              <button className="icon"></button>
            </div>
          </div>

          {/* Opciones de Ordenamiento */}
          <div className="search-bottom">
            <div className="sort">
              <span>Ordenar por:</span>
              <div className="sort-dropdown">
                <button className="pill current">Relevancia ▼</button>
                <div className="dropdown-menu">
                  <button className="dropdown-item">Relevancia</button>
                  <button className="dropdown-item">
                    Mayor a menor precio
                  </button>
                  <button className="dropdown-item">
                    Menor a mayor precio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="content-wrapper">
          {/* Barra Lateral de Filtros */}
          <aside className="filters-sidebar">
            <div className="filters-header">
              <h3>Filtros</h3>
              <button className="clear-filters">Limpiar</button>
            </div>

            {/* Filtro de Tipo de Propiedad */}
            <div className="filter-group">
              <label>Tipo de propiedad</label>
              <select defaultValue="">
                <option value="">Seleccionar</option>
                <option value="casa">Casa</option>
                <option value="apartamento">Apartamento</option>
                <option value="lote">Lote</option>
              </select>
            </div>

            {/* Rango de Precio */}
            <div className="filter-group">
              <label>Rango de precio</label>
              <div className="range-container">
                <input
                  type="range"
                  className="range-slider"
                  min="0"
                  max="7560000000"
                  defaultValue="3780000000"
                />
                <div className="range-labels">
                  <span>$0 COP</span>
                  <span>$7.560.000.000 COP</span>
                </div>
              </div>
            </div>

            {/* Área */}
            <div className="filter-group">
              <label>Área (m²)</label>
              <div className="range-container">
                <input
                  type="range"
                  className="range-slider"
                  min="0"
                  max="870"
                  defaultValue="435"
                />
                <div className="range-labels">
                  <span>0 m²</span>
                  <span>870 m²</span>
                </div>
              </div>
            </div>

            {/* Habitaciones */}
            <div className="filter-group">
              <label>Habitaciones</label>
              <div className="button-group">
                <button className="option-btn">1</button>
                <button className="option-btn">2</button>
                <button className="option-btn">3</button>
                <button className="option-btn">4+</button>
              </div>
            </div>

            {/* Baños */}
            <div className="filter-group">
              <label>Baños</label>
              <div className="button-group">
                <button className="option-btn">1</button>
                <button className="option-btn">2</button>
                <button className="option-btn">3</button>
                <button className="option-btn">4+</button>
              </div>
            </div>

            {/* Estrato */}
            <div className="filter-group">
              <label>Estrato</label>
              <div className="button-group">
                <button className="option-btn">1</button>
                <button className="option-btn">2</button>
                <button className="option-btn">3</button>
                <button className="option-btn">4</button>
                <button className="option-btn">5</button>
                <button className="option-btn">6</button>
              </div>
            </div>

            {/* Botón de Aplicar */}
            <button className="btn-apply-filters">Aplicar filtros</button>
          </aside>

          {/* Grilla de Resultados */}
          <main className="properties-grid">
            {/* Estado de carga */}
            {loading && (
              <p
                style={{ textAlign: "center", padding: "2rem", color: "#aaa" }}
              >
                Cargando propiedades...
              </p>
            )}

            {/* Estado de error */}
            {error && (
              <p
                style={{ textAlign: "center", padding: "2rem", color: "#f66" }}
              >
                Error al cargar: {error}
              </p>
            )}

            {/* Sin resultados */}
            {!loading && !error && properties.length === 0 && (
              <p
                style={{ textAlign: "center", padding: "2rem", color: "#aaa" }}
              >
                No hay propiedades disponibles.
              </p>
            )}

            {/* Tarjetas de propiedades reales desde Supabase */}
            <div className="property-cards-grid">
              {properties.map((property) => (
                <CardPropetie
                  key={property.idpropiedad}
                  property={property}
                  isFav={isFavorito(property.idpropiedad)}
                  onToggleFav={usuario ? toggleFavorito : undefined}
                />
              ))}
            </div>

            <br />

            {/* Paginación */}
            {properties.length > 0 && (
              <div className="button-page">
                <button className="page-btn">« Anterior</button>
                <button className="page-btn">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <button className="page-btn">Siguiente »</button>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default PropertiesPage;

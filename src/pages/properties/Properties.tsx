import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import CardPropetie from "../../components/cardPropetie/Card_propietie";
import './styleProperties.css';

function Properties() {
    return (
        <>
        <Navbar>
        </Navbar> 
        <h1>Propiedades</h1>
        <p id="descripcionPropiedades">Encuentra tu hogar ideal entre miles de opciones verificadas</p>
         <div className="properties-page">
            <section className="search-bar">
                <div className="search-input">
                    <button className="search-icon" aria-hidden>🔍</button>
                    <input type="search" placeholder="Buscar por ubicación, tipo de propiedad" />
                </div>

                <div className="filters">
                    <div className="filter-dropdown">
                        <button className="filter pill">Casa ▼</button>
                        <div className="dropdown-menu">
                            <button className="dropdown-item">Casa</button>
                            <button className="dropdown-item">Apartamento</button>
                        </div>
                    </div>
                    <div className="filter-dropdown">
                        <button className="filter pill">$0 - $100k ▼</button>
                        <div className="dropdown-menu">
                            <button className="dropdown-item">$0 - $100k</button>
                            <button className="dropdown-item">$100k - $500k</button>
                            <button className="dropdown-item">$500k - $1M</button>
                        </div>
                    </div>
                </div>

                <div className="actions">
                    <button className="btn-search">🔍 Buscar</button>
                    <div className="view-toggles">
                        <button className="icon">▦</button>
                        <button className="icon">☰</button>
                        <button className="icon">▭</button>
                    </div>
                </div>
                 <div className="search-bottom">
                <div className="sort">
                    <span>Ordenar por:</span>
                    <div className="sort-dropdown">
                        <button className="pill current">Relevancia ▼</button>
                        <div className="dropdown-menu">
                            <button className="dropdown-item">Relevancia</button>
                            <button className="dropdown-item">Mayor a menor precio</button>
                            <button className="dropdown-item">Menor a mayor precio</button>
                        </div>
                    </div>
                </div>
            </div>
            </section>

            <div className="content-wrapper">
                {/* Sidebar de filtros */}
                <aside className="filters-sidebar">
                    <div className="filters-header">
                        <h3>Filtros</h3>
                        <button className="clear-filters">Limpiar</button>
                    </div>

                    {/* Tipo de operación */}
                    <div className="filter-group">
                        <label>Tipo de operación</label>
                        <select defaultValue="">
                            <option value="">Seleccionar</option>
                            <option value="sale">Venta</option>
                            <option value="rent">Arriendo</option>
                        </select>
                    </div>

                    {/* Tipo de propiedad */}
                    <div className="filter-group">
                        <label>Tipo de propiedad</label>
                        <select defaultValue="">
                            <option value="">Seleccionar</option>
                            <option value="house">Casa</option>
                            <option value="apartment">Apartamento</option>
                            <option value="lot">Lote</option>
                        </select>
                    </div>

                    {/* Rango de precio */}
                    <div className="filter-group">
                        <label>Rango de precio</label>
                        <div className="range-container">
                            <input type="range" className="range-slider" min="0" max="7560000000" defaultValue="3780000000" />
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
                            <input type="range" className="range-slider" min="0" max="870" defaultValue="435" />
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

                    {/* Botón aplicar filtros */}
                    <button className="btn-apply-filters">Aplicar filtros</button>
                </aside>

                <main className="properties-grid">

                    {/* Las tarjetas de propiedades irán aquí */}
                     <CardPropetie>
                          </CardPropetie>
                          <br />
                          <div className="button-page">
                            <button className="page-btn">« Anterior</button>
                            <button className="page-btn">1</button>
                            <button className="page-btn">2</button>
                            <button className="page-btn">3</button>
                            <button className="page-btn">Siguiente »</button>
                          </div>
                          

                </main>
            </div>
        </div>
        <Footer>
        </Footer>

        </>
    )
}

export default Properties;
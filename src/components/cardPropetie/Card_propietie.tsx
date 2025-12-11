import "./cardStyle.css"

function CardPropetie(){
    return (
        <div className="cards-grid">
        
        <div className="property-card">
            <div className="property-card__image-container">
                
                
                <span className="property-card__status property-card__status--disponible">disponible</span>

                <div className="property-card__actions">
                    <button className="property-card__action-btn" title="Agregar a favoritos">❤️</button>
                    <button className="property-card__action-btn" title="Compartir">📤</button>
                </div>
            </div>

            <div className="property-card__body">
                <h3 className="property-card__title">Casa moderna en Medellín</h3>
                
                <p className="property-card__location">📍 Medellín, Antioquia</p>
                
                <p className="property-card__price">3.200.000.000 COP</p>

                <div className="property-card__features">
                    <span className="property-card__feature">
                        <span className="property-card__feature-icon">🛏️</span>
                        4
                    </span>
                    <span className="property-card__feature">
                        <span className="property-card__feature-icon">🚿</span>
                        3
                    </span>
                    <span className="property-card__feature">
                        <span className="property-card__feature-icon">📐</span>
                        250 m²
                    </span>
                </div>

                <button className="property-card__btn-details">Ver detalles</button>
            </div>
        </div>

        
        <div className="property-card">
            <div className="property-card__image-container">
                
                
                <span className="property-card__status property-card__status--vendida">vendida</span>

                <div className="property-card__actions">
                    <button className="property-card__action-btn" title="Agregar a favoritos">🤍</button>
                    <button className="property-card__action-btn" title="Compartir">📤</button>
                </div>
            </div>

            <div className="property-card__body">
                <h3 className="property-card__title">Apartamento de lujo con vista</h3>
                
                <p className="property-card__location">📍 Bogotá, Cundinamarca</p>
                
                <p className="property-card__price">2.500.000.000 COP</p>

                <div className="property-card__features">
                    <span className="property-card__feature">
                        <span className="property-card__feature-icon">🛏️</span>
                        3
                    </span>
                    <span className="property-card__feature">
                        <span className="property-card__feature-icon">🚿</span>
                        2
                    </span>
                    <span className="property-card__feature">
                        <span className="property-card__feature-icon">📐</span>
                        180 m²
                    </span>
                </div>

                <button className="property-card__btn-details">Ver detalles</button>
            </div>
        </div>

        
        <div className="property-card">
            <div className="property-card__image-container">
                
                
                <span className="property-card__status property-card__status--alquilada">alquilada</span>

                <div className="property-card__actions">
                    <button className="property-card__action-btn" title="Agregar a favoritos">🤍</button>
                    <button className="property-card__action-btn" title="Compartir">📤</button>
                </div>
            </div>

            <div className="property-card__body">
                <h3 className="property-card__title">Casa campestre con piscina</h3>
                
                <p className="property-card__location">📍 Cali, Valle del Cauca</p>
                
                <p className="property-card__price">1.800.000.000 COP</p>

                <div className="property-card__features">
                    <span className="property-card__feature">
                        <span className="property-card__feature-icon">🛏️</span>
                        5
                    </span>
                    <span className="property-card__feature">
                        <span className="property-card__feature-icon">🚿</span>
                        4
                    </span>
                    <span className="property-card__feature">
                        <span className="property-card__feature-icon">📐</span>
                        350 m²
                    </span>
                </div>

                <button className="property-card__btn-details">Ver detalles</button>
            </div>
        </div>
    </div>
    );
}
export default CardPropetie;
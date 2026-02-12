import "../promotion/promotion.css";
import { useState } from "react";
import PublicationBasic from "./modals/publicationBasic/PublicationBasic";
import PublicationOutstanding from "./modals/publicationOutstanding/PublicationOutstanding";
import SuccessAlertStack, { type Alert } from "../../components/alerts/successAlert/SuccessAlertStack";

// Componente de Promoción
function Promotion() {
  const [isBasicModalOpen, setIsBasicModalOpen] = useState(false);
  const [isOutstandingModalOpen, setIsOutstandingModalOpen] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const openBasicModal = () => setIsBasicModalOpen(true);
  const closeBasicModal = () => setIsBasicModalOpen(false);
  
  const openOutstandingModal = () => setIsOutstandingModalOpen(true);
  const closeOutstandingModal = () => setIsOutstandingModalOpen(false);

  const handlePublishSuccess = () => {
    const newAlert: Alert = {
      id: Date.now().toString() + Math.random(),
      message: "Propiedad publicada exitosamente",
    };

    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
    setIsBasicModalOpen(false);
    setIsOutstandingModalOpen(false);

    // Auto-remove alert after 3 seconds
    setTimeout(() => {
      setAlerts((prevAlerts) => prevAlerts.filter((a) => a.id !== newAlert.id));
    }, 3000);
  };

  const removeAlert = (id: string) => {
    setAlerts((prevAlerts) => prevAlerts.filter((a) => a.id !== id));
  };

  return (
    <div className="promotion-container">
      <h1 className="promotion-title">Planes de Publicación</h1>
      <p className="promotion-subtitle">
        Aumenta la visibilidad de tu propiedad
      </p>

      <div className="promotion-cards">
        {/* Plan Básico */}
        <div className="promotion-card basic">
          <h2>Publicación Básica</h2>
          <p className="card-subtitle">Publicación estándar de tu propiedad</p>
          <p className="price">$0</p>
          <p className="price-label">Por 30 días</p>
          <ul className="feature-list">
            <li>
              <span className="check basic">✔</span> Publicación por 30 días
            </li>
            <li>
              <span className="check basic">✔</span> Hasta 7 fotos
            </li>
            <li>
              <span className="check basic">✔</span> Aparece en búsquedas
            </li>
          </ul>
          <button className="select-button orange" onClick={openBasicModal}>
            Seleccionar Plan
          </button>
        </div>

        {/* Plan Destacado */}
        <div className="promotion-card featured">
          <h2>Publicación Destacada</h2>
          <p className="card-subtitle">Tu propiedad destacada en los resultados</p>
          <p className="price">$199</p>
          <p className="price-label">Por 30 días</p>
          <ul className="feature-list">
            <li>
              <span className="check featured">✔</span> Publicación por 30 días
            </li>
            <li>
              <span className="check featured">✔</span> Hasta 15 fotos
            </li>
            <li>
              <span className="check featured">✔</span> Aparece como destacada
            </li>
            <li>
              <span className="check featured">✔</span> Mayor visibilidad
            </li>
            <li>
              <span className="check featured">✔</span> Etiqueta de destacado
            </li>
          </ul>
          <button className="select-button teal" onClick={openOutstandingModal}>Seleccionar Plan</button>
        </div>
      </div>

      <PublicationBasic isOpen={isBasicModalOpen} onClose={closeBasicModal} onPublish={handlePublishSuccess} />
      <PublicationOutstanding isOpen={isOutstandingModalOpen} onClose={closeOutstandingModal} onPublish={handlePublishSuccess} />
      <SuccessAlertStack alerts={alerts} onRemove={removeAlert} />
    </div>
  );
}

export default Promotion;

